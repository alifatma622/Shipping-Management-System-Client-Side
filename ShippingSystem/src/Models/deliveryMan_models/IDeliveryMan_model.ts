// ReadDeliveryMan
export interface IReadDeliveryMan {
  id: number;
  fullName?: string;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  branchName?: string;
  branchId?: number;
  cities?: string;
  cityIds?: number[];
  activeOrdersCount?: number;
   isDeleted?: boolean;
}

// AddDeliveryMan
export interface IAddDeliveryMan {
  name: string;
  email: string;
  userName: string;
  password: string;
  phoneNumber: string;
  branchId: number;
  cityIds: number[];
}

// UpdateDeliveryMan
export interface IUpdateDeliveryMan {
  name: string;
  email: string;
  userName: string;
  phoneNumber: string;
  branchId: number;
  cityIds: number[];
}
