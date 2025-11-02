import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { Store } from "../stores/entities/store.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      console.log("🔍 Creando categoría con datos:", createCategoryDto);

      // Validar que la tienda existe
      const store = await this.storeRepository.findOne({
        where: { id: createCategoryDto.storeId },
      });

      if (!store) {
        throw new NotFoundException(
          `Store with ID ${createCategoryDto.storeId} not found`
        );
      }

      console.log("✅ Tienda encontrada:", store.name);

      const category = this.categoryRepository.create(createCategoryDto);
      console.log("📦 Entidad de categoría creada:", category);

      const savedCategory = await this.categoryRepository.save(category);
      console.log("✅ Categoría guardada exitosamente en BD:", savedCategory);

      // Verificar que realmente se guardó
      const verifiedCategory = await this.categoryRepository.findOne({
        where: { id: savedCategory.id },
      });

      if (!verifiedCategory) {
        console.error("❌ ERROR: La categoría no se encontró después de guardar!");
        throw new Error("Failed to save category to database");
      }

      console.log("✅ Categoría verificada en BD:", verifiedCategory);

      return savedCategory;
    } catch (error) {
      console.error("❌ Error creando categoría:", error);
      throw error;
    }
  }

  async findAll(storeId?: number): Promise<Category[]> {
    const where = storeId ? { storeId } : {};
    return this.categoryRepository.find({
      where,
      relations: ["products", "store"],
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ["products"],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
