import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddOrder } from '../../Models/orders_models/add-order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  private apiUrl = 'https://localhost:7294/api/Order';

  constructor(private httpclient  :HttpClient) { }

  addOrder(order: AddOrder): Observable<any> {
    return this.httpclient.post(`${this.apiUrl}`, order);
  }



/* calculateShippingCost(order: AddOrder): Observable<number> {
    return this.httpclient.post<number>(`${this.apiUrl}/CalculateShippingCost`, order);
  }*/

}
