import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { SalesService } from "./sales.service";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { UpdateSaleDto } from "./dto/update-sale.dto";
import { SaleReportDto } from "./dto/sale-report.dto";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";
import { AuthUser } from "../../core/decorators/auth-user.decorator";

@ApiTags("Sales")
@Controller("sales")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: "Create a new sale" })
  create(@Body() createSaleDto: CreateSaleDto, @AuthUser() user: any) {
    return this.salesService.create(createSaleDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: "Get all sales with optional filters" })
  @ApiQuery({
    name: "startDate",
    required: false,
    description: "Start date (YYYY-MM-DD)",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    description: "End date (YYYY-MM-DD)",
  })
  @ApiQuery({
    name: "storeId",
    required: false,
    description: "Filter by store",
  })
  findAll(@Query() reportDto: SaleReportDto) {
    return this.salesService.findAll(reportDto);
  }

  @Get("report")
  @ApiOperation({ summary: "Get sales report" })
  @ApiQuery({
    name: "startDate",
    required: false,
    description: "Start date (YYYY-MM-DD)",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    description: "End date (YYYY-MM-DD)",
  })
  @ApiQuery({
    name: "storeId",
    required: false,
    description: "Filter by store",
  })
  getSalesReport(@Query() reportDto: SaleReportDto) {
    return this.salesService.getSalesReport(reportDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get sale by ID" })
  @ApiParam({ name: "id", type: "number" })
  findOne(@Param("id") id: number) {
    return this.salesService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update sale" })
  @ApiParam({ name: "id", type: "number" })
  update(@Param("id") id: number, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Patch(":id/cancel")
  @ApiOperation({ summary: "Cancel sale" })
  @ApiParam({ name: "id", type: "number" })
  cancel(@Param("id") id: number) {
    return this.salesService.cancel(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete sale" })
  @ApiParam({ name: "id", type: "number" })
  remove(@Param("id") id: number) {
    return this.salesService.remove(id);
  }
}
