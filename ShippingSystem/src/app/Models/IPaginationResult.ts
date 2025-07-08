

// pagination result interface for use in various models
// This interface is used to represent the result of a paginated query.

export interface PaginationResult<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: T[];
}

