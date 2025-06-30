import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISellerModels } from '../../Models/seller_models/iseller-models';

@Injectable({
  providedIn: 'root'
})
export class SellerServiceService {
  private apiUrl = 'https://localhost:7294/api/Seller';
  constructor(private http: HttpClient) { }

  getAllSellers():Observable<ISellerModels[]>{

    return this.http.get<ISellerModels[]>(`${this.apiUrl}`);
  }


}
