import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): void {
        // temporary mocking tests
        console.log(this.appService.getIndividualWeakness(["fire", "steel"]));
        console.log(this.appService.getImportantPairs([["psychic"], ["fire", "steel"], ["grass", "poison"], ["ground", "flying"], ["normal"], ["electric", "flying"]]));
        console.log(this.appService.getImportantPairs([["grass"], ["water", "ground"], ["grass", "poison"], ["ground"], ["steel"], ["electric", "ice"]], "weak"));
    }

    // https://github.com/serverless-heaven/serverless-webpack/issues/446
    @Post('team')
    getStats(@Body() body) { // TODO specify return object type. body is team json
        return this.appService.getStats(body);
    }
}
