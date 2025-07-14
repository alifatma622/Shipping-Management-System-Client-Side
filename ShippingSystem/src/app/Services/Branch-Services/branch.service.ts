import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AllBranch } from '../../Models/Branch/all-branch';
import { AddBranch } from '../../Models/Branch/add-branch';
import { Observable } from 'rxjs';

export interface IBranch {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(private _httpClient: HttpClient) {}

  private apiUrl = `${environment.baseUrl}/api/Branch`;
  getAllBranches(): Observable<IBranch[]> {
    return this._httpClient.get<IBranch[]>(this.apiUrl);
  }


  getAllBranch() {
    return this._httpClient.get<AllBranch[]>(this.apiUrl);
  }

  getAllBranchesPagination(pageNumber: number = 1, pageSize: number = 10) {
      return this._httpClient.get<{ items: AllBranch[], totalCount: number }>(
        `${this.apiUrl}/paginated`,
        { params: { pageNumber, pageSize } }
      );

    }





  getBranchById(id: number) {
    return this._httpClient.get<AllBranch>(`${this.apiUrl}/${id}`);
  }

  addNewBranch(newBranch: AddBranch) {
    return this._httpClient.post(this.apiUrl, newBranch);
  }

  updateBranch(id: number, branch: AddBranch) {
    return this._httpClient.put(`${this.apiUrl}/${id}`, branch);
  }

  deleteBranch(id: number) {
    return this._httpClient.delete(`${this.apiUrl}/Soft/${id}`);
  }

  hardDeleteBranch(id: number) {
    return this._httpClient.delete(`${this.apiUrl}/Hard/${id}`);
  }
}
