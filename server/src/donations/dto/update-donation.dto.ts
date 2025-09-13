import { PartialType } from '@nestjs/mapped-types';
import { CreateDonationDto } from './create-donation.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { DonationStatus, DonationType } from 'src/utils/enums';

export class UpdateDonationDto extends PartialType(CreateDonationDto) {
  @IsEnum(DonationType)
  @IsOptional()
  type?: DonationType;

  @IsEnum(DonationStatus)
  @IsOptional()
  status?: DonationStatus;
}