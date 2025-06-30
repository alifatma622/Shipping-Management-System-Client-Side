import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Signal } from '@angular/core';

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
  private apiUrl = 'https://localhost:7294/api/Governorate';
  constructor(private http:HttpClient) { }
  getAllGovernrates(): Observable<Governrate[]> {
    return this.http.get<Governrate[]>(this.apiUrl);
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
