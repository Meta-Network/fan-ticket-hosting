import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({
    origin: [
      'http://localhost:3000'
    ]
  })
  app.use(cookieParser());
  const runningOnPort = configService.get<number>('app.port') || 3000;
  console.info(`Running on Port${runningOnPort}`);

  const config = new DocumentBuilder()
    .setTitle('Meta Network FanTicket Hosting')
    .setDescription('The API for FanTicket Hosting')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(runningOnPort);
}
bootstrap();
