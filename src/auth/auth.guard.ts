import { Socket } from 'socket.io';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';

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

    const request: EnhancedRequest | Socket = context.switchToHttp().getRequest(),
      token = this.extractTokenFromRequest(request),
      isSocket = 'handshake' in request;

    try {
      const user = await this.authService.parseToken(token);

      if (isSocket) {
        const socketData = context.switchToWs().getData();
        const isSocketDataAnObject = typeof socketData === 'object' && !Array.isArray(socketData);

        if (isSocketDataAnObject) {
          socketData.user = user;
        }
      } else {
        request.user = user;
      }

      return true;
    } catch (error) {
      Logger.debug(error, this.constructor.name);

      const errorMessage = 'Invalid token';

      if (isSocket) {
        throw new WsException(errorMessage);
      }

      throw new UnauthorizedException(errorMessage);
    }
  }

  private extractTokenFromRequest(request: EnhancedRequest | Socket): string {
    const isSocket = 'handshake' in request;
    const headers = isSocket ? request.handshake.headers : request.headers;

    const [bearer, token] = headers.authorization?.split(' ') || [];

    if (bearer !== 'Bearer' || !token) {
      const errorMessage = 'Invalid token. Did you miss the Bearer keyword?';

      if (isSocket) {
        throw new WsException(errorMessage);
      }

      throw new BadRequestException(errorMessage);
    }

    return token;
  }
}
