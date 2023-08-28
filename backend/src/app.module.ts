import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { FileUploadModule } from './Uploads/file-upload.module';
import { NotificationsModule } from './notifications/notifications.module';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RoomsModule,
    MessagesModule,
    MembersModule,
    GameModule,
    TwoFactorAuthenticationModule,
    FileUploadModule,
    NotificationsModule,
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*'); // Apply cookie-parser middleware to all routes
  }
}
