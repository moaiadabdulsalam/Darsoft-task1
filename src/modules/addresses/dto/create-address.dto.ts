import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: 'Home', description: 'Address label name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Amman', description: 'City name' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Queen Rania Street', description: 'Street name' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiPropertyOptional({ example: 'Building 5, Floor 3', description: 'Additional location details' })
  @IsOptional()
  @IsString()
  locationDetails?: string;
}
