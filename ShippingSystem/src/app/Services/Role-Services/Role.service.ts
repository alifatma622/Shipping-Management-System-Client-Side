import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
private apiUrl = `${environment.baseUrl}/api/Role`;

constructor() { }


}
