import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({ example: 'New Feature Released', description: 'News title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'We are excited to announce...', description: 'News description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
