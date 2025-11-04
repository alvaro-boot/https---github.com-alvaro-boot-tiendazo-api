import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AccountingService } from './accounting.service';
import { EntryType, EntryCategory } from './entities/accounting-entry.entity';
import { ReportPeriod } from './entities/accounting-report.entity';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { AuthUser } from '../../core/decorators/auth-user.decorator';

@ApiTags('Accounting')
@Controller('accounting')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('entries')
  @ApiOperation({ summary: 'Get accounting entries with filters' })
  @ApiQuery({ name: 'storeId', required: true })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'type', required: false, enum: EntryType })
  @ApiQuery({ name: 'category', required: false, enum: EntryCategory })
  async getEntries(
    @Query('storeId', ParseIntPipe) storeId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: EntryType,
    @Query('category') category?: EntryCategory,
  ) {
    return this.accountingService.getEntries({
      storeId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      type,
      category,
    });
  }

  @Post('expenses')
  @ApiOperation({ summary: 'Register manual expense' })
  async registerExpense(
    @Body() data: {
      storeId: number;
      category: EntryCategory;
      amount: number;
      description: string;
      date: string;
      notes?: string;
    },
    @AuthUser() user: any,
  ) {
    return this.accountingService.registerExpense(
      data.storeId,
      data.category,
      data.amount,
      data.description,
      new Date(data.date),
      user.id,
      data.notes,
    );
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get financial summary' })
  @ApiQuery({ name: 'storeId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async getSummary(
    @Query('storeId', ParseIntPipe) storeId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.accountingService.getFinancialSummary(
      storeId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Post('reports')
  @ApiOperation({ summary: 'Generate accounting report' })
  async generateReport(
    @Body() data: {
      storeId: number;
      period: ReportPeriod;
      startDate: string;
      endDate: string;
    },
  ) {
    return this.accountingService.generateReport(
      data.storeId,
      data.period,
      new Date(data.startDate),
      new Date(data.endDate),
    );
  }
}

