import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
  } from 'class-validator';
  import { UserRole } from 'src/utils/enums';
  
  export class LoginUserDto {
    @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
    @IsEmail({}, { message: 'صيغة البريد الإلكتروني غير صحيحة' })
    @MaxLength(250, { message: 'البريد الإلكتروني لا يجب أن يتجاوز 250 حرفًا' })
    email: string;
  
    @IsString({ message: 'كلمة المرور يجب أن تكون نصًا' })
    @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
    @MinLength(6, {
      message: 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل',
    })
    password: string;
  
    @IsOptional()
    @IsEnum(UserRole, {
      message: `الدور يجب أن يكون أحد القيم التالية: ${Object.values(UserRole).join(', ')}`,
    })
    role?: UserRole;
  
  }