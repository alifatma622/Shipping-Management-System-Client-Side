import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CityModel } from '../../Models/CityModels/city-model';
import { environment } from '../../../environments/environment.development';
import { CreateCityModel } from '../../Models/CityModels/create-city-model';
import { UpdateCity } from '../../Models/CityModels/update-city';

@Injectable({
  providedIn: 'root',
})
export class CityServiceService {
  private apiUrl = `${environment.baseUrl}/api/City`;


  constructor(private _httpClient: HttpClient) {}

  getAllCities(pageNumber: number = 1, pageSize: number = 10) {
    return this._httpClient.get<{ items: CityModel[], totalCount: number }>(
      `${this.apiUrl}/paginated`,
      { params: { pageNumber, pageSize } }
    );

  }

  getCityById(id: number) {
    return this._httpClient.get<CityModel>(`${this.apiUrl}/${id}`);
  }

  addCity(city: CreateCityModel) {
    return this._httpClient.post(`${this.apiUrl}`, city);
  }

  updateCity(id: number, city: UpdateCity) {
    return this._httpClient.put(`${this.apiUrl}/${id}`, city);
  }

  softdeleteCity(id: number) {
    return this._httpClient.delete(`${this.apiUrl}/Soft/${id}`);
  }

  deleteCity(id: number) {
    return this._httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
