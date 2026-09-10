import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../../../common/enums/gender.enums';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: '1995-06-15', description: 'Date of birth' })
  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @ApiPropertyOptional({ example: 'Jordan', description: 'Country of residence' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE, description: 'Gender' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: '+962790000000', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
