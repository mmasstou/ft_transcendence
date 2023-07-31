import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SocketAdapter from './Socket.Adapter';

const _PORT = process.env.PORT || 80;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.useWebSocketAdapter(new SocketAdapter(app));
  app.setGlobalPrefix('api');
  // app.use(cookieParser());
  await app.listen(_PORT, () => {
    console.log(`backend start on the port ${_PORT}`);
  });
}
bootstrap();
