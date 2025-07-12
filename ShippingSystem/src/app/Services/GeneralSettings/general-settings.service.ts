import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';

export interface GeneralSetting {
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
  private apiUrl = `${environment.baseUrl}/api/GeneralSettings`;
  constructor(private http: HttpClient){}
  getSettings(): Observable<GeneralSetting> {
    return this.http.get<GeneralSetting>(this.apiUrl);
  }

  updateSettings(data: Omit<GeneralSetting, 'employee' | 'modifiedAt'>): Observable<any> {
    return this.http.put(this.apiUrl, {
      ...data,
      employeeId: 2
    });
  }


}
