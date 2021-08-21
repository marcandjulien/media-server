import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { CustomLogger } from './logger/custom-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Setup helmet, should always be the first middleware
  app.use(helmet());

  // Setup custom logger
  app.useLogger(app.get(CustomLogger));

  // Setup validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Setup OAS/SwaggerUi
  const config = new DocumentBuilder()
    .setTitle('Image server')
    .setDescription('A server to organize and serve image')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));

  // Setup morgan for http request logging
  const Logger = app.get(CustomLogger);
  app.use(
    morgan(':method :url :status :res[content-length] +:response-time[0]ms', {
      stream: {
        write: (message) => Logger.log(message, 'Morgan'),
      },
    }),
  );

  // Start server
  app.enableCors();
  await app.listen(3000, 'localhost');
  Logger.log(`Nest application listening on ${await app.getUrl()}`, 'Main');
}
bootstrap();
