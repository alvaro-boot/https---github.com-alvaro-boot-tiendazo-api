import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";
import { ElectronicInvoiceService } from "./electronic-invoice.service";
import { CreateElectronicInvoiceDto } from "./dto/create-electronic-invoice.dto";
import { UpdateElectronicInvoiceDto } from "./dto/update-electronic-invoice.dto";
import { ElectronicInvoice } from "./entities/electronic-invoice.entity";

@ApiTags("Electronic Invoices")
@Controller("electronic-invoices")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ElectronicInvoiceController {
  constructor(private readonly invoiceService: ElectronicInvoiceService) {}

  @Post()
  @ApiOperation({ summary: "Create electronic invoice" })
  @ApiResponse({ status: 201, description: "Invoice created successfully" })
  async create(
    @Body() createDto: CreateElectronicInvoiceDto,
    @Request() req: any,
  ): Promise<ElectronicInvoice> {
    // Agregar userId del usuario autenticado si no se proporciona
    if (!createDto.userId && req.user) {
      createDto.userId = req.user.id;
    }

    return await this.invoiceService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all electronic invoices" })
  @ApiResponse({ status: 200, description: "Invoices retrieved successfully" })
  async findAll(@Query("storeId") storeId?: number): Promise<ElectronicInvoice[]> {
    return await this.invoiceService.findAll(storeId ? +storeId : undefined);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get electronic invoice by ID" })
  @ApiResponse({ status: 200, description: "Invoice retrieved successfully" })
  async findOne(@Param("id") id: number): Promise<ElectronicInvoice> {
    return await this.invoiceService.findOne(+id);
  }

  @Get("number/:invoiceNumber")
  @ApiOperation({ summary: "Get electronic invoice by number" })
  @ApiResponse({ status: 200, description: "Invoice retrieved successfully" })
  async findByInvoiceNumber(@Param("invoiceNumber") invoiceNumber: string): Promise<ElectronicInvoice> {
    return await this.invoiceService.findByInvoiceNumber(invoiceNumber);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update electronic invoice" })
  @ApiResponse({ status: 200, description: "Invoice updated successfully" })
  async update(
    @Param("id") id: number,
    @Body() updateDto: UpdateElectronicInvoiceDto,
  ): Promise<ElectronicInvoice> {
    return await this.invoiceService.update(+id, updateDto);
  }

  @Post(":id/send")
  @ApiOperation({ summary: "Send invoice to customer" })
  @ApiResponse({ status: 200, description: "Invoice sent successfully" })
  async sendToCustomer(@Param("id") id: number): Promise<{ message: string }> {
    await this.invoiceService.sendToCustomer(+id);
    return { message: "Invoice sent successfully" };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete electronic invoice" })
  @ApiResponse({ status: 200, description: "Invoice deleted successfully" })
  async remove(@Param("id") id: number): Promise<{ message: string }> {
    await this.invoiceService.delete(+id);
    return { message: "Invoice deleted successfully" };
  }
}

