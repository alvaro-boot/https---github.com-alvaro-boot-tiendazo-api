import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    try {
      console.log("🔍 Creando tienda con datos:", createStoreDto);
      
      // Filtrar campos desconocidos como taxRate que no existen en la entidad
      const dto = createStoreDto as any;
      const { taxRate, ...validStoreData } = dto;
      
      console.log("📦 Datos válidos después de filtrar:", validStoreData);
      
      const store = this.storeRepository.create(validStoreData as Partial<Store>);
      console.log("🏪 Entidad de tienda creada:", store);
      
      const savedStore: Store = await this.storeRepository.save(store) as Store;
      console.log("✅ Tienda guardada exitosamente en BD:", savedStore);
      console.log("✅ ID de tienda guardada:", savedStore.id);
      
      // Verificar que realmente se guardó
      const verifiedStore = await this.storeRepository.findOne({
        where: { id: savedStore.id },
      });
      
      if (!verifiedStore) {
        console.error("❌ ERROR: La tienda no se encontró después de guardar!");
        throw new Error("Failed to save store to database");
      }
      
      console.log("✅ Tienda verificada en BD:", verifiedStore);
      
      return savedStore;
    } catch (error) {
      console.error("❌ Error creando tienda:", error);
      throw error;
    }
  }

  async findAll(): Promise<Store[]> {
    return this.storeRepository.find({
      where: { isActive: true },
      relations: ['users', 'products'],
    });
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id, isActive: true },
      relations: ['users', 'products', 'sales'],
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    // Filtrar campos desconocidos como taxRate que no existen en la entidad
    const { taxRate, ...validStoreData } = updateStoreDto as any;
    Object.assign(store, validStoreData);
    return this.storeRepository.save(store);
  }

  async remove(id: number): Promise<void> {
    const store = await this.findOne(id);
    store.isActive = false;
    await this.storeRepository.save(store);
  }
}
