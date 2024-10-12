import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorResponse {
  @ApiProperty({
    description: 'The error message',
    default: 'Internal Server Error',
  })
  message: string;

  @ApiProperty({
    description: 'The error status message',
    default: 'Internal Server Error',
  })
  error: string;

  @ApiProperty({
    description: 'The error status code',
    default: 500,
  })
  statusCode: number;
}
