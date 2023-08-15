import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileUploadController } from './file-upload.controller';
import cloudinaryConfig from './config/cloudinary.config';
import { CloudinaryService } from './cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';
import { UserService } from 'src/users/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [cloudinaryConfig] }),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [FileUploadController],
  providers: [CloudinaryService, UserService, PrismaService],
})
export class FileUploadModule {}
