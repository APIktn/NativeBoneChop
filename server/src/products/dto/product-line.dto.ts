import {
  IsInt,
  IsString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator'

export class ProductLineDto {

  @IsOptional()
  @IsInt()
  id?: number

  @IsInt()
  @Min(1)
  lineNo: number

  @IsString()
  size: string

  @IsNumber()
  @Min(0)
  price: number

  @IsInt()
  @Min(0)
  amount: number

  @IsOptional()
  @IsString()
  note?: string
}