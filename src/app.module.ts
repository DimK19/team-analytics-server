import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonController } from './mon/mon.controller';
import { MonService } from './mon/mon.service';

@Module({
    imports: [TypeOrmModule.forRoot()],
    controllers: [AppController, MonController],
    providers: [AppService, MonService],
})
export class AppModule {}
