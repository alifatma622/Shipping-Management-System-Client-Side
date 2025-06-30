import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AllBranch } from '../Models/Branch/all-branch';
import { AddBranch } from '../Models/Branch/add-branch';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(private _httpClient: HttpClient) {}

  getAllBranch() {
    return this._httpClient.get<AllBranch[]>(`${environment.baseUrl}/endpoint`);
  }

  getBranchById(id: number) {
    return this._httpClient.get<AllBranch>(`${environment.baseUrl}/${id}`);
  }

  addNewBranch(newBranch: AddBranch) {
    return this._httpClient.post(`${environment.baseUrl}/endpoint`, newBranch);
  }

  updateBranch(id: number, branch: AddBranch) {
    return this._httpClient.put(`${environment.baseUrl}/${id}`, branch);
  }

  deleteBranch(id: number) {
    return this._httpClient.delete(`${environment.baseUrl}/${id}/softDelete`);
  }
}
