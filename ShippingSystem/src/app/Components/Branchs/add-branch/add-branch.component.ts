import { Component, OnInit } from '@angular/core';
import { CityServiceService } from '../../../Services/City_Services/city-service.service';
import { CityModel } from '../../../Models/CityModels/city-model';
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

@Component({
  selector: 'app-add-branch',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.css',
})
export class AddBranchComponent implements OnInit {
  cities!: CityModel[];
  serverError: string = '';
  branchForm!: FormGroup;
  constructor(
    private _cityService: CityServiceService,
    private _branchService: BranchService,
    private fb: FormBuilder,
    private _router: Router
  ) {}
  ngOnInit(): void {
    // This Is Working When API Working
    // this._cityService.getAllCities().subscribe((data) => {
    //   this.city = data;
    // });

    // قائمة مدن وهمية مؤقتًا
    this.cities = [
      {
        id: 1,
        name: 'Cairo',
        normalPrice: 0,
        pickupPrice: 0,
        governorateName: '',
      },
      {
        id: 2,
        name: 'Alexandria',
        normalPrice: 0,
        pickupPrice: 0,
        governorateName: '',
      },
      {
        id: 3,
        name: 'Giza',
        normalPrice: 0,
        pickupPrice: 0,
        governorateName: '',
      },
    ];

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

          // محاولة استخراج رسالة الخطأ من السيرفر
          if (err.error && typeof err.error === 'string') {
            this.serverError = err.error; // API رجّع نص مباشر
          } else if (err.error?.message) {
            this.serverError = err.error.message; // API فيه message مخصصة
          } else {
            this.serverError = 'Unexpected error occurred.';
          }

          // تنبيه SweetAlert بالأعلى
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
