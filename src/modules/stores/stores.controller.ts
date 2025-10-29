import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { StoresService } from "./stores.service";
import { CreateStoreDto } from "./dto/create-store.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";
import { Roles } from "../../core/decorators/roles.decorator";
import { RolesGuard } from "../../core/guards/roles.guard";
import { Public } from "../../core/decorators/public.decorator";

@ApiTags("Stores")
@Controller("stores")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: "Create a new store (public endpoint)" })
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all stores" })
  findAll() {
    return this.storesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get store by ID" })
  @ApiParam({ name: "id", type: "number" })
  findOne(@Param("id") id: number) {
    return this.storesService.findOne(id);
  }

  @Patch(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Update store" })
  @ApiParam({ name: "id", type: "number" })
  update(@Param("id") id: number, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto);
  }

  @Delete(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Delete store (soft delete)" })
  @ApiParam({ name: "id", type: "number" })
  remove(@Param("id") id: number) {
    return this.storesService.remove(id);
  }
}
