import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {CheckApiKeyMiddleware} from "./Guards/checkApiKey.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('IEWA Backend')
    .setDescription('The Iewa API description')
    .setVersion('1.0')
      .addBearerAuth()
      .addSecurity('apiKey', {
            type: 'apiKey',
            name: 'x-api-key ',
            in: 'header',
            description: 'Please enter'
          }
      )
      .addServer('http://localhost:3000/api/v1', 'Local Development')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document,{
    customSiteTitle: 'IEWA API Documentation',
      url: 'http://localhost:3000/api/v1/docs',

  });

  app.enableCors();
  // app.use(new CheckApiKeyMiddleware().use);

  app.setGlobalPrefix('api/v1');
  await app.listen(3000);

}
bootstrap();
