import {
  BadRequestException,
  ForbiddenException,
  Get,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { accessTokenType, JWT_PAYLOAD } from '../utils/type';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../utils/enums';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async getCurrentUser(id: string): Promise<User>   {

    const user = await this.usersRepository.findOne({
      where: {
        user_id: id,
      },
    });
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود.');
    }
    return user;
  }

  public async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  public async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    const { password, ...otherFields } = updateUserDto;
    Object.assign(user, otherFields);

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    return this.usersRepository.save(user);
  }

  public async deleteUser(id: string, payload: JWT_PAYLOAD) {
    const user = await this.getCurrentUser(id);
    if (user?.user_id === payload?.id || payload?.role === UserRole.ADMIN) {
      await this.usersRepository.remove(user);
      return { message: 'تم حذف هذا المستخدم.' };
    }
    throw new ForbiddenException('تم رفض الوصول، ليس لديك الصلاحية.');
  }

  async findSellerById(userId: string): Promise<User | null> {
  const user = await this.usersRepository.findOne({
    where: { 
      user_id: userId,
      role: UserRole.SELLER,  // Ensure user has seller role
    },
  });
  if (!user) {
    return null;
  }
  return user;
}

async findCustomerById(userId: string): Promise<User | null> {
  const user = await this.usersRepository.findOne({
    where: { 
      user_id: userId,
      role: UserRole.CUSTOMER,  // Ensure user has seller role
    },
  });
  if (!user) {
    return null;
  }
  return user;
}

  async updateUserImage(userId: string, imageUrl: string, publicId: string): Promise<User> {
    const user = await this.getCurrentUser(userId);

    if (user.image_public_id) {
      try {
        await this.cloudinaryService.deleteFile(user.image_public_id);
      } catch (error) {
        console.error('Failed to delete old image from Cloudinary:', error);
      }
    }

    user.image__url = imageUrl;
    user.image_public_id = publicId;

    return this.usersRepository.save(user);
  }
}
