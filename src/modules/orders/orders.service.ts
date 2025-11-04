import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../products/entities/product.entity';
import { Store } from '../stores/entities/store.entity';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private dataSource: DataSource,
  ) {}

  /**
   * Generar número de pedido único
   */
  private async generateOrderNumber(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Crear nuevo pedido
   */
  async create(createOrderDto: CreateOrderDto, userId?: number): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validar tienda
      const store = await queryRunner.manager.findOne(Store, {
        where: { id: createOrderDto.storeId, isActive: true },
      });

      if (!store) {
        throw new NotFoundException('Tienda no encontrada');
      }

      // Validar cliente si existe
      let client: Client | null = null;
      if (createOrderDto.clientId) {
        client = await queryRunner.manager.findOne(Client, {
          where: { id: createOrderDto.clientId, storeId: store.id },
        });

        if (!client) {
          throw new NotFoundException('Cliente no encontrado');
        }
      }

      // Validar productos y calcular totales
      let subtotal = 0;
      const orderItems: OrderItem[] = [];

      for (const itemDto of createOrderDto.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: {
            id: itemDto.productId,
            storeId: store.id,
            isActive: true,
          },
        });

        if (!product) {
          throw new NotFoundException(`Producto ${itemDto.productId} no encontrado`);
        }

        // Verificar stock disponible
        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para el producto ${product.name}. Disponible: ${product.stock}`,
          );
        }

        // Calcular subtotal del item
        const itemSubtotal = Number(product.sellPrice) * itemDto.quantity;
        subtotal += itemSubtotal;

        // Crear item del pedido
        const orderItem = queryRunner.manager.create(OrderItem, {
          productId: product.id,
          productName: product.name,
          unitPrice: Number(product.sellPrice),
          purchasePrice: Number(product.purchasePrice),
          quantity: itemDto.quantity,
          subtotal: itemSubtotal,
        });

        orderItems.push(orderItem);

        // Reducir stock
        product.stock -= itemDto.quantity;
        await queryRunner.manager.save(product);
      }

      // Calcular totales
      const tax = subtotal * 0.19; // IVA 19% (configurable)
      const shipping = createOrderDto.shippingAddress ? 0 : 0; // Calcular según configuración
      const total = subtotal + tax + shipping;

      // Crear pedido
      const orderNumber = await this.generateOrderNumber();
      const order = queryRunner.manager.create(Order, {
        orderNumber,
        storeId: store.id,
        userId: userId || null,
        clientId: client?.id || null,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: createOrderDto.paymentMethod || PaymentMethod.ONLINE,
        subtotal,
        tax,
        shipping,
        total,
        currency: store.currency || 'COP',
        shippingAddress: createOrderDto.shippingAddress,
        shippingCity: createOrderDto.shippingCity,
        shippingState: createOrderDto.shippingState,
        shippingZipCode: createOrderDto.shippingZipCode,
        shippingCountry: createOrderDto.shippingCountry || 'Colombia',
        shippingPhone: createOrderDto.shippingPhone,
        shippingName: createOrderDto.shippingName,
        notes: createOrderDto.notes,
      });

      const savedOrder = await queryRunner.manager.save(order);

      // Asignar orderId a los items y guardarlos
      for (const item of orderItems) {
        item.orderId = savedOrder.id;
        await queryRunner.manager.save(item);
      }

      await queryRunner.commitTransaction();

      // Retornar pedido con relaciones
      return this.findOne(savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Buscar pedido por ID
   */
  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['store', 'user', 'client', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return order;
  }

  /**
   * Buscar pedido por número
   */
  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderNumber },
      relations: ['store', 'user', 'client', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Pedido ${orderNumber} no encontrado`);
    }

    return order;
  }

  /**
   * Listar pedidos con filtros
   */
  async findAll(filters?: {
    storeId?: number;
    clientId?: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
  }): Promise<Order[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .orderBy('order.createdAt', 'DESC');

    if (filters?.storeId) {
      query.andWhere('order.storeId = :storeId', { storeId: filters.storeId });
    }

    if (filters?.clientId) {
      query.andWhere('order.clientId = :clientId', { clientId: filters.clientId });
    }

    if (filters?.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }

    if (filters?.paymentStatus) {
      query.andWhere('order.paymentStatus = :paymentStatus', {
        paymentStatus: filters.paymentStatus,
      });
    }

    return query.getMany();
  }

  /**
   * Actualizar estado del pedido
   */
  async updateStatus(
    id: number,
    status: OrderStatus,
    internalNotes?: string,
  ): Promise<Order> {
    const order = await this.findOne(id);

    order.status = status;
    if (internalNotes) {
      order.internalNotes = internalNotes;
    }

    return this.orderRepository.save(order);
  }

  /**
   * Actualizar estado de pago
   */
  async updatePaymentStatus(
    id: number,
    paymentStatus: PaymentStatus,
    transactionId?: string,
    gatewayResponse?: any,
  ): Promise<Order> {
    const order = await this.findOne(id);

    order.paymentStatus = paymentStatus;

    if (paymentStatus === PaymentStatus.APPROVED) {
      order.status = OrderStatus.PAID;
    }

    if (transactionId) {
      order.paymentGatewayTransactionId = transactionId;
    }

    if (gatewayResponse) {
      order.paymentGatewayResponse = JSON.stringify(gatewayResponse);
    }

    return this.orderRepository.save(order);
  }
}

