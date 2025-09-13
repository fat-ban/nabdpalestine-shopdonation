import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CURRENT_USER_KEY } from 'src/utils/constants';
import { UserRole } from 'src/utils/enums';
import { JWT_PAYLOAD } from 'src/utils/type';
import { UsersService } from '../users.service';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserRole[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // If no roles are required, allow access
    if (!roles || roles.length === 0) return true;

    const request: Request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    // Check if authorization header exists
    if (!authHeader) {
      throw new UnauthorizedException('غير مسموح بالدخول. توكن مفقود');
    }

    const [type, token] = authHeader.split(' ');
    
    // Check if it's a Bearer token
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('غير مسموح بالدخول. نوع التوكن غير صحيح');
    }

    try {
      // Verify JWT token
      const payload: JWT_PAYLOAD = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      // Get user from database
      const user = await this.usersService.getCurrentUser(payload.id);
      // If user does not exist, throw an exception
      if (!user) {
        throw new UnauthorizedException('غير مسموح بالدخول. المستخدم غير موجود');
      }

      // Check if user has required role
      if (!roles.includes(user.role)) {
        throw new ForbiddenException('غير مسموح بالدخول. صلاحيات غير كافية');
      }

      // Set current user in request
      request[CURRENT_USER_KEY] = payload;
      return true;

    } catch (error) {
      // If it's already an HTTP exception, re-throw it
      const err = error as unknown;
      if (err instanceof UnauthorizedException || err instanceof ForbiddenException) {
        throw err;
      }
      
      // For JWT verification errors or other errors
      throw new UnauthorizedException('غير مسموح بالدخول. توكن غير صالح');
    }
  }
}