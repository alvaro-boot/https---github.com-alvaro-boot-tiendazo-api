import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { PublicService } from './public.service';

@ApiTags('Public')
@Controller('public')
@Public()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('stores')
  @ApiOperation({ summary: 'Get all public stores' })
  @ApiQuery({ name: 'category', required: false })
  async getPublicStores(@Query('category') category?: string) {
    return this.publicService.getPublicStores(category);
  }

  @Get('stores/:slug')
  @ApiOperation({ summary: 'Get store by slug' })
  async getStoreBySlug(@Param('slug') slug: string) {
    return this.publicService.getStoreBySlug(slug);
  }

  @Get('stores/:slug/products')
  @ApiOperation({ summary: 'Get products from a public store' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getStoreProducts(
    @Param('slug') slug: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.publicService.getStoreProducts(slug, {
      category,
      search,
      sort,
      page: page || 1,
      limit: limit || 20,
    });
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.publicService.getProduct(id);
  }

  @Get('products/:slug/details')
  @ApiOperation({ summary: 'Get product by slug' })
  async getProductBySlug(@Param('slug') slug: string) {
    return this.publicService.getProductBySlug(slug);
  }

  @Get('stores/:slug/render')
  @ApiOperation({ summary: 'Render store web page with template' })
  async renderStorePage(@Param('slug') slug: string) {
    const html = await this.publicService.renderStoreWebPage(slug);
    // Retornar HTML como texto plano
    return html;
  }

  @Get('stores/:slug/theme')
  @ApiOperation({ summary: 'Get store theme by slug (public)' })
  async getStoreTheme(@Param('slug') slug: string) {
    return this.publicService.getStoreTheme(slug);
  }
}

