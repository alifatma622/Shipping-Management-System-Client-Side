import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Signal } from '@angular/core';

export interface GeneralSettings {
  id: number;
  defaultWeight: number;
  extraPriceKg: number;
  extraPriceVillage: number;
  fast: number;
  express: number;
  modifiedAt: string;
  employee: string;
}



@Injectable({
  providedIn: 'root'
})
export class GeneralSettingsServiceTsService {
  private apiUrl = 'https://localhost:7294/api/GeneralSettings';
  constructor(private http: HttpClient){}
  getSettings(): Observable<GeneralSettings> {
    return this.http.get<GeneralSettings>(this.apiUrl);
  }
  updateSettings(data: Omit<GeneralSettings, 'employee' | 'modifiedAt'>): Observable<any> {
    return this.http.put(this.apiUrl, {
      ...data,
      employeeId: 1
    });
  }


}
