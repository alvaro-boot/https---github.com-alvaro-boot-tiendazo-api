import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentStatus } from './entities/order.entity';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { Public } from '../../core/decorators/public.decorator';
import { AuthUser } from '../../core/decorators/auth-user.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders with optional filters' })
  @ApiQuery({ name: 'storeId', required: false })
  @ApiQuery({ name: 'clientId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiQuery({ name: 'paymentStatus', required: false, enum: PaymentStatus })
  async findAll(
    @Query('storeId') storeId?: number,
    @Query('clientId') clientId?: number,
    @Query('status') status?: OrderStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
  ) {
    return this.ordersService.findAll({
      storeId: storeId ? Number(storeId) : undefined,
      clientId: clientId ? Number(clientId) : undefined,
      status,
      paymentStatus,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Public()
  @Get('number/:orderNumber')
  @ApiOperation({ summary: 'Get order by order number' })
  async findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }
}

