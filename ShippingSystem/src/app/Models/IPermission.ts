import { Department } from "../Enum/Department";

export interface IPermission {
  roleName: string;
  department: number;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  [key: string]: any;
  departmentName?: string;
}


export interface PermissionDTO {
  RoleName: string
  Department: Department;
  DepartmentName: string;
  View: boolean
  Add: boolean;
  Edit: boolean;
  Delete: boolean;
}

export interface IPermission extends PermissionDTO {
  // Add any additional frontend-specific properties here
  departmentName?: string;
}