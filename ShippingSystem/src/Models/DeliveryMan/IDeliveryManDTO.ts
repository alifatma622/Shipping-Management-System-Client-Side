export interface IDeliveryManDTO {
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
}
