import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMovement, MovementType } from './entities/inventory-movement.entity';
import { Product } from '../products/entities/product.entity';
import { CreateInventoryMovementDto } from './dto/create-movement.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryMovement)
    private movementRepository: Repository<InventoryMovement>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createMovement(createMovementDto: CreateInventoryMovementDto, userId: number): Promise<InventoryMovement> {
    const { productId, type, quantity, unitPrice, reason, reference } = createMovementDto;

    const product = await this.productRepository.findOne({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const previousStock = product.stock;
    let newStock = previousStock;

    // Calcular nuevo stock según el tipo de movimiento
    switch (type) {
      case MovementType.IN:
      case MovementType.RETURN:
        newStock = previousStock + quantity;
        break;
      case MovementType.OUT:
      case MovementType.SALE:
        if (previousStock < quantity) {
          throw new BadRequestException('Insufficient stock');
        }
        newStock = previousStock - quantity;
        break;
      case MovementType.ADJUSTMENT:
        newStock = quantity; // Para ajustes, la cantidad es el nuevo stock
        break;
    }

    // Crear el movimiento
    const movement = this.movementRepository.create({
      productId,
      type,
      quantity: type === MovementType.ADJUSTMENT ? Math.abs(newStock - previousStock) : quantity,
      unitPrice,
      totalValue: unitPrice ? unitPrice * quantity : null,
      reason,
      reference,
      userId,
      previousStock,
      newStock,
    });

    const savedMovement = await this.movementRepository.save(movement);

    // Actualizar stock del producto
    product.stock = newStock;
    await this.productRepository.save(product);

    return this.findOne(savedMovement.id);
  }

  async adjustStock(adjustStockDto: AdjustStockDto, userId: number): Promise<InventoryMovement> {
    const { productId, newStock, reason } = adjustStockDto;

    const product = await this.productRepository.findOne({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const previousStock = product.stock;
    const difference = newStock - previousStock;

    if (difference === 0) {
      throw new BadRequestException('No stock adjustment needed');
    }

    const movement = this.movementRepository.create({
      productId,
      type: MovementType.ADJUSTMENT,
      quantity: Math.abs(difference),
      reason: reason || 'Stock adjustment',
      userId,
      previousStock,
      newStock,
    });

    const savedMovement = await this.movementRepository.save(movement);

    // Actualizar stock del producto
    product.stock = newStock;
    await this.productRepository.save(product);

    return this.findOne(savedMovement.id);
  }

  async findAll(productId?: number): Promise<InventoryMovement[]> {
    const query = this.movementRepository.createQueryBuilder('movement')
      .leftJoinAndSelect('movement.product', 'product')
      .leftJoinAndSelect('movement.user', 'user')
      .orderBy('movement.createdAt', 'DESC');

    if (productId) {
      query.where('movement.productId = :productId', { productId });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<InventoryMovement> {
    const movement = await this.movementRepository.findOne({
      where: { id },
      relations: ['product', 'user'],
    });

    if (!movement) {
      throw new NotFoundException(`Inventory movement with ID ${id} not found`);
    }

    return movement;
  }

  async getStockHistory(productId: number): Promise<InventoryMovement[]> {
    return this.movementRepository.find({
      where: { productId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getLowStockProducts(storeId?: number): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product')
      .where('product.stock <= product.minStock')
      .andWhere('product.isActive = :isActive', { isActive: true });

    if (storeId) {
      query.andWhere('product.storeId = :storeId', { storeId });
    }

    return query.getMany();
  }

  async getInventoryReport(storeId?: number) {
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.store', 'store')
      .where('product.isActive = :isActive', { isActive: true });

    if (storeId) {
      query.andWhere('product.storeId = :storeId', { storeId });
    }

    const products = await query.getMany();

    const totalValue = products.reduce((sum, product) => {
      return sum + (product.stock * product.purchasePrice);
    }, 0);

    const lowStockCount = products.filter(product => product.stock <= product.minStock).length;

    return {
      totalProducts: products.length,
      totalValue,
      lowStockCount,
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        minStock: product.minStock,
        value: product.stock * product.purchasePrice,
        isLowStock: product.stock <= product.minStock,
      })),
    };
  }
}
