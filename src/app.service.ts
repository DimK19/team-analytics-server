import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    // http://tau-prolog.org/manual/compatibility-with-nodejs
    getStats(team): void { // TODO void for now, will return object
        // extrapolate ev statistics
        let offNatures = ["lonely", "adamant", "naughty", "brave", "modest", "mild", "rash", "quiet"];
        let defNatures = ["bold", "impish", "relaxed", "lax", "calm", "gentle", "careful", "sassy"];
        let speNatures = ["timid", "hasty", "jolly", "naive"];

        let evDict = {
            "hp": 0,
            "atk": 0,
            "def": 0,
            "spa": 0,
            "spd": 0,
            "spe": 0
        }

        let natureDict = {
            offense: 0,
            defense: 0,
            speed: 0
        }

        for(let i of team['members']) {
            for(let j of i["evs"]) {
                evDict[j.ev.stat] += j.ev.value;
            }
            if(offNatures.includes(i["nature"])) natureDict.offense += 1;
            else if(defNatures.includes(i["nature"])) natureDict.defense += 1;
            else if(speNatures.includes(i["nature"])) natureDict.speed += 1;
            // there must be a more clever way of doing this
        }

        console.log(evDict);
        console.log(natureDict);
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
    getUnresistedPairs(types: string[][]): string[][] {
        // http://tau-prolog.org/manual/promises-interface
        const pl = require("tau-prolog");
        const fs = require('fs');
        require("tau-prolog/modules/promises.js")(pl);

        let additionalPredicates = ``;

        for(let type of types) {
            let index = type.length - 1; // makeshift way to construct the prolog query when there is only one type
            additionalPredicates += `team_member(${type[0]},${type[index]}).\n`;
        }

        let res = [];

        (async() => {

            const program = fs.readFileSync('./predicatesxy.pl', 'utf8');
            const goal = `unresisted_pair(X, Y).`;
            const session = pl.create();
            await session.promiseConsult(program);
            await session.promiseConsult(additionalPredicates);
            await session.promiseQuery(goal);

            for await (let answer of session.promiseAnswers())
            {
                console.log(session.format_answer(answer));
                res.push(session.format_answer(answer));
            }
            console.log(res.map(this.parsePrologAnswers));
        })();

        return res;
    }
}
