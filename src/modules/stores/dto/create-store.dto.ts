import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, IsBoolean, IsNumber, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { StoreType } from "../entities/store.entity";

export class CreateStoreDto {
  @ApiProperty({ example: "Mi Tienda" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "Descripción de la tienda", required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: "123 Main St" })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: "+1234567890", required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: "store@example.com", required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  banner?: string;

  @ApiProperty({ 
    enum: StoreType, 
    example: StoreType.INTERNAL,
    description: "Tipo de tienda: INTERNAL (POS) o PUBLIC (Marketplace)",
    required: false 
  })
  @IsEnum(StoreType)
  @IsOptional()
  type?: StoreType;

  @ApiProperty({ 
    example: "mi-tienda",
    description: "Slug único para URL pública (solo para tiendas PUBLIC)",
    required: false 
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: "COP",
    description: "Código de moneda (COP por defecto)",
    required: false,
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ 
    example: false,
    description: "Si está visible públicamente (solo para tiendas PUBLIC)",
    required: false 
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty({ 
    example: 4.6097102,
    description: "Latitud para Google Maps",
    required: false 
  })
  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({ 
    example: -74.081749,
    description: "Longitud para Google Maps",
    required: false 
  })
  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({ 
    example: "Mi Tienda - Título SEO",
    description: "Título para SEO",
    required: false 
  })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiProperty({ 
    example: "Descripción SEO de la tienda",
    description: "Descripción para SEO",
    required: false 
  })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiProperty({ 
    example: "tienda, productos, venta online",
    description: "Palabras clave para SEO",
    required: false 
  })
  @IsString()
  @IsOptional()
  metaKeywords?: string;
}
