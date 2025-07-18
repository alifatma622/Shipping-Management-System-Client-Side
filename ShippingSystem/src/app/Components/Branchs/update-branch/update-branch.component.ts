 import { Component, OnInit } from '@angular/core';
 import { ActivatedRoute, Router } from '@angular/router';
 import { BranchService } from '../../../Services/Branch-Services/branch.service';
 import { CityModel } from '../../../Models/CityModels/city-model';
 import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { CityServiceService } from '../../../Services/City_Services/city-service.service';

@Component({
  selector: 'app-update-branch',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-branch.component.html',
  styleUrl: './update-branch.component.css',
})
export class UpdateBranchComponent implements OnInit {
  branchId: number = 0;
  cities: CityModel[] = [];
  branchForm!: FormGroup;
  serverError: string = '';

  constructor(
    private _router: Router,
    private _branchService: BranchService,
    private _cityService: CityServiceService,
    private _route: ActivatedRoute,
    private fb: FormBuilder
  ) {}


  ngOnInit(): void {
  this.branchForm = this.fb.group({
    name: ['', Validators.required],
    cityId: [null, Validators.required],
    isActive: [null]
  });

  this.branchId = +this._route.snapshot.paramMap.get('id')!;

  // 1. Load cities first
  this._cityService.getAllCities(1, 100).subscribe({
    next: (data) => {
      this.cities = data.items;

      // 2. After cities loaded, fetch branch
      this._branchService.getBranchById(this.branchId).subscribe({
        next: (branch) => {
          const matchedCity = this.cities.find(c => c.name === branch.city);

          this.branchForm.patchValue({
            name: branch.name,
            cityId: matchedCity?.id ?? null,
            isActive: !branch.isDeleted
          });
        },
        error: (err) => {
          this.handleServerError(err, 'loading branch');
        }
      });
    },
    error: (err) => {
      console.error('Failed to load cities', err);
    }
  });
}



  onSubmit() {
    if (this.branchForm.valid) {
      const updatedBranch = {
        ...this.branchForm.value,
        isDeleted: !this.branchForm.value.isActive
      };
      this._branchService.updateBranch(this.branchId, updatedBranch).subscribe({
        next: () => {
          Swal.fire('Success!', 'Branch updated successfully.', 'success');
          this._router.navigate(['/dashboard/AllBranch']);
        },
        error: (err) => {
          this.handleServerError(err, 'updating branch');
        },
      });
    }
  }

  handleServerError(err: any, action: string = 'processing') {
    console.error(`Error while ${action}:`, err);
    let message = 'An unexpected error occurred.';
    if (err?.error && typeof err.error === 'string') {
      message = err.error;
    } else if (err?.error?.message) {
      message = err.error.message;
    }
    this.serverError = message;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#3a3362',
    });
  }
}

