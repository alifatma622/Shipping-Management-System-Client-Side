import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDeliveryManDTO } from '../../Models/DeliveryMan/IDeliveryManDTO';

@Injectable({
  providedIn: 'root'
})
export class DeliveryManService {
  private apiUrl = 'https://localhost:7294/api/DeliveryMan';

  constructor(private http: HttpClient) {}

  getAllDeliveryMen(): Observable<IDeliveryManDTO[]> {
    return this.http.get<IDeliveryManDTO[]>(this.apiUrl);
  }
}
