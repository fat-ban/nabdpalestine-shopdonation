import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { UserRole } from 'src/utils/enums';
import { JWT_PAYLOAD } from 'src/utils/type';
import { Repository } from 'typeorm';
import { LoginUserDto } from '../users/dto/login.dto';
import { RegisterUserDto } from '../users/dto/register.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async register(
    registerUserDto: RegisterUserDto,
  ): Promise<{ accessToken: string }> {
    const {
      email,
      password,
      username,
      phone,
      language,
      theme,
      avatar_url,
      role,
    } = registerUserDto;
    const normalizedEmail = email?.trim();
    const normalizedUsername = username?.trim();
    const existingUser = await this.usersRepository.findOne({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      throw new BadRequestException('يرجى استخدام بريد إلكتروني آخر');
    }
    if (normalizedUsername) {
      const existingUserName = await this.usersRepository.findOne({
        where: { username: normalizedUsername },
      });
      if (existingUserName) {
        throw new BadRequestException('this name is already taken');
      }
      const duplicateInsensitive = await this.usersRepository
        .createQueryBuilder('user')
        .where('LOWER(user.username) = LOWER(:uname)', {
          uname: normalizedUsername,
        })
        .getOne();
      if (duplicateInsensitive) {
        throw new BadRequestException('this name is already taken');
      }
    }

    const hashedPassword = await this.hashPassword(password);
    if (!hashedPassword) {
      throw new BadRequestException('هناك خطا في تسجيل الدخول');
    }

    const newUser = this.usersRepository.create({
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      language,
      theme,
      avatar_url: avatar_url ?? undefined,
      role: role as UserRole,
      username: normalizedUsername ?? undefined,
      total_donated: 0,
      is_active: true,
    } as Partial<User>);

    const savedUser = await this.usersRepository.save(newUser);
    const payload: JWT_PAYLOAD = {
      id: savedUser.user_id,
      email: savedUser.email,
      role: savedUser.role,
    };
    const accessToken = await this.generateJWT(payload);

    return { accessToken };
  }

  public async login(loginDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (!existingUser) {
      throw new BadRequestException(
        'البريد الإلكتروني أو كلمة المرور غير متطابقة',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException(
        'البريد الإلكتروني أو كلمة المرور غير متطابقة',
      );
    }

    const payload: JWT_PAYLOAD = {
      id: existingUser.user_id,
      email: existingUser.email,
      role: existingUser.role,
    };
    const accessToken = await this.generateJWT(payload);

    return { accessToken };
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private generateJWT(payload: JWT_PAYLOAD): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
