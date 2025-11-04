import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Product } from "./entities/product.entity";
import { Category } from "../categories/entities/category.entity";
import { Store } from "../stores/entities/store.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { SearchProductDto } from "./dto/search-product.dto";
import { generateUniqueSlug } from "../../shared/utils/slug.util";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    console.log("🔍 Creando producto con datos:", createProductDto);
    
    // Validar que la categoría existe
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    });
    
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createProductDto.categoryId} not found`
      );
    }

    // Validar que la tienda existe
    const store = await this.storeRepository.findOne({
      where: { id: createProductDto.storeId },
    });

    if (!store) {
      throw new NotFoundException(
        `Store with ID ${createProductDto.storeId} not found`
      );
    }

    // Generar slug automáticamente si el producto es público y no se proporcionó
    const productData = { ...createProductDto } as any;
    if (productData.isPublic && !productData.slug) {
      productData.slug = await generateUniqueSlug(
        productData.name,
        async (slug: string) => {
          const exists = await this.productRepository.findOne({
            where: { slug },
          });
          return !!exists;
        },
      );
      console.log("🔗 Slug generado automáticamente para producto:", productData.slug);
    }

    const product = this.productRepository.create(productData);
    console.log("📦 Producto creado (antes de guardar):", product);
    
    const savedProduct = await this.productRepository.save(product);
    console.log("✅ Producto guardado exitosamente:", savedProduct);
    
    return savedProduct as Product;
  }

  async findAll(searchDto?: SearchProductDto): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.store", "store")
      .where("product.deletedAt IS NULL"); // Excluir productos eliminados

    if (searchDto?.q) {
      query.andWhere(
        "(product.name LIKE :search OR product.description LIKE :search)",
        {
          search: `%${searchDto.q}%`,
        }
      );
    }

    if (searchDto?.categoryId) {
      query.andWhere("product.categoryId = :categoryId", {
        categoryId: searchDto.categoryId,
      });
    }

    if (searchDto?.storeId) {
      query.andWhere("product.storeId = :storeId", {
        storeId: searchDto.storeId,
      });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Product> {
    // Usar query builder para excluir productos eliminados explícitamente
    const product = await this.productRepository
      .createQueryBuilder("product")
      .where("product.id = :id", { id })
      .andWhere("product.deletedAt IS NULL") // Excluir productos eliminados
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.store", "store")
      .leftJoinAndSelect("product.saleDetails", "saleDetails")
      .getOne();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    // Usar soft delete de TypeORM para establecer deletedAt
    await this.productRepository.softRemove(product);
    console.log(`✅ Producto ${id} eliminado (soft delete), deletedAt establecido`);
  }

  async updateStock(
    id: number,
    quantity: number,
    operation: "add" | "subtract"
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (operation === "add") {
      product.stock += quantity;
    } else {
      if (product.stock < quantity) {
        throw new Error("Insufficient stock");
      }
      product.stock -= quantity;
    }

    return this.productRepository.save(product);
  }

  async getLowStockProducts(storeId?: number): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder("product")
      .where("product.stock <= product.minStock")
      .andWhere("product.deletedAt IS NULL") // Excluir productos eliminados
      .andWhere("product.isActive = :isActive", { isActive: true });

    if (storeId) {
      query.andWhere("product.storeId = :storeId", { storeId });
    }

    return query.getMany();
  }
}
