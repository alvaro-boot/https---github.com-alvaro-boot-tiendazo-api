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
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { SearchClientDto } from "./dto/search-client.dto";
import { AddDebtDto } from "./dto/add-debt.dto";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";
import { AuthUser } from "../../core/decorators/auth-user.decorator";

@ApiTags("Clients")
@Controller("clients")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new client" })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all clients with optional search" })
  @ApiQuery({ name: "q", required: false, description: "Search query" })
  @ApiQuery({ name: "storeId", required: false, description: "Filter by store" })
  findAll(@Query() searchDto: SearchClientDto) {
    return this.clientsService.findAll(searchDto);
  }

  @Get("with-debt")
  @ApiOperation({ summary: "Get clients with outstanding debt" })
  @ApiQuery({ name: "storeId", required: false, description: "Filter by store" })
  getClientsWithDebt(@Query("storeId") storeId?: number) {
    return this.clientsService.getClientsWithDebt(storeId ? Number(storeId) : undefined);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get client by ID" })
  @ApiParam({ name: "id", type: "number" })
  findOne(@Param("id") id: number) {
    return this.clientsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update client" })
  @ApiParam({ name: "id", type: "number" })
  update(@Param("id") id: number, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Patch(":id/debt")
  @ApiOperation({ summary: "Update client debt" })
  @ApiParam({ name: "id", type: "number" })
  updateDebt(
    @Param("id") id: number,
    @Body() body: { amount: number; operation: "add" | "subtract" }
  ) {
    return this.clientsService.updateDebt(id, body.amount, body.operation);
  }

  @Post(":id/add-debt")
  @ApiOperation({ summary: "Add debt manually to client (Admin only)" })
  @ApiParam({ name: "id", type: "number" })
  addDebtManually(
    @Param("id") id: number,
    @Body() addDebtDto: AddDebtDto,
    @AuthUser() user: any
  ) {
    // Verificar que solo los administradores puedan agregar deuda manualmente
    if (user.role !== "ADMIN") {
      throw new UnauthorizedException("Only administrators can add debt manually");
    }
    return this.clientsService.addDebtManually(id, addDebtDto.amount, addDebtDto.notes);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete client" })
  @ApiParam({ name: "id", type: "number" })
  remove(@Param("id") id: number) {
    return this.clientsService.remove(id);
  }
}
