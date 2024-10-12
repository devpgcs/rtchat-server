import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CommonFields {
  @ApiProperty({
    description: 'The id of the instance',
    example: '5f4f1f2b7f2b9b001f0b8d3e',
  })
  id: string;

  @ApiProperty({
    description: 'The date the instance was created',
    example: '2020-09-01T00:00:00.000Z',
  })
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the instance was last updated',
    example: '2020-09-01T00:00:00.000Z',
  })
  @Prop({ default: Date.now })
  updatedAt: Date;
}
