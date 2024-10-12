import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { EnhancedRequest } from 'src/common/interfaces/enhanced-request.interface';

import { AuthService } from './auth.service';
import { IS_PUBLIC_KEY } from './decorators/is-public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, allow access without injecting the user
    // to the request object
    if (isPublic) {
      return true;
    }

    const request: EnhancedRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    try {
      const user = await this.authService.parseToken(token);
      request.user = user;

      return true;
    } catch (error) {
      Logger.debug(error, this.constructor.name);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromRequest(request: EnhancedRequest): string {
    const [bearer, token] = request.headers.authorization?.split(' ') || [];

    if (bearer !== 'Bearer' || !token) {
      throw new BadRequestException('Invalid token');
    }

    return token;
  }
}
