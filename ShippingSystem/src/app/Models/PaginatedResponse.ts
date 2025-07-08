export interface PaginatedResponse<T> {
  pageNumber: number;
  totalCount: number;
  pageSize: number;
  totalPages: number;
  items: T[];
}
