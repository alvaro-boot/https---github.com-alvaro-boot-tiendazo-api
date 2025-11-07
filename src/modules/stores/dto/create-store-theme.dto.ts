import { IsString, IsOptional, IsBoolean, IsEnum, IsObject, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { StoreTemplate } from "../entities/store-theme.entity";

class LayoutConfigDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  featuredProducts?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  banners?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  sections?: any;
}

export class CreateStoreThemeDto {
  @ApiProperty({ 
    enum: StoreTemplate, 
    example: StoreTemplate.MODERN,
    required: false 
  })
  @IsEnum(StoreTemplate)
  @IsOptional()
  template?: StoreTemplate;

  @ApiProperty({ example: "#3B82F6", required: false })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiProperty({ example: "#8B5CF6", required: false })
  @IsString()
  @IsOptional()
  secondaryColor?: string;

  @ApiProperty({ example: "#10B981", required: false })
  @IsString()
  @IsOptional()
  accentColor?: string;

  @ApiProperty({ example: "#FFFFFF", required: false })
  @IsString()
  @IsOptional()
  backgroundColor?: string;

  @ApiProperty({ example: "#1F2937", required: false })
  @IsString()
  @IsOptional()
  textColor?: string;

  @ApiProperty({ example: "Inter", required: false })
  @IsString()
  @IsOptional()
  fontFamily?: string;

  @ApiProperty({ example: "Inter", required: false })
  @IsString()
  @IsOptional()
  headingFont?: string;

  @ApiProperty({ example: "Inter", required: false })
  @IsString()
  @IsOptional()
  bodyFont?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  favicon?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  customBanner?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  showReviews?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  showFeatured?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  showCategories?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  showContact?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  showBlog?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => LayoutConfigDto)
  layoutConfig?: LayoutConfigDto;

  @ApiProperty({ example: "mitienda.com", required: false })
  @IsString()
  @IsOptional()
  customDomain?: string;

  @ApiProperty({ example: "mitienda", required: false })
  @IsString()
  @IsOptional()
  subdomain?: string;

  @ApiProperty({ example: "UA-XXXXXXXXX-X", required: false })
  @IsString()
  @IsOptional()
  googleAnalyticsId?: string;

  @ApiProperty({ example: "123456789", required: false })
  @IsString()
  @IsOptional()
  facebookPixelId?: string;

  @ApiProperty({ example: "abc123", required: false })
  @IsString()
  @IsOptional()
  mailchimpListId?: string;
}

