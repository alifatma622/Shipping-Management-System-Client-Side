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
  constructor(private _httpClient: HttpClient) {}

  getAllCities() {
    return this._httpClient.get<CityModel[]>(`${environment.baseUrl}/api/City`);
  }

  getCityById(id: number) {
    return this._httpClient.get<CityModel>(
      `${environment.baseUrl}/api/City/${id}`
    );
  }

  addCity(city: CreateCityModel) {
    return this._httpClient.post(`${environment.baseUrl}/api/City`, city);
  }

  updateCity(id: number, city: UpdateCity) {
    return this._httpClient.put(`${environment.baseUrl}/api/City/${id}`, city);
  }

  deleteCity(id: number) {
    return this._httpClient.delete(`${environment.baseUrl}/api/City/${id}`);
  }
}
