import { Controller, Get, Post, Body } from '@nestjs/common';
import { MonService } from './mon.service';
import { CreateMonDto } from './dto/create-mon.dto';

@Controller('mon')
export class MonController {
    constructor(private readonly monService: MonService) {}

    @Post('create')
    create(@Body() createMonDto: CreateMonDto) {
        return this.monService.create(createMonDto);
    }
}
