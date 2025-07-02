import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterModel } from '../../Models/Auht-Models/register-model';
import { Observable } from 'rxjs';
import { LoginModel } from '../../Models/Auht-Models/login-model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  constructor(private _httpClient: HttpClient) {}

  register(data: RegisterModel): Observable<any> {
    return this._httpClient.post(`${environment.baseUrl}/endPoint`, data);
  }

  login(data: LoginModel): Observable<any> {
    return this._httpClient.post(`${environment.baseUrl}/endPoint`, data);
  }
}
