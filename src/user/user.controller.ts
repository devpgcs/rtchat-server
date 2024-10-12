import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { IsPublic } from 'src/auth/decorators/is-public.decorator';

import { EnhancedRequest } from 'src/common/interfaces/enhanced-request.interface';
import { ConflictResponse } from 'src/common/models/conflict-response.model';
import { NotFoundResponse } from 'src/common/models/not-found-response.model';
import { BadRequestResponse } from 'src/common/models/bad-request-response.model';
import { UnauthorizedResponse } from 'src/common/models/unauthorized-response.model';
import { InternalServerErrorResponse } from 'src/common/models/internal-server-error-response.model';

import { User } from './models/user.model';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@ApiNotFoundResponse({ type: NotFoundResponse })
@ApiBadRequestResponse({ type: BadRequestResponse })
@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponse })
@Controller('user')
export class UserController {
  constructor(private readonly users: UserService) {}

  @ApiOperation({ summary: 'Creates a new user' })
  @ApiCreatedResponse({ type: User })
  @ApiConflictResponse({ type: ConflictResponse })
  @IsPublic()
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.users.create(createUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieves the authenticated user' })
  @ApiOkResponse({ type: User })
  @Get('me')
  me(@Req() req: EnhancedRequest): User {
    return req.user.toJSON();
  }
}
