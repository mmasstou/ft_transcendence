import { Module } from '@nestjs/common';
import { MyGateway, BallGateway } from './gateway';

@Module({
  providers: [MyGateway, BallGateway]
})
export class GatewayModule {}
