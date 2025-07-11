import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISellerModels } from '../../Models/seller_models/iseller-models';
import { IAddSeller } from '../../Models/seller_models/IAddseller-models';
import { IUpdateseller } from '../../Models/seller_models/IUpdateseller-models';
import { ICity } from '../city.service';
import { PaginationResult } from '../../Models/IPaginationResult';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SellerServiceService {
  private apiUrl = `${environment.baseUrl}/api/Seller`;
  constructor(private http: HttpClient) { }

  getAllSellers(pageNumber: number, pageSize: number): Observable<PaginationResult<ISellerModels>> {
  return this.http.get<PaginationResult<ISellerModels>>(
     `${this.apiUrl}/paginated?PageNumber=${pageNumber}&PageSize=${pageSize}`
    // `${this.apiUrl}/paginated/?PageNumber=${pageNumber}&PageSize=${pageSize}`
  );
}



getAllSellersSelect(): Observable<ISellerModels[]> {
  return this.http.get<ISellerModels[]>(
    `${this.apiUrl}`
  );
}

  addSeller(seller: IAddSeller): Observable<any> {
    return this.http.post(`${this.apiUrl}`, seller);
  }

  updateSeller(id: number, seller: IUpdateseller): Observable<any> {
    return this.http.put(`${this.apiUrl}/Update`, seller, { responseType: 'text' });
  }

  deleteSeller(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/SoftDelete/${id}`);
  }

  getSellerById(id: number): Observable<ISellerModels> {
    return this.http.get<ISellerModels>(`${this.apiUrl}/${id}`);
  }

}