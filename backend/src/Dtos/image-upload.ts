import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ImageUploadDto {
  @IsNotEmpty()
  @IsString()
  mimeType: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;
}
