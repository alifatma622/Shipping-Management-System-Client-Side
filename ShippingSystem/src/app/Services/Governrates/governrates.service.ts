import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { PaginatedResponse } from '../../Models/PaginatedResponse';

export interface Governrate {
  id: number;
  name: string;
  isDeleted: boolean;
}

export interface AddGovernrate{
  name: string;
}


@Injectable({
  providedIn: 'root'
})
export class GovernratesService {
  private apiUrl = `${environment.baseUrl}/api/Governorate`;
  constructor(private http:HttpClient) { }

  getAllGovernrates(pageNumber : number = 1 , pageSize : number = 10): Observable<PaginatedResponse<Governrate>> {
    const params = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };
    return this.http.get<PaginatedResponse<Governrate>>(this.apiUrl, { params });
  }
  getGovernrateById(id: number): Observable<Governrate> {
    return this.http.get<Governrate>(`${this.apiUrl}/${id}`);
  }
  addGovernrate(governrate: AddGovernrate): Observable<Governrate> {
    return this.http.post<Governrate>(this.apiUrl, governrate);
  }
  updateGovernrate(id: number, governrate: AddGovernrate): Observable<Governrate> {
    return this.http.put<Governrate>(`${this.apiUrl}/${id}`, governrate);
  }
  deleteGovernrate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}
