import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponse {
  @ApiProperty({
    description: 'The error message',
    default: 'Invalid credentials',
  })
  message: string;

  @ApiProperty({
    description: 'The error status message',
    default: 'Unauthorized',
  })
  error: string;

  @ApiProperty({
    description: 'The error status code',
    default: 401,
  })
  statusCode: number;
}
