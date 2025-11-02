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
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "../../core/guards/jwt-auth.guard";

@ApiTags("Categories")
@Controller("categories")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: "Create a new category" })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      console.log("📤 Recibida petición para crear categoría:", createCategoryDto);
      const category = await this.categoriesService.create(createCategoryDto);
      console.log("✅ Categoría creada exitosamente en el controlador:", category);
      return category;
    } catch (error) {
      console.error("❌ Error en el controlador al crear categoría:", error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: "Get all categories" })
  @ApiQuery({ name: "storeId", required: false, description: "Filter by store ID" })
  findAll(@Query("storeId") storeId?: number) {
    return this.categoriesService.findAll(storeId ? +storeId : undefined);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get category by ID" })
  @ApiParam({ name: "id", type: "number" })
  findOne(@Param("id") id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update category" })
  @ApiParam({ name: "id", type: "number" })
  update(
    @Param("id") id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete category" })
  @ApiParam({ name: "id", type: "number" })
  remove(@Param("id") id: number) {
    return this.categoriesService.remove(id);
  }
}
