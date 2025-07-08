import { OrderType } from "../Enum/OrderType";
import { ShippingType } from "../Enum/ShippingType";
import { PaymentType } from "../Enum/PaymentType"
import { OrderStatus } from "./DashboardDTO";

export interface ReadOrderDTO {
 orderID: number;
  notes: string;
  customerName: string;
  customerPhone: string;
  customerCityName: string;
  sellerName: string;
  sellerCityName: string;
  deliveryAgentName: string | null;
  branchName: string;
  isShippedToVillage: boolean;
  address: string;
  creationDate: string; // or Date if you plan to convert it
  status: number; // or enum if you have specific status values
  shippingType: string; // or enum
  orderType: string; // or enum
  paymentType: string; // or enum
  isPickup: boolean;
  isActive: boolean;
  isDeleted: boolean;
  shippingCost: number;
  totalCost: number;
  totalWeight: number;
  showStatusDropdown:boolean;
}
export interface ReadOrderDTO {
  orderID: number;
  notes: string;
  customerName: string;
  customerPhone: string;
  customerCityName: string;
  sellerName: string;
  sellerCityName: string;
  deliveryAgentName: string | null;
  branchName: string;
  isShippedToVillage: boolean;
  address: string;
  creationDate: string;
  status: string;
  shippingType: string;
  orderType: string;
  paymentType: string;
  isPickup: boolean;
  isActive: boolean;
  isDeleted: boolean;
  shippingCost: number;
  totalCost: number;
  totalWeight: number;

  /** ✅ أضف هذه الحقول **/
  cityId: number;
  sellerId: number;
  branchId: number;
  products: ProductDTO[];
}

export interface AddOrderDTO {
  notes?: string;
  customerName: string;
  customerPhone: string;
  isShippedToVillage: boolean;
  address: string;
  creationDate: Date;
  shippingType: ShippingType;
  orderType: OrderType;
  paymentType: PaymentType;
  isPickup: boolean;
  cityId: number;
  sellerId: number;
  branchId: number;
  deliveryAgentId?: number;
  products: AddProductDTO[];
}

export interface AddProductDTO {
  name: string;
  price: number;
  weight: number;
  quantity: number;
}

export interface OrderResponse {
  pageNumber: number;
  totalCount: number;
  pageSize: number;
  totalPages: number;
  items: ReadOrderDTO[];
}

export interface ProductDTO {
  name: string;
  price: number;
  weight: number;
  quantity: number;
}
