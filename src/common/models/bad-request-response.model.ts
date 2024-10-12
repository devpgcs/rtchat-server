import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponse {
  @ApiProperty({
    description: 'The error message(s)',
    example: ['{field} must be a string', '{field} must be is required'],
  })
  message: string[];

  @ApiProperty({
    description: 'The error status message',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'The error status code',
    example: 400,
  })
  statusCode: number;
}
