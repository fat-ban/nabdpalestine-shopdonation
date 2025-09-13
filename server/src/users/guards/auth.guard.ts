import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CURRENT_USER_KEY } from 'src/utils/constants';
import { JWT_PAYLOAD } from 'src/utils/type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (token && type === 'Bearer') {
      try {
        const payload: JWT_PAYLOAD = await this.jwtService.verifyAsync(token, {
          secret: this.config.get<string>('JWT_SECRET'),
        });
        request[CURRENT_USER_KEY] = payload;
      } catch (error) {
        throw new UnauthorizedException('غير مسموح بالدخول.توكن غير صالح');
      }
    } else {
      throw new UnauthorizedException('غير مسموح بالدخول.توكن غير صالح');
    }

    return true;
  }
}
