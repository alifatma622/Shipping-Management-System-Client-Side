import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AddOrderDTO, ReadOrderDTO } from '../../Models/IOrder';
import { delay, Observable, of } from 'rxjs';
import { ShippingType } from '../../Enum/ShippingType';
import { PaymentType } from '../../Enum/PaymentType';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
private apiUrl = `${environment.baseUrl}/api/Order`;
private fakeOrders: ReadOrderDTO[] = [
    {
      orderID: 1001,
      notes: 'Handle with care',
      customerName: 'Ahmed Mohamed',
      customerPhone: '01012345678',
      customerCityName: 'Cairo',
      sellerName: 'ElectroShop',
      sellerCityName: 'Giza',
      deliveryAgentName: 'Mohamed Ali',
      branchName: 'Nasr City',
      isShippedToVillage: false,
      address: '123 Nile St, Apt 45',
      creationDate: new Date('2023-05-15'),
      status: 'Pending',
      shippingType: ShippingType.Standard.toString(),
      orderType: 'Electronics',
      paymentType: PaymentType.CashOnDelivery.toString(),
      isPickup: false,
      isActive: true,
      isDeleted: false,
      shippingCost: 50,
      totalCost: 1250,
      totalWeight: 3.5
    },
    {
      orderID: 1002,
      customerName: 'Fatima Mahmoud',
      customerPhone: '01123456789',
      customerCityName: 'Alexandria',
      sellerName: 'FashionHub',
      sellerCityName: 'Cairo',
      deliveryAgentName: 'Hassan Ibrahim',
      branchName: 'Downtown',
      isShippedToVillage: true,
      address: '456 Corniche Rd',
      creationDate: new Date('2023-05-16'),
      status: 'PartiallyDelivered',
      shippingType: ShippingType.Fast.toString(),
      orderType: 'Clothing',
      paymentType: PaymentType.CashOnDelivery.toString(),
      isPickup: true,
      isActive: true,
      isDeleted: false,
      shippingCost: 75,
      totalCost: 890,
      totalWeight: 2.1
    },
    {
      orderID: 1003,
      notes: 'Gift wrapping required',
      customerName: 'Youssef Ahmed',
      customerPhone: '01234567890',
      customerCityName: 'Luxor',
      sellerName: 'BookWorld',
      sellerCityName: 'Aswan',
      deliveryAgentName: 'Khaled Samir',
      branchName: 'West Bank',
      isShippedToVillage: true,
      address: '789 Pharaoh Ave',
      creationDate: new Date('2023-05-17'),
      status: 'Delivered',
      shippingType: ShippingType.Express24h.toString(),
      orderType: 'Books',
      paymentType: PaymentType.CashOnDelivery.toString(),
      isPickup: false,
      isActive: true,
      isDeleted: false,
      shippingCost: 120,
      totalCost: 450,
      totalWeight: 1.8
    }
  ];

constructor(private http: HttpClient) { }
//  getOrders(): Observable<ReadOrderDTO[]> {
//     return this.http.get<ReadOrderDTO[]>(this.apiUrl);
//   }
 getOrders(): Observable<ReadOrderDTO[]> {
    // Simulate API delay
    return of(this.fakeOrders).pipe(delay(500));
  }
  createOrder(order: AddOrderDTO): Observable<ReadOrderDTO> {
    return this.http.post<ReadOrderDTO>(this.apiUrl, order);
  }

  calculateShippingCost(order: AddOrderDTO): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/calculate-shipping`, order);
  }
}
