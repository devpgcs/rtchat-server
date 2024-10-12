import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { InternalServerErrorResponse } from 'src/common/models/internal-server-error-response.model';
import { NotFoundResponse } from 'src/common/models/not-found-response.model';
import { UnauthorizedResponse } from 'src/common/models/unauthorized-response.model';

import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './models/login-response.model';

@IsPublic()
@ApiTags('Auth')
@ApiNotFoundResponse({ type: NotFoundResponse })
@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponse })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Authenticates a user by username and password' })
  @ApiOkResponse({ type: LoginResponse })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }
}
