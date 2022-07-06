import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMonDto } from './dto/create-mon.dto';
import { Mon } from './entities/mon.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class MonService {
    constructor(@InjectEntityManager() private manager: EntityManager) {}

    async create(createMonDto: CreateMonDto): Promise<Mon> {
        const result = await this.manager.findOne(Mon, {"name": createMonDto.name});
        if(result) throw new NotFoundException(`Mon ${createMonDto.name} already exists`);// so that no users with same username exist
        const mon = await this.manager.create(Mon, createMonDto); // createUserDto is a subtype of user
        return this.manager.save(mon); // returns a promise for the quiz as it was saved in the database
        // not returning user after saving because the promise includes the automatically generated id (by the orm)
    }

    async getAll() : Promise<Mon[]> {
        return this.manager.find(Mon); // does not need await, returns promise
    }

    async getOne(id: string) : Promise<Mon> {
        // the additional relations option joins tables and returns the correpsonding answers too
        const result = await this.manager.findOne(Mon, id);
        if(!result) throw new NotFoundException(`Mon ${id} not found`);
        return result;
    }

}
