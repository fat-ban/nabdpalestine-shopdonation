import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Language, Theme, UserRole } from 'src/utils/enums';

export class CreateUserDto {
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
  @IsString({ message: 'رابط الصورة الرمزية يجب أن يكون نصًا' })
  avatar_url?: string;

  @IsOptional()
  @IsString({ message: 'اسم المستخدم يجب أن يكون نصًا' })
  @MaxLength(150, { message: 'اسم المستخدم لا يجب أن يتجاوز 150 حرفًا' })
  username?: string;

  @IsPhoneNumber('AL',{message: 'رقم الهاتف يجب أن يكون صالحًا'})
  @IsOptional()
  phone?: string;

  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @IsEnum(Theme)
  @IsOptional()
  theme?: Theme;


  @IsOptional()
  @IsEnum(UserRole, {
    message: `الدور يجب أن يكون أحد القيم التالية: ${Object.values(UserRole).join(', ')}`,
  })
  role?: UserRole;

  
}
