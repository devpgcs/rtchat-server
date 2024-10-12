import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

import { User } from '../models/user.model';

export class CreateUserDto
  implements Pick<User, 'username' | 'password' | 'phoneNumber'>
{
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
  @Length(8, 32)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+57 123 456 7890',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;
}
