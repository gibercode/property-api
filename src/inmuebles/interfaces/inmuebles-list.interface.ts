import { InmuebleEstado } from '../enums';

export interface InmuebleOrderField {
  value: string;
}

export interface InmuebleOrderDirection {
  value: string;
}

export interface InmueblesListFilters {
  estado?: InmuebleEstado;
  tipoInmuebleId?: string;
  precioMin?: number;
  precioMax?: number;
  search?: string;
  soloMios: boolean;
  orderBy: InmuebleOrderField;
  order: InmuebleOrderDirection;
}

export interface FindAllInmueblesQuery {
  page: number;
  limit: number;
  estado: string;
  tipoInmuebleId: string;
  precioMin: string;
  precioMax: string;
  search: string;
  soloMios: string;
  orderBy: string;
  order: string;
}

export interface InmuebleWhereCondition {
  apply: boolean;
  condition: string;
  parameters: Record<string, string | number>;
}
