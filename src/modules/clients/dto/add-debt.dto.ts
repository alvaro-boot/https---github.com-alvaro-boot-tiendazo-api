import { IsNumber, IsPositive, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddDebtDto {
  @ApiProperty({ example: 1000.50, description: 'Amount to add to debt' })
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'Deuda por producto prestado', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

