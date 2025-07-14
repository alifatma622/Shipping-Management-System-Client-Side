export interface IRole {
    name: string;
}

export interface RoleResponse {
  pageNumber: number;
  totalCount: number;
  pageSize: number;
  totalPages: number;
  items:string[];
}
