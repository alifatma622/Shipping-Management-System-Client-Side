import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateCityModel } from '../../../Models/CityModels/create-city-model';
import { CityServiceService } from '../../../Services/City_Services/city-service.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { GovernratesService, Governrate } from '../../../Services/Governrates/governrates.service';

@Component({
  selector: 'app-add-city',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-city.component.html',
  styleUrl: './add-city.component.css',
})
export class AddCityComponent implements OnInit {
  newCity: CreateCityModel = {
    name: '',
    normalPrice: 0,
    pickupPrice: 0,
    governorateId: 0,
  };

  governorates: Governrate[] = [];
  serverError: string = '';

  constructor(
    private _cityService: CityServiceService,
    private _governorateService: GovernratesService
  ) {}

  ngOnInit(): void {
    this._governorateService.getAllGovernrates(1, 100).subscribe({
      next: (data) => {
        this.governorates = data.items;
      },
      error: (err) => {
        console.error('Failed to load governorates', err);
      },
    });
  }

  onSubmit(form: any) {
    if (form.valid) {
      this._cityService.addCity(this.newCity).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'City Added',
            text: '✅ City Added Successfully!',
            confirmButtonColor: '#055866',
          });
          form.resetForm();
          this.serverError = '';
        },
        error: (err) => {
          console.error('Error:', err);
          this.serverError = err.error?.message || '❌ Server error occurred.';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.serverError,
            confirmButtonColor: '#DA3E52',
          });
        },
      });
    }
  }
}