export interface Employee {
     Id: number;
     BranchId: number;
     UserId: number;
     firstName: string;
     lastName: string;
     email: string;
     phoneNumber: string;
     address: string ;
     specificRole: string;
     password: string;
     
}
export interface AddEmployeeDTO {
  branchId?: number | null;
  userName: string;
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  specificRole: string;
  isDeleted?: boolean;
}

export interface ReadEmployeeDTO {
  id: number;
  branchId:number;
  branch?: string | null;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  password?:string;
  phoneNumber: string;
  createdAt: Date;
  specificRole: string;
  isDeleted: boolean;
}

export interface EmployeeResponse {
  pageNumber: number;
  totalCount: number;
  pageSize: number;
  totalPages: number;
  items: ReadEmployeeDTO[];
}