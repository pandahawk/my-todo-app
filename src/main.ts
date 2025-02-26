import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv'; // Import dotenv
dotenv.config(); // Load environment variables - MUST BE FIRST
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ 
    transform: true}))

  const config = new DocumentBuilder()
    .setTitle('Simple Todo API')
    .setDescription(
      'A simple API for managing todo items. Version 1.0, OpenAPI 3.0',
    )
    .setVersion('1.0')
    .addTag('todos')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
