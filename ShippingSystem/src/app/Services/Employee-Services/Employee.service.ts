import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddEmployeeDTO, EmployeeResponse, ReadEmployeeDTO } from '../../Models/IEmployee';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

private apiUrl = `${environment.baseUrl}/api/Employee`;
constructor(private http:HttpClient) { }
 // Get all employees
  getAllEmployees(): Observable<ReadEmployeeDTO[]> {
    return this.http.get<ReadEmployeeDTO[]>(this.apiUrl);
  }
getPaginatedEmployees(pageNumber: number, pageSize: number): Observable<EmployeeResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<EmployeeResponse>(`${this.apiUrl}/paginated`, { params });
  }
  // Get employee by ID
  getEmployeeById(id: number): Observable<ReadEmployeeDTO> {
    return this.http.get<ReadEmployeeDTO>(`${this.apiUrl}/${id}`);
  }

  // Add new employee
  addEmployee(employee: AddEmployeeDTO): Observable<void> {

    employee.specificRole ='Admin';
    return this.http.post<void>(this.apiUrl, employee);
  }

  // Update employee
  updateEmployee(id: number, employee: AddEmployeeDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, employee);
  }

  // Soft delete employee
  softDeleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/SoftDelete/${id}`);
  }

  // Hard delete employee
  hardDeleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/HardDelete/${id}`);
  }
}
