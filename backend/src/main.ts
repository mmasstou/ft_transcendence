import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


const _PORT = process.env.PORT || 4000
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(_PORT, () => {
    console.log(`backend start on the port ${_PORT}`)
  });
}
bootstrap();
