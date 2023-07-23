import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/users/user.module';
import { UserService } from 'src/users/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.TOOKEN_EXP },
    }),
  ],
  providers: [AuthService, UserService, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
