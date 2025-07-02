import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IRole } from '../../Models/IRole';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
private apiUrl = `${environment.baseUrl}/api/Role`;

constructor(private http:HttpClient) { }

// Get all employees
  getAllRoles(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }

  // Get employee by ID
  getRoleById(id: number): Observable<IRole> {
    return this.http.get<IRole>(`${this.apiUrl}/${id}`);
  }

  // Add new employee
  addRole(role: IRole): Observable<void> {
    return this.http.post<void>(this.apiUrl, role);
  }

  // Update employee
  updateRole(id: string, role: IRole): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, role);
  }

  // // Soft delete employee
  // softDeleteEmployee(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/SoftDelete/${id}`);
  // }

  // Hard delete employee
  hardDeleteRole(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/HardDelete/${id}`);
  }
}
