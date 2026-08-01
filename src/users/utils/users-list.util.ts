import { USER_ORDER_DIRECTIONS, USER_ORDER_FIELDS } from '../constants';
import { OrderDirection, UserOrderField } from '../interfaces';

export const normalizeUserOrderBy = (orderBy: string): UserOrderField => ({
  value: USER_ORDER_FIELDS.includes(orderBy) ? orderBy : 'nombre',
});

export const normalizeUserOrder = (order: string): OrderDirection => {
  const normalizedOrder = order.toUpperCase();

  return {
    value: USER_ORDER_DIRECTIONS.includes(normalizedOrder)
      ? normalizedOrder
      : 'ASC',
  };
};
