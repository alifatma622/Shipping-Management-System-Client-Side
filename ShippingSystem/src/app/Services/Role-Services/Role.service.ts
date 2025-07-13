import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IRole, RoleResponse } from '../../Models/IRole';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = `${environment.baseUrl}/api/Role`;

  constructor(private http: HttpClient) { }

  // Get all employees
  getAllRoles(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
  getRolesPaginated(pageNumber: number, pageSize: number): Observable<RoleResponse> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<RoleResponse>(`${this.apiUrl}/paginated`, { params });
  }
  // Get employee by ID
  getRoleById(id: number): Observable<IRole> {
    return this.http.get<IRole>(`${this.apiUrl}/${id}`);
  }

  // Add new employee
  addRole(roleName: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${roleName}`, null);
  }

  // Update employee
  updateRole(oldRoleName: string, newRoleName: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${oldRoleName}/${newRoleName}`, null);
  }


  // // Soft delete employee
  // softDeleteEmployee(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/SoftDelete/${id}`);
  // }

  // Hard delete employee
  hardDeleteRole(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
