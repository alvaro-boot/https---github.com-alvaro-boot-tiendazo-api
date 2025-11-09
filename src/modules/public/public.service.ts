import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Store, StoreType } from '../stores/entities/store.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { StoreTheme } from '../stores/entities/store-theme.entity';
import { StoreThemesService } from '../stores/store-themes.service';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(StoreTheme)
    private themeRepository: Repository<StoreTheme>,
    private themesService: StoreThemesService,
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

    // No incluir el tema en la respuesta para evitar problemas de serialización
    // El frontend puede obtenerlo por separado si lo necesita
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
      .andWhere('product.isPublic = :isPublic', { isPublic: true })
      .andWhere('product.deletedAt IS NULL'); // Filtrar productos no eliminados

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
        // Ordenar por views si salesCount no existe, o por createdAt
        query.orderBy('product.views', 'DESC');
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

  /**
   * Obtener tema de una tienda por slug (público)
   */
  async getStoreTheme(slug: string): Promise<StoreTheme> {
    const store = await this.getStoreBySlug(slug);
    return await this.themesService.findOneOrCreate(store.id);
  }

  /**
   * Renderiza la página web completa de una tienda usando su plantilla
   * Usa Factory y Strategy patterns para generar el HTML
   */
  async renderStoreWebPage(slug: string): Promise<string> {
    const store = await this.getStoreBySlug(slug);
    const theme = await this.themesService.findOneOrCreate(store.id);

    if (theme.generatedHtml) {
      return theme.generatedHtml;
    }
    
    // Obtener productos de la tienda para la primera generación
    const productsResponse = await this.getStoreProducts(slug, {
      page: 1,
      limit: 50,
    });
    
    const featuredProducts = productsResponse.products.slice(0, 6);
    
    const result = await this.themesService.renderStorePage(store.id, {
      products: productsResponse.products,
      featuredProducts,
      storeInfo: store,
    });
    
    return result.html;
  }
}

