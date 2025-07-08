import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface ICity {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CityService {
  private apiUrl = `${environment.baseUrl}/api/City/all`;

  constructor(private http: HttpClient) {}

  getAllCities(): Observable<ICity[]> {
    return this.http.get<ICity[]>(this.apiUrl);
  }
}
