import { ApiProperty } from '@nestjs/swagger';

export class NotFoundResponse {
  @ApiProperty({
    description: 'The error message',
    default: '{Model} not found',
  })
  message: string;

  @ApiProperty({
    description: 'The error status message',
    default: 'Not Found',
  })
  error: string;

  @ApiProperty({
    description: 'The error status code',
    default: 404,
  })
  statusCode: number;
}
