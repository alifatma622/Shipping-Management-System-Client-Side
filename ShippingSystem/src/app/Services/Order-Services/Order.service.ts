import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AddOrderDTO, OrderResponse, ReadOrderDTO , ReadOneOrderDTO , UpdateOrderDTO , UpdateProductDTO } from '../../Models/IOrder';
import { delay, Observable, of } from 'rxjs';
import { ShippingType } from '../../Enum/ShippingType';
import { PaymentType } from '../../Enum/PaymentType';
import { OrderStatus } from '../../Enum/OrderStatus';
import { map, tap } from 'rxjs/operators';
import { AddOrder } from '../../Models/orders_models/add-order';
import { OrderType } from '../../Enum/OrderType';

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

  getPaginatedOrders(pageNumber: number, pageSize: number, status?: string): Observable<OrderResponse> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (status && status !== '') {
      params = params.set('status', status);
    }

    return this.http.get<OrderResponse>(`${this.apiUrl}/paginated`, { params });
  }

  createOrder(order: AddOrderDTO): Observable<ReadOrderDTO> {
    return this.http.post<ReadOrderDTO>(`${this.apiUrl}`, order);
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

  addOrder(order:AddOrder): Observable<any> {
    return this.http.post(`${this.apiUrl}`, order);
  }

  getOrderById(orderId: number): Observable<ReadOneOrderDTO> {
    return this.http.get<ReadOneOrderDTO>(`${this.apiUrl}/${orderId}`);
  }

  getOrderStatuses(): Observable<OrderStatus[]> {
    return of(Object.values(OrderStatus).filter(value => typeof value === 'number') as OrderStatus[]).pipe(delay(1000));
  }

  getShippingTypes(): Observable<ShippingType[]> {
    return of(Object.values(ShippingType).filter(value => typeof value === 'number') as ShippingType[]).pipe(delay(1000));
  }

  getPaymentTypes(): Observable<PaymentType[]> {
    return of(Object.values(PaymentType).filter(value => typeof value === 'number') as PaymentType[]).pipe(delay(1000));
  }

  getOrderTypes(): Observable<OrderType[]> {
    return of(Object.values(OrderType).filter(value => typeof value === 'number') as OrderType[]).pipe(delay(1000));
  }

  updateOrder(order : UpdateOrderDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${order.id}`, order);
  }
}