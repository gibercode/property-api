export interface UserOrderField {
  value: string;
}

export interface OrderDirection {
  value: string;
}

export interface UsersListFilters {
  search: string;
  orderBy: UserOrderField;
  order: OrderDirection;
}
