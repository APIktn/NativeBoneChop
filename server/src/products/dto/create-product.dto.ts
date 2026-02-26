import {
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ProductLineDto } from './product-line.dto'

export class CreateProductDto {

  @IsString()
  productCode: string

  @IsString()
  productName: string

  @IsString()
  description: string

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductLineDto)
  items: ProductLineDto[]
}