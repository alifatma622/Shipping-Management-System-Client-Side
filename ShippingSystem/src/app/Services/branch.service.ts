// branch.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface IBranch {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class BranchService {
  private apiUrl = `${environment.baseUrl}/api/Branch`;

  constructor(private http: HttpClient) {}

  getAllBranches(): Observable<IBranch[]> {
    return this.http.get<IBranch[]>(this.apiUrl);
  }
}
