import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReadDeliveryMan, IAddDeliveryMan, IUpdateDeliveryMan, IDeliveryResponse } from '../Models/IDeliveryMan_model';
import { OrderResponse } from '../Models/IOrder';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DeliveryManService {
  private apiUrl = `${environment.baseUrl}/api/DeliveryMan`;
  private orderApiUrl = `${environment.baseUrl}/api/Order`; //
  id:number=0;
  constructor(private http: HttpClient) { }

  //getAllDeliveryMen
  getAllDeliveryMen(): Observable<IReadDeliveryMan[]> {
    return this.http.get<IReadDeliveryMan[]>(this.apiUrl);
  }

  // get delivery man by id
  getById(id: number): Observable<IReadDeliveryMan> {
    return this.http.get<IReadDeliveryMan>(`${this.apiUrl}/${id}`);
  }

  // add new delivery man
  add(data: IAddDeliveryMan): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);

  }

  // update delivery man
  update(id: number, data: IUpdateDeliveryMan): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);

  }

  // soft delete
  softDelete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/SoftDelete/${id}`);
  }

  // hard delete
  hardDelete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/HardDelete/${id}`);
  }

  getAllPaginated(pageNumber: number, pageSize: number): Observable<IDeliveryResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<IDeliveryResponse>(`${this.apiUrl}/paginated`, { params });
  }

  getId(userId: string | null): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/getId/${userId}`);
  }

  //
  getOrdersByDeliveryAgent(deliveryAgentId: number, pageNumber: number, pageSize: number, status?: string): Observable<OrderResponse> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (status && status !== '') {
      params = params.set('status', status);
    }

    return this.http.get<OrderResponse>(`${this.orderApiUrl}/GetOrdersByDeliveryAgent/${deliveryAgentId}`, { params });
  }
}
