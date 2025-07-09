import { AddProduct } from "./add-product";


export interface AddOrder {
  notes?: string;
  customerName: string;
  customerPhone: string;
  isShippedToVillage: boolean;
  address: string;
  creationDate: string;
  shippingType: number;
  orderType: number;
  paymentType: number;
  isPickup: boolean;
  cityId: number;
  sellerId: number;
  branchId: number;
  products: AddProduct[];
}
