import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserDocument } from 'src/user/models/user.model';
import { UserService } from 'src/user/user.service';

import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './models/login-response.model';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Logs in a user by username and password.
   *
   * @param {LoginDto} loginDto  The login data transfer object.
   * @returns {Promise<LoginResponse>} The login response.
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.findOne(
      { username: loginDto.username },
      { id: 1, username: 1, password: 1 },
    );

    // If the user does not exist, or the password is incorrect, throw an error
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await this.userService.comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      // Finally, if everything goes well, we issue a token and return it
      token: await this.issueToken(user),
    };
  }

  /**
   * Parses a token and returns the user found in the database to
   * be injected into the request object from the AuthGuard.
   *
   * @param {string} token The token to parse.
   * @returns {Promise<UserDocument>} The user found in the database.
   */
  async parseToken(token: string): Promise<UserDocument> {
    const tokenPayload = await this.jwtService.verifyAsync<TokenPayload>(token);

    return this.userService.findOne({ _id: tokenPayload.sub });
  }

  /**
   * Issues a token for a user to be used in protected routes.
   *
   * @param {UserDocument} user The user to issue the token for.
   * @returns {Promise<string>} The issued token.
   */
  async issueToken(user: UserDocument) {
    const tokenPayload: TokenPayload = {
      aud: user.username,
      iss: 'http://localhost:3000',
      sub: user.id,
    };

    return this.jwtService.signAsync(tokenPayload);
  }
}
