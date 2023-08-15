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
import { GameModule } from './game/game.module';
import { RoomsService } from './rooms/rooms.service';
import { MembersService } from './members/members.service';
import { MessagesService } from './messages/messages.service';
import { TwoFactorAuthenticationService } from './auth/2fa/twoFactorAuthentication.service';
import { TwoFactorAuthenticationModule } from './auth/2fa/twoFactorAuthentication.module';
import { FileUploadModule } from './Uploads/file-upload.module';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    PrismaService,
    RoomsService,
    MembersService,
    MessagesService,
    TwoFactorAuthenticationService,
  ],
  exports: [UserService, PrismaService, MembersService, RoomsService],
})
export class AppModule {}
