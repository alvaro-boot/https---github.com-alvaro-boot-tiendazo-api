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
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { SearchProductDto } from "./dto/search-product.dto";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";

@ApiTags("Products")
@Controller("products")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new product" })
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      console.log("📤 Recibida petición para crear producto:", createProductDto);
      const product = await this.productsService.create(createProductDto);
      console.log("✅ Producto creado exitosamente en el controlador:", product);
      return product;
    } catch (error) {
      console.error("❌ Error en el controlador al crear producto:", error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: "Get all products with optional search" })
  @ApiQuery({ name: "q", required: false, description: "Search query" })
  @ApiQuery({
    name: "categoryId",
    required: false,
    description: "Filter by category",
  })
  @ApiQuery({
    name: "storeId",
    required: false,
    description: "Filter by store",
  })
  findAll(@Query() searchDto: SearchProductDto) {
    return this.productsService.findAll(searchDto);
  }

  @Get("low-stock")
  @ApiOperation({ summary: "Get products with low stock" })
  @ApiQuery({
    name: "storeId",
    required: false,
    description: "Filter by store",
  })
  getLowStockProducts(@Query("storeId") storeId?: number) {
    return this.productsService.getLowStockProducts(storeId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by ID" })
  @ApiParam({ name: "id", type: "number" })
  findOne(@Param("id") id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update product" })
  @ApiParam({ name: "id", type: "number" })
  update(@Param("id") id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(":id/stock")
  @ApiOperation({ summary: "Update product stock" })
  @ApiParam({ name: "id", type: "number" })
  updateStock(
    @Param("id") id: number,
    @Body() body: { quantity: number; operation: "add" | "subtract" }
  ) {
    return this.productsService.updateStock(id, body.quantity, body.operation);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete product (soft delete)" })
  @ApiParam({ name: "id", type: "number" })
  remove(@Param("id") id: number) {
    return this.productsService.remove(id);
  }
}
