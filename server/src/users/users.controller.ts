import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
  Get,
  UnauthorizedException,
  UseGuards,
  Put,
  Delete,
  Param,
  Request,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register.dto';
import { Roles } from './decorator/user-role.decorator';
import { AuthRolesGuard } from './guards/auth-role.guard';
import { UserRole } from 'src/utils/enums';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorator/current-user.decorator';
import { JWT_PAYLOAD } from 'src/utils/type';
import { UpdateUserDto } from './dto/update-user.dto';
import { CURRENT_USER_KEY } from 'src/utils/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('current-user')
  @UseGuards(AuthGuard)
  public  getCurrentUser(@Req() request: any) {
    const payload = request[CURRENT_USER_KEY];
     return this.usersService.getCurrentUser(payload.id);

  }

  @Get('seller/:seller_id')
  public  findSellerById(
    @Param ("seller_id") seller_id: string) {
     return this.usersService.findSellerById(seller_id);

  }

  @Get('customer/:customer_id')
  @Roles(UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER)
  @UseGuards(AuthRolesGuard)
  public  findCustomerById(
    @Param ("customer_id") customer_id: string) {
     return this.usersService.findCustomerById(customer_id);

  }

  @Get('users')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public  getAllUsers() {
    return  this.usersService.getAllUsers();  
  }

  @Put("current-user")
  @Roles(UserRole.ADMIN,UserRole.CUSTOMER,UserRole.SELLER)
  @UseGuards(AuthRolesGuard)
  public updateUser (@CurrentUser() payload:JWT_PAYLOAD, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(payload.id, body)
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  public deleteUser(
    @Param("id") id:string,
    @CurrentUser() payload: JWT_PAYLOAD 
    ) {
     return this.usersService.deleteUser(id, payload);
  }

  @Post('upload-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() payload: JWT_PAYLOAD,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    const result = await this.cloudinaryService.uploadFile(file, {
      folder: 'nabdPalestine/users',
      transformation: [
        { width: 300, height: 300, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    const updatedUser = await this.usersService.updateUserImage(
      payload.id,
      result.secure_url,
      result.public_id,
    );

    return {
      success: true,
      message: 'Profile image updated successfully.',
      data: updatedUser,
    };
  }
}
