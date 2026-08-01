export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export const normalizePagination = (page: number, limit: number) => {
  const normalizedPage = Math.max(page, 1);
  const normalizedLimit = Math.min(Math.max(limit, 1), 100);

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
  };
};

export const paginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> => ({
  data,
  meta: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  },
});
