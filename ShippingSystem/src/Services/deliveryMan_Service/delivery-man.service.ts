import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReadDeliveryMan, IAddDeliveryMan, IUpdateDeliveryMan } from '../../Models/deliveryMan_models/IDeliveryMan_model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryManService {
  private apiUrl = 'https://localhost:7294/api/DeliveryMan';

  constructor(private http: HttpClient) {}

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
    return this.http.post<any>(this.apiUrl, data); //returns { message } not object

  }

  // update delivery man
  update(id: number, data: IUpdateDeliveryMan): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    // الـ API بيرجع { message }
  }

  // soft delete
  softDelete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/soft`);
  }

  // hard delete
  hardDelete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/hard`);
  }
}
