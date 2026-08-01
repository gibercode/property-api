import { IsEnum } from 'class-validator';
import { InmuebleEstado } from '../enums';

export class UpdateInmuebleEstadoDto {
  @IsEnum(InmuebleEstado)
  estado: InmuebleEstado;
}
