import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Store, StoreType } from '../stores/entities/store.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * Obtener todas las tiendas públicas
   */
  async getPublicStores(category?: string): Promise<Store[]> {
    const query = this.storeRepository
      .createQueryBuilder('store')
      .where('store.type = :type', { type: StoreType.PUBLIC })
      .andWhere('store.isActive = :isActive', { isActive: true })
      .andWhere('store.isPublic = :isPublic', { isPublic: true })
      .orderBy('store.name', 'ASC');

    // TODO: Filtrar por categoría cuando se implemente

    return query.getMany();
  }

  /**
   * Obtener tienda por slug
   */
  async getStoreBySlug(slug: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: {
        slug,
        type: StoreType.PUBLIC,
        isActive: true,
        isPublic: true,
      },
      relations: ['categories'],
    });

    if (!store) {
      throw new NotFoundException(`Tienda con slug "${slug}" no encontrada`);
    }

    // Incrementar contador de vistas (opcional)
    // store.views = (store.views || 0) + 1;
    // await this.storeRepository.save(store);

    return store;
  }

  /**
   * Obtener productos de una tienda pública
   */
  async getStoreProducts(
    slug: string,
    filters: {
      category?: string;
      search?: string;
      sort?: string;
      page: number;
      limit: number;
    },
  ) {
    // Verificar que la tienda existe y es pública
    const store = await this.getStoreBySlug(slug);

    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.storeId = :storeId', { storeId: store.id })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .andWhere('product.isPublic = :isPublic', { isPublic: true });

    // Filtro por categoría
    if (filters.category) {
      query.andWhere('product.categoryId = :categoryId', {
        categoryId: filters.category,
      });
    }

    // Búsqueda
    if (filters.search) {
      query.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Ordenamiento
    switch (filters.sort) {
      case 'price_asc':
        query.orderBy('product.sellPrice', 'ASC');
        break;
      case 'price_desc':
        query.orderBy('product.sellPrice', 'DESC');
        break;
      case 'name_asc':
        query.orderBy('product.name', 'ASC');
        break;
      case 'name_desc':
        query.orderBy('product.name', 'DESC');
        break;
      case 'popular':
        query.orderBy('product.salesCount', 'DESC');
        break;
      default:
        query.orderBy('product.createdAt', 'DESC');
    }

    // Paginación
    const skip = (filters.page - 1) * filters.limit;
    query.skip(skip).take(filters.limit);

    const [products, total] = await query.getManyAndCount();

    return {
      products,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  /**
   * Obtener producto por ID
   */
  async getProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id,
        isActive: true,
        isPublic: true,
      },
      relations: ['category', 'store'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Incrementar contador de vistas
    product.views = (product.views || 0) + 1;
    await this.productRepository.save(product);

    return product;
  }

  /**
   * Obtener producto por slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        slug,
        isActive: true,
        isPublic: true,
      },
      relations: ['category', 'store'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con slug "${slug}" no encontrado`);
    }

    // Incrementar contador de vistas
    product.views = (product.views || 0) + 1;
    await this.productRepository.save(product);

    return product;
  }
}

