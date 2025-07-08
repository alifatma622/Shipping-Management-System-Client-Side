import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AddOrderDTO, OrderResponse, ReadOrderDTO } from '../../Models/IOrder';
import { delay, Observable, of } from 'rxjs';
import { ShippingType } from '../../Enum/ShippingType';
import { PaymentType } from '../../Enum/PaymentType';
import { OrderStatus } from '../../Enum/OrderStatus';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
private apiUrl = `${environment.baseUrl}/api/Order`;
orderResponse: OrderResponse | undefined;

constructor(private http: HttpClient) { }
 getOrders(): Observable<ReadOrderDTO[]> {
  return this.http.get<OrderResponse>(this.apiUrl).pipe(
    tap((response: OrderResponse) => this.orderResponse = response),
    map((response: OrderResponse) => response.items)
   );
  }
 getPaginatedOrders(pageNumber: number, pageSize: number): Observable<OrderResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<OrderResponse>(`${this.apiUrl}`, { params });
  }
  createOrder(order: AddOrderDTO): Observable<ReadOrderDTO> {
    return this.http.post<ReadOrderDTO>(this.apiUrl, order);
  }

  calculateShippingCost(order: AddOrderDTO): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/calculate-shipping`, order);
  }

  
 assignDeliveryAgent(orderId: number, deliveryAgentId: number): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/assignDeliveryAgent`, 
    null, 
    {
      params: {
        orderId: orderId.toString(),
        deliveryAgentId: deliveryAgentId.toString()
      },
      responseType: 'text' 
    }
  );
  }

 changeOrderStatus(orderId: number, newStatus: OrderStatus): Observable<any> {
  return this.http.put(`${this.apiUrl}/changeStatus/${orderId}`,  {newStatus} );
}


}

