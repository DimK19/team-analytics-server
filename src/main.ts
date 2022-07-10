import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors(); // TODO only allow specific addresses in production, if possible
    await app.listen(3000);
}
bootstrap();
