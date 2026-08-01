import { INMUEBLE_ORDER_DIRECTIONS, INMUEBLE_ORDER_FIELDS } from '../constants';
import { Inmueble } from '@entities/inmueble.entity';
import { SelectQueryBuilder } from 'typeorm';
import { InmuebleEstado } from '../enums';
import {
  InmuebleOrderDirection,
  InmuebleOrderField,
  InmueblesListFilters,
  InmuebleWhereCondition,
} from '../interfaces';

export const normalizeInmuebleOrderBy = (
  orderBy: string,
): InmuebleOrderField => ({
  value: INMUEBLE_ORDER_FIELDS.includes(orderBy) ? orderBy : 'createdAt',
});

export const normalizeInmuebleOrder = (
  order: string,
): InmuebleOrderDirection => {
  const normalizedOrder = order.toUpperCase();

  return {
    value: INMUEBLE_ORDER_DIRECTIONS.includes(normalizedOrder)
      ? normalizedOrder
      : 'DESC',
  };
};

export const normalizeBoolean = (value: string): boolean =>
  value.toLowerCase() === 'true';

export const normalizeNumber = (value: string): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isNaN(parsedValue) ? undefined : parsedValue;
};

export const normalizeInmuebleEstado = (
  estado: string,
): InmuebleEstado | undefined => {
  const normalizedEstado = estado.toUpperCase();
  const estados = Object.values(InmuebleEstado);

  return estados.includes(normalizedEstado as InmuebleEstado)
    ? (normalizedEstado as InmuebleEstado)
    : undefined;
};

export const buildInmuebleWhereConditions = (
  filters: InmueblesListFilters,
  userId: string,
): InmuebleWhereCondition[] => [
  {
    apply: true,
    condition: 'inmueble.deletedAt IS NULL',
    parameters: {},
  },
  {
    apply: Boolean(filters.estado),
    condition: 'inmueble.estado = :estado',
    parameters: { estado: filters.estado },
  },
  {
    apply: Boolean(filters.tipoInmuebleId),
    condition: 'inmueble.tipoInmuebleId = :tipoInmuebleId',
    parameters: { tipoInmuebleId: filters.tipoInmuebleId },
  },
  {
    apply: filters.precioMin !== undefined,
    condition: 'inmueble.precio >= :precioMin',
    parameters: { precioMin: filters.precioMin },
  },
  {
    apply: filters.precioMax !== undefined,
    condition: 'inmueble.precio <= :precioMax',
    parameters: { precioMax: filters.precioMax },
  },
  {
    apply: Boolean(filters.search),
    condition: 'inmueble.direccion ILIKE :search',
    parameters: { search: `%${filters.search}%` },
  },
  {
    apply: filters.soloMios,
    condition: 'inmueble.vendedorId = :userId',
    parameters: { userId },
  },
];

export const applyInmuebleWhereConditions = (
  queryBuilder: SelectQueryBuilder<Inmueble>,
  conditions: InmuebleWhereCondition[],
) => {
  conditions
    .filter((condition) => condition.apply)
    .forEach((condition) => {
      queryBuilder.andWhere(condition.condition, condition.parameters);
    });
};
