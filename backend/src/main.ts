import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SocketAdapter from './Socket.Adapter';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';

const _PORT = process.env.PORT || 80;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.useWebSocketAdapter(new SocketAdapter(app));
  app.setGlobalPrefix('api');
  // app.use(cookieParser());
  app.use(bodyParser.json()); // Add this line
  app.use(bodyParser.urlencoded({ extended: true }));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(_PORT, () => {
    console.log(`backend start on the port ${_PORT}`);
  });
}
bootstrap();
