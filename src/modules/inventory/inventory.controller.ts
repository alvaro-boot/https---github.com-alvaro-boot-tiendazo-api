import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryMovementDto } from './dto/create-movement.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { AuthUser } from '../../core/decorators/auth-user.decorator';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('movement')
  @ApiOperation({ summary: 'Create inventory movement' })
  createMovement(@Body() createMovementDto: CreateInventoryMovementDto, @AuthUser() user: any) {
    return this.inventoryService.createMovement(createMovementDto, user.id);
  }

  @Post('adjust-stock')
  @ApiOperation({ summary: 'Adjust product stock' })
  adjustStock(@Body() adjustStockDto: AdjustStockDto, @AuthUser() user: any) {
    return this.inventoryService.adjustStock(adjustStockDto, user.id);
  }

  @Get('movements')
  @ApiOperation({ summary: 'Get all inventory movements' })
  @ApiQuery({ name: 'productId', required: false, description: 'Filter by product' })
  findAll(@Query('productId') productId?: number) {
    return this.inventoryService.findAll(productId);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store' })
  getLowStockProducts(@Query('storeId') storeId?: number) {
    return this.inventoryService.getLowStockProducts(storeId);
  }

  @Get('report')
  @ApiOperation({ summary: 'Get inventory report' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store' })
  getInventoryReport(@Query('storeId') storeId?: number) {
    return this.inventoryService.getInventoryReport(storeId);
  }

  @Get('movements/:id')
  @ApiOperation({ summary: 'Get inventory movement by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  findOne(@Param('id') id: number) {
    return this.inventoryService.findOne(id);
  }

  @Get('stock-history/:productId')
  @ApiOperation({ summary: 'Get stock history for a product' })
  @ApiParam({ name: 'productId', type: 'number' })
  getStockHistory(@Param('productId') productId: number) {
    return this.inventoryService.getStockHistory(productId);
  }
}
