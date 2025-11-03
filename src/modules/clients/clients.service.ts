import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { Client } from "./entities/client.entity";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { SearchClientDto } from "./dto/search-client.dto";

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
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
      .leftJoinAndSelect("client.sales", "sales");

    if (searchDto?.q) {
      query.where(
        "client.fullName LIKE :search OR client.email LIKE :search OR client.phone LIKE :search",
        {
          search: `%${searchDto.q}%`,
        }
      );
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

    if (operation === "add") {
      client.debt += amount;
    } else {
      if (client.debt < amount) {
        throw new Error("Insufficient debt amount");
      }
      client.debt -= amount;
    }

    return this.clientRepository.save(client);
  }

  async getClientsWithDebt(): Promise<Client[]> {
    return this.clientRepository.find({
      where: { debt: { $gt: 0 } } as any,
      relations: ["sales"],
    });
  }
}
