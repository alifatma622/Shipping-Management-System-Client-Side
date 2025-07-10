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


  private apiUrl = `${environment.baseUrl}/api/Auth`;

  register(data: RegisterModel): Observable<any> {

    return this._httpClient.post(`${this.apiUrl}/register`, data);
  }

  login(data: LoginModel): Observable<any> {
  console.log('Sending request to login:', data);
  return this._httpClient.post(`${this.apiUrl}`, data);
}

logout() {
  localStorage.removeItem('token');
}

getToken(): string | null {
  return localStorage.getItem('token');
}

getRole(): string[] {
  const token = this.getToken();
  if (!token) return [];

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Decoded payload:", payload);

    const roles = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (!roles) return [];

    // تأكد من أن النتيجة مصفوفة حتى لو كان عنصر واحد فقط
    return Array.isArray(roles) ? roles : [roles];
  } catch (e) {
    console.error("Token decode error:", e);
    return [];
  }
}




hasRole(role: string): boolean {
  return this.getRole().includes(role);
}

hasAnyRole(roles: string[]): boolean {
  const userRoles = this.getRole();
  return roles.some(role => userRoles.includes(role));
}




}
