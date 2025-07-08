export interface Governrate {
  id: number;
  name: string;
  isDeleted: boolean;
}

export interface AddGovernrate{
  name: string;
}

export interface GovernrateResponse {
  pageNumber: number;
  totalCount: number;
  pageSize: number;
  totalPages: number;
  items: Governrate[];
}