import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Product } from "./entities/product.entity";
import { Category } from "../categories/entities/category.entity";
import { Store } from "../stores/entities/store.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { SearchProductDto } from "./dto/search-product.dto";

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

    const product = this.productRepository.create(createProductDto);
    console.log("📦 Producto creado (antes de guardar):", product);
    
    const savedProduct = await this.productRepository.save(product);
    console.log("✅ Producto guardado exitosamente:", savedProduct);
    
    return savedProduct;
  }

  async findAll(searchDto?: SearchProductDto): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.store", "store");

    if (searchDto?.q) {
      query.where(
        "product.name LIKE :search OR product.description LIKE :search",
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
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["category", "store", "saleDetails"],
    });

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
    product.isActive = false;
    await this.productRepository.save(product);
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
      .andWhere("product.isActive = :isActive", { isActive: true });

    if (storeId) {
      query.andWhere("product.storeId = :storeId", { storeId });
    }

    return query.getMany();
  }
}
