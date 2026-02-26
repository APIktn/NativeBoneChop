import { IsOptional, IsString } from 'class-validator'

export class UpdateProfileDto {

  @IsString()
  firstName?: string

  @IsString()
  lastName?: string

  @IsOptional()
  @IsString()
  userName?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  tel?: string
}
