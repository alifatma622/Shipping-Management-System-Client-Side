import { Component, OnInit } from '@angular/core';
import { UpdateCity } from '../../../Models/CityModels/update-city';
import { ActivatedRoute, Router } from '@angular/router';
import { CityServiceService } from '../../../Services/City_Services/city-service.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GovernratesService, Governrate } from '../../../Services/Governrates/governrates.service';

@Component({
  selector: 'app-update-city',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-city.component.html',
  styleUrl: './update-city.component.css',
})
export class UpdateCityComponent implements OnInit {
  cityId: number = 0;
  cityData: UpdateCity = {
    id: 0,
    name: '',
    normalPrice: 0,
    pickupPrice: 0,
    governorateId: 0,
  };

  governorates: Governrate[] = [];

  constructor(
    private _route: ActivatedRoute,
    private cityService: CityServiceService,
    private _router: Router,
    private _governorateService: GovernratesService
  ) {}

  ngOnInit(): void {
    this.cityId = +this._route.snapshot.paramMap.get('id')!;
    this.getCityData(this.cityId);
    this.getGovernorates();
  }

  getGovernorates() {
    this._governorateService.getAllGovernrates(1, 100).subscribe({
      next: (data) => {
        this.governorates = data.items;
      },
      error: (err) => {
        console.error('Failed to load governorates', err);
      },
    });
  }

  getCityData(id: number) {
    this.cityService.getCityById(id).subscribe({
      next: (res) => {
        this.cityData = {
          id: res.id,
          name: res.name,
          normalPrice: res.normalPrice,
          pickupPrice: res.pickupPrice,
          governorateId: res.id,
        };
      },
      error: (err) => console.error('Error loading city:', err),
    });
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.cityService.updateCity(this.cityId, this.cityData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'City Updated',
            text: '✅ City has been updated successfully!',
            confirmButtonColor: '#055866',
          });

          form.resetForm();
          this._router.navigate(['/AllCity']);
        },
        error: (err) => {
          console.error('Error updating city:', err);
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text:
              err.error?.message ||
              '❌ An error occurred while updating the city.',
            confirmButtonColor: '#d33',
          });
        },
      });
    }
  }
}