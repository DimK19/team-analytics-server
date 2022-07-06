import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Mon } from './mon/entities/mon.entity';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

/* TODO
 * validate input (yes I am parsing it in the frontend,
 * but it should be checked here)
 */

@Injectable()
export class AppService {
    constructor(private httpService: HttpService, @InjectEntityManager() private manager: EntityManager) {}

    private offNatures: string[] = ["lonely", "adamant", "naughty", "brave", "modest", "mild", "rash", "quiet"];
    private defNatures: string[] = ["bold", "impish", "relaxed", "lax", "calm", "gentle", "careful", "sassy"];
    private speNatures: string[] = ["timid", "hasty", "jolly", "naive"];
    private minusSpeNatures: string[] = ["brave", "relaxed", "quiet", "sassy"];

    // http://tau-prolog.org/manual/compatibility-with-nodejs
    async getStats(team): Promise<any> { // TODO void for now, will return object
        // extrapolate ev statistics

        let evObj = {
            "hp": 0,
            "atk": 0,
            "def": 0,
            "spa": 0,
            "spd": 0,
            "spe": 0
        };

        let natureObj = {
            offense: 0,
            defense: 0,
            speed: 0
        };

        var monArr = [];
        var types: string[] = [];
        var speed: number = 0;
        var speedFlag: number = 0;
        var speeds: number[] = [];

        for(let member of team['members']) {
            const nameInDB = member.name.replaceAll(/\W/g, ''); // remove dashes and apostrophes
            const mon = await this.manager.findOne(Mon, {name: nameInDB});

            speedFlag = 0;

            if(!mon) {
                let response = await firstValueFrom(this.httpService.get(`https://pokeapi.co/api/v2/pokemon/${member.name}`)); // name with punctuation needed here
                // TODO IMPORTANT validate response
                // TODO learn functional programming
                types = response.data.types.map(({type: {name}}) => ({name})).map((obj) => obj.name);
                speed = response.data.stats[5].base_stat; // stats is an array of length 6

                var createMonDto = {
                    name: nameInDB,
                    type_1: types[0],
                    type_2: types[1] || null, // woeful or genius, undecided
                    speed: speed
                }

                this.manager.transaction(async manager => {
                    const newMon = await this.manager.create(Mon, createMonDto);
                    this.manager.save(newMon);
                });
            }
            else {
                // already cached in sqlite3 mini-database
                types = [mon.type_1, mon.type_2].filter(x => x); // removing null is that easy
                speed = mon.speed;
            }

            monArr.push({
                mon: {
                    name: nameInDB,
                    types: types,
                    speed: speed
                }
            });

            for(let i of member["evs"]) {
                evObj[i.ev.stat] += i.ev.value;
                if(i.ev.stat === "spe") speedFlag = i.ev.value;
            }
            if(this.offNatures.includes(member["nature"])) natureObj.offense += 1;
            else if(this.defNatures.includes(member["nature"])) natureObj.defense += 1;
            else if(this.speNatures.includes(member["nature"])) natureObj.speed += 1;
            // there must be a more clever way of doing this

            speeds.push(this.calculateSpeed(speed, member["nature"], speedFlag));
        }

        // const sumObjectValues = obj => Object.values(obj).reduce((x, y) => x + y);
        const evSum = Object.values(evObj).reduce((x, y) => x + y);
        let evArr = Object.values(evObj).map((x) => x / evSum);

        Object.keys(evObj).forEach((key, i) => evObj[key] = evArr[i]);

        let monTypes: string[][] = monArr.map(({mon: {types}}) => types);
        // TODO console.log(typeof(monArr)); -> Object, not Object[], why?

        return {
            mons: monArr,
            evs: evObj,
            natures: natureObj,
            unresisted_pairs: await this.getImportantPairs(monTypes),
            weak_pairs: await this.getImportantPairs(monTypes, "weak"),
            highest_speed: Math.max(...speeds),
            lowest_speed: Math.min(...speeds)
        };
    }

    // TODO proper return type, perhaps with an interface
    getIndividualWeakness(type: string[]): string[] {
        // http://tau-prolog.org/manual/promises-interface
        const pl = require("tau-prolog");
        const fs = require('fs');
        require("tau-prolog/modules/promises.js")(pl);

        let res = [];

        (async() => {

            const program = fs.readFileSync('./predicatesxy.pl', 'utf8');
            let index = type.length - 1; // makeshift way to construct the prolog query when there is only one type
            const goal = `weak_two(${type[0]},${type[index]}, Z).`;
            const session = pl.create();
            await session.promiseConsult(program);
            await session.promiseQuery(goal);

            for await (let answer of session.promiseAnswers()) res.push(session.format_answer(answer));
            console.log(res);
        })();

        return res;
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll
    // in the above example, the i flag ignores case. The g (global) flag is apparently necessary for replaceAll
    parsePrologAnswers(x) {
        return x.split(',').map( (s) => s.replaceAll(/\,|\=|\ |X|Y|\;/g, '') );
    }

    // TODO IMPORTANT https://stackoverflow.com/a/7400933
    // TODO exception for interaction
    async getImportantPairs(types: string[][], interaction: string = "unresisted"): Promise<string[][]> {
        // http://tau-prolog.org/manual/promises-interface
        const pl = require("tau-prolog");
        const fs = require('fs');
        require("tau-prolog/modules/promises.js")(pl);

        let additionalPredicates = ``;

        for(let type of types) {
            let index = type.length - 1; // makeshift way to construct the prolog query when there is only one type
            additionalPredicates += `team_member(${type[0]},${type[index]}).\n`;
            // += recommended over the concat function by:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat#performance
        }

        let res = [];

        const program = fs.readFileSync('./predicatesxy.pl', 'utf8');
        const goal = `${interaction}_pair(X, Y).`;
        const session = pl.create();
        await session.promiseConsult(program);
        await session.promiseConsult(additionalPredicates);
        await session.promiseQuery(goal);

        for await (let answer of session.promiseAnswers())
        {
            res.push(session.format_answer(answer));
        }

        return res.map(this.parsePrologAnswers);
    }

    // TODO account for IV
    calculateSpeed(stat, nature, ev): number {
        let factor = 1;
        if(this.speNatures.includes(nature)) factor = 1.1;
        else if(this.minusSpeNatures.includes(nature)) factor = 0.9;
        return Math.floor(((stat + 20) + Math.ceil(ev / 8)) * factor);
    }
}
