import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { ReportRequestDto } from './dto/report-request.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate report' })
  async generateReport(@Body() reportDto: ReportRequestDto, @Res() res: Response) {
    const result = await this.reportsService.generateReport(reportDto);

    if (reportDto.format === 'excel') {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${reportDto.type.toLowerCase()}-report.xlsx"`);
      res.send(result);
    } else {
      res.json(result);
    }
  }

  @Get('sales')
  @ApiOperation({ summary: 'Generate sales report' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by client' })
  @ApiQuery({ name: 'format', required: false, description: 'Report format (json/excel)' })
  async getSalesReport(@Query() query: any, @Res() res: Response) {
    const reportDto: ReportRequestDto = {
      type: 'SALES' as any,
      startDate: query.startDate,
      endDate: query.endDate,
      storeId: query.storeId ? parseInt(query.storeId) : undefined,
      clientId: query.clientId ? parseInt(query.clientId) : undefined,
      format: query.format || 'json',
    };

    const result = await this.reportsService.generateReport(reportDto);

    if (query.format === 'excel') {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=sales-report.xlsx');
      res.send(result);
    } else {
      res.json(result);
    }
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Generate inventory report' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store' })
  @ApiQuery({ name: 'productId', required: false, description: 'Filter by product' })
  @ApiQuery({ name: 'format', required: false, description: 'Report format (json/excel)' })
  async getInventoryReport(@Query() query: any, @Res() res: Response) {
    const reportDto: ReportRequestDto = {
      type: 'INVENTORY' as any,
      storeId: query.storeId ? parseInt(query.storeId) : undefined,
      productId: query.productId ? parseInt(query.productId) : undefined,
      format: query.format || 'json',
    };

    const result = await this.reportsService.generateReport(reportDto);

    if (query.format === 'excel') {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=inventory-report.xlsx');
      res.send(result);
    } else {
      res.json(result);
    }
  }

  @Get('debts')
  @ApiOperation({ summary: 'Generate debts report' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by client' })
  @ApiQuery({ name: 'format', required: false, description: 'Report format (json/excel)' })
  async getDebtsReport(@Query() query: any, @Res() res: Response) {
    const reportDto: ReportRequestDto = {
      type: 'DEBTS' as any,
      startDate: query.startDate,
      endDate: query.endDate,
      clientId: query.clientId ? parseInt(query.clientId) : undefined,
      format: query.format || 'json',
    };

    const result = await this.reportsService.generateReport(reportDto);

    if (query.format === 'excel') {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=debts-report.xlsx');
      res.send(result);
    } else {
      res.json(result);
    }
  }

  @Get('profits')
  @ApiOperation({ summary: 'Generate profits report' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store' })
  @ApiQuery({ name: 'format', required: false, description: 'Report format (json/excel)' })
  async getProfitsReport(@Query() query: any, @Res() res: Response) {
    const reportDto: ReportRequestDto = {
      type: 'PROFITS' as any,
      startDate: query.startDate,
      endDate: query.endDate,
      storeId: query.storeId ? parseInt(query.storeId) : undefined,
      format: query.format || 'json',
    };

    const result = await this.reportsService.generateReport(reportDto);

    if (query.format === 'excel') {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=profits-report.xlsx');
      res.send(result);
    } else {
      res.json(result);
    }
  }
}
