import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UploadService } from '../upload/upload.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { UpdateProductLineDto } from './dto/update-product-line.dto'

@Injectable()
export class ProductsService {

  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  // ==================================================
  // CREATE PRODUCT
  // ==================================================

  async createProduct(
    dto: CreateProductDto,
    userCode: string,
    file?: Express.Multer.File,
  ) {

    let imageUrl: string | undefined
    let imagePublicId: string | undefined

    if (file) {
      const uploaded = await this.uploadService.uploadImage(
        file,
        'bone_chop/product'
      )
      imageUrl = uploaded.url
      imagePublicId = uploaded.publicId
    }

    try {

      const result = await this.prisma.$transaction(async (tx) => {

        const header = await tx.productHeader.create({
          data: {
            ProductCode: dto.productCode,
            ProductName: dto.productName,
            ProductDes: dto.description,
            CreateBy: userCode,
            CreateDateTime: new Date(),
            UpdateBy: userCode,
            UpdateDateTime: new Date(),
          }
        })

        if (imageUrl) {
          await tx.productImage.create({
            data: {
              IdRef: header.Id,
              ImageType: 'MAIN',
              ProductImage: imageUrl,
              ProductImageId: imagePublicId,
              CreateBy: userCode,
              CreateDateTime: new Date(),
              UpdateBy: userCode,
              UpdateDateTime: new Date(),
            }
          })
        }

        for (const line of dto.items) {
          await tx.productLine.create({
            data: {
              IdRef: header.Id,
              LineNo: line.lineNo,
              Size: line.size,
              Price: line.price,
              Amount: line.amount,
              Note: line.note,
              CreateBy: userCode,
              CreateDateTime: new Date(),
              UpdateBy: userCode,
              UpdateDateTime: new Date(),
            }
          })
        }

        return header
      })

      return result

    } catch (err: any) {

      if (imagePublicId) {
        await this.uploadService.deleteImage(imagePublicId)
      }

      if (err.code === 'P2002') {
        throw new ConflictException('product code already exists')
      }

      throw err
    }
  }

  // ==================================================
  // UPDATE PRODUCT
  // ==================================================

  async updateProduct(
    code: string,
    dto: UpdateProductDto,
    userCode: string,
    file?: Express.Multer.File,
  ) {

    const header = await this.prisma.productHeader.findUnique({
      where: { ProductCode: code },
      include: { images: true },
    })

    if (!header) {
      throw new NotFoundException('product not found')
    }

    let imageUrl: string | undefined
    let imagePublicId: string | undefined
    let oldPublicId: string | undefined

    if (file) {

      const uploaded = await this.uploadService.uploadImage(
        file,
        'bone_chop/product'
      )

      imageUrl = uploaded.url
      imagePublicId = uploaded.publicId

      const oldMain = header.images.find(i => i.ImageType === 'MAIN')
      oldPublicId = oldMain?.ProductImageId || undefined
    }

    try {

      await this.prisma.$transaction(async (tx) => {

        await tx.productHeader.update({
          where: { ProductCode: code },
          data: {
            ProductName: dto.productName ?? undefined,
            ProductDes: dto.description ?? undefined,
            UpdateBy: userCode,
            UpdateDateTime: new Date(),
          }
        })

        if (imageUrl) {

          const oldMain = header.images.find(i => i.ImageType === 'MAIN')

          if (oldMain) {
            await tx.productImage.update({
              where: { Id: oldMain.Id },
              data: {
                ProductImage: imageUrl,
                ProductImageId: imagePublicId,
                UpdateBy: userCode,
                UpdateDateTime: new Date(),
              }
            })
          } else {
            await tx.productImage.create({
              data: {
                IdRef: header.Id,
                ImageType: 'MAIN',
                ProductImage: imageUrl,
                ProductImageId: imagePublicId,
                CreateBy: userCode,
                CreateDateTime: new Date(),
                UpdateBy: userCode,
                UpdateDateTime: new Date(),
              }
            })
          }
        }

        if (dto.items) {

          for (const line of dto.items) {
            await tx.productLine.update({
              where: { Id: line.id },
              data: {
                LineNo: line.lineNo,
                Size: line.size,
                Price: line.price,
                Amount: line.amount,
                Note: line.note,
                UpdateBy: userCode,
                UpdateDateTime: new Date(),
              }
            })
          }
        }

      })

      // delete old image AFTER commit
      if (oldPublicId) {
        await this.uploadService.deleteImage(oldPublicId)
      }

    } catch (err) {

      if (imagePublicId) {
        await this.uploadService.deleteImage(imagePublicId)
      }

      throw err
    }
  }

  // ==================================================
  // GET PRODUCT
  // ==================================================

  async getProduct(code: string) {

    const header = await this.prisma.productHeader.findUnique({
      where: { ProductCode: code },
      include: {
        images: true,
        lines: {
          orderBy: { LineNo: 'asc' }
        }
      }
    })

    if (!header) {
      throw new NotFoundException('product not found')
    }

    const mainImage = header.images.find(i => i.ImageType === 'MAIN')

    return {
      productCode: header.ProductCode,
      productName: header.ProductName,
      description: header.ProductDes,
      mainImage: mainImage?.ProductImage || null,
      items: header.lines.map(l => ({
        lineKey: l.Id,
        lineNo: l.LineNo,
        size: l.Size,
        price: l.Price,
        amount: l.Amount,
        note: l.Note,
      }))
    }
  }

  // ==================================================
  // DELETE PRODUCT
  // ==================================================

  async deleteProduct(code: string, userCode: string) {

    const header = await this.prisma.productHeader.findUnique({
      where: { ProductCode: code },
      include: { images: true },
    })

    if (!header) {
      throw new NotFoundException('product not found')
    }

    await this.prisma.$transaction(async (tx) => {

      await tx.productHeader.delete({
        where: { Id: header.Id }
      })

    })

    // delete cloudinary AFTER commit
    for (const img of header.images) {
      if (img.ProductImageId) {
        await this.uploadService.deleteImage(img.ProductImageId)
      }
    }
  }

  // ==================================================
  // UPDATE PRODUCT LINES
  // ==================================================

  async updateProductLines(
    dto: UpdateProductLineDto,
    userCode: string,
  ) {

    for (const l of dto.lines) {
      await this.prisma.productLine.update({
        where: { Id: l.id },
        data: {
          LineNo: l.lineNo,
          Size: l.size,
          Price: l.price,
          Amount: l.amount,
          Note: l.note,
          UpdateBy: userCode,
          UpdateDateTime: new Date(),
        }
      })
    }
  }

  // ==================================================
  // DELETE PRODUCT LINE + REORDER
  // ==================================================

  async deleteProductLine(id: number, userCode: string) {

    const line = await this.prisma.productLine.findUnique({
      where: { Id: id },
    })

    if (!line) {
      throw new NotFoundException('line not found')
    }

    await this.prisma.$transaction(async (tx) => {

      await tx.productLine.delete({
        where: { Id: id }
      })

      const remain = await tx.productLine.findMany({
        where: { IdRef: line.IdRef },
        orderBy: { LineNo: 'asc' }
      })

      let no = 1

      for (const r of remain) {
        await tx.productLine.update({
          where: { Id: r.Id },
          data: {
            LineNo: no++,
            UpdateBy: userCode,
            UpdateDateTime: new Date(),
          }
        })
      }
    })
  }
}