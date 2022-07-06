import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MonService } from './mon.service';
import { CreateMonDto } from './dto/create-mon.dto';

@Controller('mon')
export class MonController {
    constructor(private readonly monService: MonService) {}

    @Get()
    getAll() {
        return this.monService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        // +id if it were number, don't remember why
        return this.monService.getOne(id);
    }

    @Post('create')
    create(@Body() createMonDto: CreateMonDto) {
        return this.monService.create(createMonDto);
    }
}
