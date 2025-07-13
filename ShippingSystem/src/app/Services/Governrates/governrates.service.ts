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
  private baseUrl = `${environment.baseUrl}/api/Governorate`;

  constructor(private http: HttpClient) { }

  getAllGovernrates(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Governrate>> {
    const params = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };
    return this.http.get<PaginatedResponse<Governrate>>(`${this.baseUrl}/paginated`, { params });
  }

  getGovernrateById(id: number): Observable<Governrate> {
    return this.http.get<Governrate>(`${this.baseUrl}/${id}`);
  }

  addGovernrate(governrate: AddGovernrate): Observable<any> {
    return this.http.post(`${this.baseUrl}`, governrate);
  }

  updateGovernrate(id: number, governrate: AddGovernrate): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, governrate);
  }

  deleteGovernrate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/SoftDelete/${id}`);
  }


  activateGovernorate(id: number): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/Activate/${id}`, null);
}

}



