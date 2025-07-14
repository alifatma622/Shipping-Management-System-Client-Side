import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { IPermission, PermissionDTO } from '../../Models/IPermission';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private apiUrl = `${environment.baseUrl}/api/Permission`;
constructor(private http: HttpClient) { }

// Get single permission
  getRolePermission(roleName: string, department: number): Observable<IPermission> {
    return this.http.get<IPermission>(`${this.apiUrl}/${roleName}/${department}`);
  }

  // Get all permissions for role
  getAllRolePermissions(roleName: string): Observable<IPermission[]> {
    return this.http.get<IPermission[]>(`${this.apiUrl}/${roleName}`);
  }

  // Update permission
  updatePermission(permission: PermissionDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}`, permission);
  }

  // Bulk update
  bulkUpdatePermissions(permissions: PermissionDTO[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/bulk-update`, permissions);
  }
}
