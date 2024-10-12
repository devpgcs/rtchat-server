import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({
    description: 'The JWT token to authenticate the user in protected routes',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjQwZjQwZjQwZjQwZjQwZjQwZjQwZjQiLCJpYXQiOjE2MjYwNjQwNzcsImV4cCI6MTYyNjA2NzY3N30.1',
  })
  token: string;
}
