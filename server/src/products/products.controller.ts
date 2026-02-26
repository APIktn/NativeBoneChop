import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtGuard } from '../auth/guards/jwt.guard'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { UpdateProductLineDto } from './dto/update-product-line.dto'

@Controller('products')
@UseGuards(JwtGuard)
export class ProductsController {

  constructor(private readonly productsService: ProductsService) {}

  // ==================================================
  // CREATE PRODUCT
  // ==================================================

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @Req() req: any,
    @Body() dto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {

    const result = await this.productsService.createProduct(
      dto,
      req.user.userCode,
      file,
    )

    return {
      message: 'product created',
      productCode: result.ProductCode,
    }
  }

  // ==================================================
  // UPDATE PRODUCT
  // ==================================================

  @Patch(':code')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('code') code: string,
    @Req() req: any,
    @Body() dto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {

    await this.productsService.updateProduct(
      code,
      dto,
      req.user.userCode,
      file,
    )

    return {
      message: 'product updated',
    }
  }

  // ==================================================
  // GET PRODUCT
  // ==================================================

  @Get(':code')
  async getProduct(@Param('code') code: string) {

    return this.productsService.getProduct(code)
  }

  // ==================================================
  // DELETE PRODUCT
  // ==================================================

  @Delete(':code')
  async deleteProduct(
    @Param('code') code: string,
    @Req() req: any,
  ) {

    await this.productsService.deleteProduct(
      code,
      req.user.userCode,
    )

    return {
      message: 'product deleted successfully',
    }
  }

  // ==================================================
  // UPDATE PRODUCT LINES
  // ==================================================

  @Patch('lines')
  async updateLines(
    @Body() dto: UpdateProductLineDto,
    @Req() req: any,
  ) {

    await this.productsService.updateProductLines(
      dto,
      req.user.userCode,
    )

    return {
      message: 'line updated successfully',
    }
  }

  // ==================================================
  // DELETE PRODUCT LINE
  // ==================================================

  @Delete('lines/:id')
  async deleteLine(
    @Param('id') id: number,
    @Req() req: any,
  ) {

    await this.productsService.deleteProductLine(
      Number(id),
      req.user.userCode,
    )

    return {
      message: 'line deleted and reordered',
    }
  }

}