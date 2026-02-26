import { Controller, Get, Query } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { InventoryQueryDto } from './dto/inventory-query.dto'

@Controller('inventory')
export class InventoryController {

  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getInventory(@Query() query: InventoryQueryDto) {
    return this.inventoryService.getInventory(query)
  }
}