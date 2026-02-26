import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ProductLineDto } from './product-line.dto'

export class UpdateProductLineDto {

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductLineDto)
  lines: ProductLineDto[]
}