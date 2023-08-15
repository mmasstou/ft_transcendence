import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import RequestWithUser from '../auth/requestWithUser.interface';
import { UserService } from '../users/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-oauth.guard';
import { ImageUploadDto } from 'src/Dtos/image-upload';

@Controller('uploads')
export class FileUploadController {
  constructor(
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly userService: UserService,
  ) {}

  @Post('/file')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: RequestWithUser,
  ) {
    const uploadDto = new ImageUploadDto();
    uploadDto.mimeType = file.mimetype;
    uploadDto.size = file.size;

    if (!this.isValidMimeType(uploadDto.mimeType)) {
      throw new BadRequestException('Invalid file type');
    }

    // Proceed with file upload and Cloudinary
    const result = await this.cloudinaryService.uploadFile(file);
    await this.userService.setBanner(result.url, request.user.login);
    return result;
  }

  private isValidMimeType(mimeType: string): boolean {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedMimeTypes.includes(mimeType);
  }
}
