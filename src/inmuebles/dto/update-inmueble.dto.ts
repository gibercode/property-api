import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateInmuebleDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  precio?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  habitaciones?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  metrosCuadrados?: number;

  @IsOptional()
  @IsUUID()
  tipoInmuebleId?: string;
}
