import { Component, OnInit } from '@angular/core';
import { BranchService } from '../../../Services/Branch-Services/branch.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { AddBranch } from '../../../Models/Branch/add-branch';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CityServiceService } from '../../../Services/City_Services/city-service.service';
import { CityModel } from '../../../Models/CityModels/city-model';

@Component({
  selector: 'app-add-branch',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.css',
})
export class AddBranchComponent implements OnInit {
  cities: CityModel[] = [];
  serverError: string = '';
  branchForm!: FormGroup;
  constructor(
    private _cityService: CityServiceService,
    private _branchService: BranchService,
    private fb: FormBuilder,
    private _router: Router
  ) {}
  ngOnInit(): void {
    this._cityService.getAllCities(1, 100).subscribe({
      next: (data) => {
        this.cities = data.items;
      },
      error: (err) => {
        console.error('Failed to load cities', err);
      },
    });

    this.branchForm = this.fb.group({
      name: ['', Validators.required],
      cityId: [null, Validators.required],
      isDeleted: [false],
    });
  }

  onSubmit() {
    if (this.branchForm.valid) {
      const newBranch: AddBranch = this.branchForm.value;

      this._branchService.addNewBranch(newBranch).subscribe({
        next: (res) => {
          Swal.fire({
            title: 'Success!',
            text: 'Branch has been added successfully.',
            icon: 'success',
            confirmButtonColor: '#055866',
          });

          this.branchForm.reset();
          this._router.navigate(['/AllBranch']);
        },
        error: (err) => {
          console.error('Error adding branch:', err);

          if (err.error && typeof err.error === 'string') {
            this.serverError = err.error;
          } else if (err.error?.message) {
            this.serverError = err.error.message;
          } else {
            this.serverError = 'Unexpected error occurred.';
          }

          Swal.fire({
            title: 'Error!',
            text: this.serverError,
            icon: 'error',
            confirmButtonColor: '#3a3362',
          });
        },
      });
    }
  }
}