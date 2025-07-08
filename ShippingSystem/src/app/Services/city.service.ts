import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ICity {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CityService {
  private apiUrl = 'https://localhost:7294/api/City/all';

  constructor(private http: HttpClient) {}

  getAllCities(): Observable<ICity[]> {
    return this.http.get<ICity[]>(this.apiUrl);
  }
}
