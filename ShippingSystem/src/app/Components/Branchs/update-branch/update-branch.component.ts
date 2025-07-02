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
import { AllBranch } from '../../../Models/Branch/all-branch';
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
      isDeleted: [false],
    });

    this.branchId = +this._route.snapshot.paramMap.get('id')!;

    // ✅ Fake Cities
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

    // ✅ Fake Branch For Testing
    const fakeBranches: AllBranch[] = [
      { id: 1, name: 'Branch A', city: 'Cairo', creationDate: '' },
      { id: 2, name: 'Branch B', city: 'Alexandria', creationDate: '' },
      { id: 3, name: 'Branch C', city: 'Giza', creationDate: '' },
    ];

    const selectedBranch = fakeBranches.find((b) => b.id === this.branchId);

    if (selectedBranch) {
      this.branchForm.patchValue({
        name: selectedBranch.name,
        cityId: this.getCityIdByName(selectedBranch.city),
        isDeleted: false,
      });
    } else {
      Swal.fire('Error', 'Branch not found in test data.', 'error');
    }

    // ✅ لو كنت عايز تستخدم API الحقيقي بعدين
    /*
    this._cityService.getAllCities().subscribe((data) => {
      this.cities = data;
    });

    this._branchService.getBranchById(this.branchId).subscribe({
      next: (branch) => {
        this.branchForm.patchValue({
          name: branch.name,
          cityId: this.getCityIdByName(branch.city),
          isDeleted: false,
        });
      },
      error: (err) => {
        this.handleServerError(err, 'loading branch');
      },
    });
    */
  }

  getCityIdByName(name: string): number | null {
    const city = this.cities.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    return city ? city.id : null;
  }

  onSubmit() {
    if (this.branchForm.valid) {
      const updatedBranch = this.branchForm.value;

      // ✅ Simulate success (fake API response)
      console.log('Updated Branch:', updatedBranch);
      Swal.fire('Success!', 'Branch updated successfully.', 'success');
      this._router.navigate(['/AllBranch']);

      // ✅ لو API حقيقي
      /*
      this._branchService.updateBranch(this.branchId, updatedBranch).subscribe({
        next: () => {
          Swal.fire('Success!', 'Branch updated successfully.', 'success');
          this._router.navigate(['/AllBranch']);
        },
        error: (err) => {
          this.handleServerError(err, 'updating branch');
        },
      });
      */
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
