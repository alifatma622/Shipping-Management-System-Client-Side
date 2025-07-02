import { AllGovernorate } from '../../../Models/GovernorateModels/all-governorate';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateCityModel } from '../../../Models/CityModels/create-city-model';
import { CityServiceService } from '../../../Services/City_Services/city-service.service';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-city',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-city.component.html',
  styleUrl: './add-city.component.css',
})
export class AddCityComponent {
  newCity: CreateCityModel = {
    name: '',
    normalPrice: 0,
    pickupPrice: 0,
    governorateId: 0,
  };

  governorates: AllGovernorate[] = [];

  serverError: string = '';

  constructor(
    private _cityService: CityServiceService // private _governorateService: GovernorateService
  ) {}

  ngOnInit(): void {
    // لما API يشتغل
    // this._governorateService.getAllGovernorate().subscribe({
    //   next: (data) => {
    //     this.governorates = data;
    //   },
    //   error: (err) => {
    //     console.error('Failed to load governorates', err);
    //   },
    // });

    this.governorates = [
      { id: 1, name: 'Cairo', isActive: true },
      { id: 2, name: 'Alexandria', isActive: false },
      { id: 3, name: 'Giza', isActive: true },
    ];
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
