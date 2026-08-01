import { InmuebleEstado } from '../enums';

export const INMUEBLE_ORDER_FIELDS = ['precio', 'createdAt'];
export const INMUEBLE_ORDER_DIRECTIONS = ['ASC', 'DESC'];

export const INMUEBLE_ESTADO_TRANSITIONS: Record<
  InmuebleEstado,
  InmuebleEstado[]
> = {
  [InmuebleEstado.DISPONIBLE]: [InmuebleEstado.RESERVADO],
  [InmuebleEstado.RESERVADO]: [
    InmuebleEstado.DISPONIBLE,
    InmuebleEstado.VENDIDO,
  ],
  [InmuebleEstado.VENDIDO]: [],
};
