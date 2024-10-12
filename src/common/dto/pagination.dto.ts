import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ description: 'The limit of objects to return', default: 10 })
  @IsInt()
  @Transform((params) => parseInt(params.value, 10))
  limit: number = 10;

  @ApiProperty({ description: 'The amount of objects to skip', default: 0 })
  @IsInt()
  @Transform((params) => parseInt(params.value, 10))
  skip: number = 0;
}
