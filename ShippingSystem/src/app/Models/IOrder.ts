import { OrderType } from "../Enum/OrderType";
import { ShippingType } from "../Enum/ShippingType";
import { PaymentType } from "../Enum/PaymentType"

export interface ReadOrderDTO {
  orderID: number;
  notes?: string;
  customerName: string;
  customerPhone: string;
  customerCityName?: string;
  sellerName?: string;
  sellerCityName?: string;
  deliveryAgentName?: string;
  branchName?: string;
  isShippedToVillage: boolean;
  address: string;
  creationDate: Date;
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
  products: AddProductDTO[];
}

export interface AddProductDTO {
  name: string;
  price: number;
  weight: number;
  quantity: number;
}