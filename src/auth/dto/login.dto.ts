import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { User } from 'src/user/models/user.model';

export class LoginDto implements Pick<User, 'username' | 'password'> {
  @ApiProperty({
    description: 'The username of the user',
    example: 'amazingchat',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Test1234!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
