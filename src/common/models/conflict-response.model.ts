import { ApiProperty } from '@nestjs/swagger';

export class ConflictResponse {
  @ApiProperty({
    description: 'The error message',
    default: '{Model} already exists',
  })
  message: string;

  @ApiProperty({
    description: 'The error status message',
    default: 'Conflict',
  })
  error: string;

  @ApiProperty({
    description: 'The error status code',
    default: 409,
  })
  statusCode: number;
}
