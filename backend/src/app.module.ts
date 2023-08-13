import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './users/user.service';
import { PrismaService } from './prisma.service';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';
import { MembersModule } from './members/members.module';
import { ChatGateway } from './chat.gateway';
import { GameModule } from './game/game.module';
import { RoomsService } from './rooms/rooms.service';
import { MembersService } from './members/members.service';
import { MessagesService } from './messages/messages.service';
import { UserGateway } from './user.gateway';
import { TwoFactorAuthenticationService } from './auth/2fa/twoFactorAuthentication.service';
import { TwoFactorAuthenticationModule } from './auth/2fa/twoFactorAuthentication.module';
@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    RoomsModule,
    MessagesModule,
    MembersModule,
    GameModule,
    TwoFactorAuthenticationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    PrismaService,
    ChatGateway,
    UserGateway,
    RoomsService,
    MembersService,
    MessagesService,
    TwoFactorAuthenticationService,
  ],
  exports: [UserService, PrismaService],
})
export class AppModule {}
