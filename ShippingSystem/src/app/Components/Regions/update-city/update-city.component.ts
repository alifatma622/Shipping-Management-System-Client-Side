
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CityServiceService } from '../../../Services/City_Services/city-service.service';
import { GovernratesService, Governrate } from '../../../Services/Governrates/governrates.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-city',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-city.component.html',
  styleUrl: './update-city.component.css',
})
export class UpdateCityComponent implements OnInit {
  cityForm!: FormGroup;
  cityId: number = 0;
  governorates: Governrate[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private cityService: CityServiceService,
    private _router: Router,
    private _governorateService: GovernratesService
  ) {}

  ngOnInit(): void {
    this.cityId = +this._route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.getGovernorates(); // هي اللي بتنادي getCityData بعدين
  }

  initForm() {
    this.cityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      normalPrice: [0, [Validators.required, Validators.min(1)]],
      pickupPrice: [0, [Validators.required, Validators.min(1)]],
      governorateId: [null, Validators.required],
      isActive: [false] // هنضبطها لاحقًا حسب حالة isDeleted
    });
  }

  getGovernorates() {
    this._governorateService.getAllGovernrates(1, 100).subscribe({
      next: (data) => {
        this.governorates = data.items;
        this.getCityData(this.cityId); // بعد المحافظات عشان governorateId
      },
      error: (err) => console.error('Failed to load governorates', err)
    });
  }

  getCityData(id: number) {
    this.cityService.getCityById(id).subscribe({
      next: (res) => {
        const matchingGovernorate = this.governorates.find(gov => gov.name === res.governorateName);
        const governorateId = matchingGovernorate?.id || null;
        console.log("City data loaded:", res);

        if (this.cityForm) {
          this.cityForm.patchValue({
            name: res.name,
            normalPrice: res.normalPrice,
            pickupPrice: res.pickupPrice,
            governorateId: governorateId,
            isActive: !res.isDeleted // لو هي محذوفة تبقى inactive
          });
          console.log('City data loaded:', this.cityForm.value);
        }
      },
      error: (err) => console.error('Error loading city:', err)
    });
  }

  onSubmit() {
    this.isSubmitting = true;

    if (this.cityForm.invalid) {
      this.cityForm.markAllAsTouched();
      this.isSubmitting = false;
      return;
    }

    const updatedCity = {
      ...this.cityForm.value,
      id: this.cityId,
      isDeleted: !this.cityForm.value.isActive // عكس isActive
    };

    this.cityService.updateCity(this.cityId, updatedCity).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'City Updated',
          text: '✅ City has been updated successfully!',
          confirmButtonColor: '#055866',
        });
        this._router.navigate(['/dashboard/Allcity']);
      },
      error: (err) => {
        console.error('Error updating city:', err);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err.error?.message || '❌ An error occurred while updating the city.',
          confirmButtonColor: '#d33',
        });
      },
      complete: () => this.isSubmitting = false
    });
  }
}
