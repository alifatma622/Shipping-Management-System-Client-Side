import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeliveryManService } from './../../../Services/delivery-man.service';
import {
  BranchService,
  IBranch,
} from '../../../Services/Branch-Services/branch.service';
import { CityService, ICity } from './../../../Services/city.service';
import { IAddDeliveryMan } from './../../../Models/IDeliveryMan_model';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-delivery-man',
  templateUrl: './add-delivery-man.component.html',
  styleUrls: ['./add-delivery-man.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddDeliveryManComponent implements OnInit {
  addForm: FormGroup;
  isSubmitting = false;
  errorMsg = '';
  successMsg = '';
  branches: IBranch[] = [];
  cities: ICity[] = [];

  constructor(
    private fb: FormBuilder,
    private deliveryManService: DeliveryManService,
    private branchService: BranchService,
    private cityService: CityService,
    private router: Router
  ) {
    this.addForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z\\s]+$'),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z0-9_]+$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}:;<>.,?]).+$'
          ),
        ],
      ],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')],
      ],
      branchId: ['', [Validators.required, Validators.min(1)]],
      cityIds: [[], [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    this.branchService.getAllBranches().subscribe({
      next: (data) => (this.branches = data),
      error: () => (this.errorMsg = 'Error loading branches'),
    });
    this.cityService.getAllCities().subscribe({
      next: (data) => (this.cities = data),
      error: () => (this.errorMsg = 'Error loading cities'),
    });
  }

  onSubmit() {
    this.errorMsg = '';
    this.successMsg = '';
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    // تحويل branchId و cityIds لأرقام والتأكد من صحتهم
    const branchId = Number(this.addForm.value.branchId);
    const cityIds = (this.addForm.value.cityIds as any[])
      .map((id) => Number(id))
      .filter((id) => !isNaN(id) && id > 0);

    if (!branchId || cityIds.length === 0) {
      this.errorMsg = 'Please select a valid branch and at least one city.';
      this.isSubmitting = false;
      return;
    }

    const data: IAddDeliveryMan = {
      ...this.addForm.value,
      branchId,
      cityIds,
    };

    console.log(data);

    this.deliveryManService.add(data).subscribe({
      next: () => {
        this.successMsg = 'Delivery man added successfully!';
        setTimeout(() => this.router.navigate(['/delivery-men']), 1200);
      },
      error: (err) => {
        console.log('Backend error:', err);
        this.errorMsg =
          err?.error?.error ||
          JSON.stringify(err?.error) ||
          'Error adding delivery man!';
        this.isSubmitting = false;
      },
    });
  }
}
