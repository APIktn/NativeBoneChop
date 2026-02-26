import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { InventoryQueryDto } from './dto/inventory-query.dto'

@Injectable()
export class InventoryService {

  constructor(private prisma: PrismaService) {}

  async getInventory(query: InventoryQueryDto) {

    const {
      search = '',
      priceMin = 0,
      priceMax = 100000,
      page = 1,
      limit = 12,
    } = query

    const skip = (page - 1) * limit

    // ===== filter =====
    const whereCondition = {
      AND: [
        {
          OR: [
            { ProductName: { contains: search } },
            { ProductCode: { contains: search } },
          ],
        },
        {
          lines: {
            some: {
              Price: {
                gte: priceMin,
                lte: priceMax,
              },
            },
          },
        },
      ],
    }

    // ===== get data =====
    const [products, total] = await this.prisma.$transaction([
      this.prisma.productHeader.findMany({
        where: whereCondition,
        include: {
          images: {
            where: { ImageType: 'MAIN' },
            take: 1,
          },
          lines: {
            select: {
              Price: true,
              Amount: true,
            },
          },
        },
        orderBy: { CreateDateTime: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.productHeader.count({
        where: whereCondition,
      }),
    ])

    const items = products.map(p => ({
      productCode: p.ProductCode,
      productName: p.ProductName,
      image: p.images[0]?.ProductImage || null,
      lines: p.lines.map(l => ({
        price: l.Price,
        amount: l.Amount,
      })),
    }))

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }
}