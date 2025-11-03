import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Client } from "./entities/client.entity";
import { Store } from "../stores/entities/store.entity";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { SearchClientDto } from "./dto/search-client.dto";

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Validar que la tienda existe si se proporciona storeId
    if (createClientDto.storeId) {
      const store = await this.storeRepository.findOne({
        where: { id: createClientDto.storeId },
      });
      if (!store) {
        throw new NotFoundException(
          `Store with ID ${createClientDto.storeId} not found`
        );
      }
    }

    // Limpiar email vacío (convertir a undefined o null)
    const cleanedDto = {
      ...createClientDto,
      email: createClientDto.email && createClientDto.email.trim() !== "" 
        ? createClientDto.email.trim() 
        : undefined,
    };
    
    const client = this.clientRepository.create(cleanedDto);
    return this.clientRepository.save(client);
  }

  async findAll(searchDto?: SearchClientDto): Promise<Client[]> {
    const query = this.clientRepository
      .createQueryBuilder("client")
      .leftJoinAndSelect("client.sales", "sales")
      .leftJoinAndSelect("client.store", "store");

    // Filtrar por tienda si se proporciona
    if (searchDto?.storeId) {
      query.where("client.storeId = :storeId", {
        storeId: searchDto.storeId,
      });
    }

    if (searchDto?.q) {
      // Si ya hay un where, usar andWhere
      if (searchDto?.storeId) {
        query.andWhere(
          "(client.fullName LIKE :search OR client.email LIKE :search OR client.phone LIKE :search)",
          {
            search: `%${searchDto.q}%`,
          }
        );
      } else {
        query.where(
          "client.fullName LIKE :search OR client.email LIKE :search OR client.phone LIKE :search",
          {
            search: `%${searchDto.q}%`,
          }
        );
      }
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ["sales", "sales.details", "sales.details.product"],
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    
    // Limpiar email vacío (convertir a undefined o null)
    const cleanedDto = {
      ...updateClientDto,
      email: updateClientDto.email !== undefined 
        ? (updateClientDto.email && updateClientDto.email.trim() !== "" 
          ? updateClientDto.email.trim() 
          : undefined)
        : updateClientDto.email,
    };
    
    Object.assign(client, cleanedDto);
    return this.clientRepository.save(client);
  }

  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
  }

  async updateDebt(
    id: number,
    amount: number,
    operation: "add" | "subtract"
  ): Promise<Client> {
    const client = await this.findOne(id);

    // Convertir valores a número para asegurar precisión
    const currentDebt = parseFloat(String(client.debt || 0));
    const operationAmount = parseFloat(String(amount || 0));
    
    if (operation === "add") {
      client.debt = currentDebt + operationAmount;
    } else {
      if (currentDebt < operationAmount) {
        throw new Error("Insufficient debt amount");
      }
      client.debt = currentDebt - operationAmount;
    }

    return this.clientRepository.save(client);
  }

  async getClientsWithDebt(storeId?: number): Promise<Client[]> {
    const query = this.clientRepository
      .createQueryBuilder('client')
      .where('client.debt > :minDebt', { minDebt: 0 })
      .leftJoinAndSelect('client.sales', 'sales')
      .leftJoinAndSelect('sales.details', 'details')
      .leftJoinAndSelect('details.product', 'product')
      .leftJoinAndSelect('client.store', 'store');

    // Filtrar por tienda si se proporciona
    if (storeId) {
      query.andWhere('client.storeId = :storeId', { storeId });
    }

    query.orderBy('client.debt', 'DESC');
    
    return query.getMany();
  }
}
