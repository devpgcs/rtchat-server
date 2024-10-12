import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenResponse {
  @ApiProperty({
    description: 'The error message',
    default: 'You cannot access this resource because {reason}',
  })
  message: string;

  @ApiProperty({
    description: 'The error status message',
    default: 'Forbidden',
  })
  error: string;

  @ApiProperty({ description: 'The error status code', default: 403 })
  statusCode: number;
}
