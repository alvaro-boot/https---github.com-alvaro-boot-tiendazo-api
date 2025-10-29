import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Product } from "./entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { SearchProductDto } from "./dto/search-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
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
