import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { DebtsService } from './debts.service';
import { CreateDebtPaymentDto } from './dto/create-payment.dto';
import { DebtReportDto } from './dto/debt-report.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { AuthUser } from '../../core/decorators/auth-user.decorator';

@ApiTags('Debts')
@Controller('debts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post('payment')
  @ApiOperation({ summary: 'Record debt payment' })
  createPayment(@Body() createPaymentDto: CreateDebtPaymentDto, @AuthUser() user: any) {
    return this.debtsService.createPayment(createPaymentDto, user.id);
  }

  @Get('payments')
  @ApiOperation({ summary: 'Get all debt payments with optional filters' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by client' })
  findAll(@Query() reportDto: DebtReportDto) {
    return this.debtsService.findAll(reportDto);
  }

  @Get('report')
  @ApiOperation({ summary: 'Get debt payments report' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by client' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store' })
  getDebtReport(@Query() reportDto: DebtReportDto) {
    return this.debtsService.getDebtReport(reportDto);
  }

  @Get('clients-with-debt')
  @ApiOperation({ summary: 'Get clients with outstanding debt' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store' })
  getClientsWithDebt(@Query('storeId') storeId?: number) {
    return this.debtsService.getClientsWithDebt(storeId ? Number(storeId) : undefined);
  }

  @Get('total-debt')
  @ApiOperation({ summary: 'Get total outstanding debt' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store' })
  getTotalDebt(@Query('storeId') storeId?: number) {
    return this.debtsService.getTotalDebt(storeId ? Number(storeId) : undefined);
  }

  @Get('payments/:id')
  @ApiOperation({ summary: 'Get debt payment by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  findOne(@Param('id') id: number) {
    return this.debtsService.findOne(id);
  }

  @Get('client-history/:clientId')
  @ApiOperation({ summary: 'Get debt payment history for a client' })
  @ApiParam({ name: 'clientId', type: 'number' })
  getClientDebtHistory(@Param('clientId') clientId: number) {
    return this.debtsService.getClientDebtHistory(clientId);
  }
}
