import { IsInt, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateInmuebleDto {
  @IsString()
  @MaxLength(255)
  direccion: string;

  @IsInt()
  @Min(1)
  precio: number;

  @IsInt()
  @Min(0)
  habitaciones: number;

  @IsInt()
  @Min(1)
  metrosCuadrados: number;

  @IsUUID()
  tipoInmuebleId: string;
}
