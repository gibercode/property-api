import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    maxAge: 86400,
  });

  app.setGlobalPrefix('api');
  await app.listen(5001);
}
bootstrap();
