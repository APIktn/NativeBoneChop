import {
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { ProductLineDto } from './product-line.dto'

export class CreateProductDto {

  @IsString()
  productCode: string

  @IsString()
  productName: string

  @IsString()
  description: string

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try { return JSON.parse(value) } catch { return value }
    }
    return value
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductLineDto)
  items: ProductLineDto[]
}