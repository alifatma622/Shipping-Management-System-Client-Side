import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryManService } from './../../../Services/delivery-man.service';
import {
  BranchService,
  IBranch,
} from '../../../Services/Branch-Services/branch.service';
import { CityService, ICity } from './../../../Services/city.service';
import {
  IUpdateDeliveryMan,
  IReadDeliveryMan,
} from './../../../Models/IDeliveryMan_model';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-delivery-man',
  templateUrl: './edit-delivery-man.component.html',
  styleUrls: ['./edit-delivery-man.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class EditDeliveryManComponent implements OnInit {
  editForm: FormGroup;
  isSubmitting = false;
  isLoading = false;
  errorMsg = '';
  successMsg = '';
  branches: IBranch[] = [];
  cities: ICity[] = [];
  deliveryManId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private deliveryManService: DeliveryManService,
    private branchService: BranchService,
    private cityService: CityService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
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
      branchId: [null, [Validators.required, Validators.min(1)]],
      cityIds: [[], [Validators.required, Validators.minLength(1)]],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.loadDeliveryManData();
  }

  private loadInitialData(): void {
    // Load branches
    this.branchService.getAllBranches().subscribe({
      next: (data) => (this.branches = data),
      error: (err) => {
        console.error('Error loading branches:', err);
        this.errorMsg = 'Error loading branches. Please refresh the page.';
      },
    });

    // Load cities
    this.cityService.getAllCities().subscribe({
      next: (data) => (this.cities = data),
      error: (err) => {
        console.error('Error loading cities:', err);
        this.errorMsg = 'Error loading cities. Please refresh the page.';
      },
    });
  }

  private loadDeliveryManData(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.deliveryManId = +id;
        this.loadDeliveryMan(+id);
      } else {
        this.errorMsg = 'Invalid delivery man ID.';
        setTimeout(() => this.router.navigate(['/delivery-men']), 2000);
      }
    });
  }

  loadDeliveryMan(id: number) {
    this.isLoading = true;
    this.errorMsg = '';

    this.deliveryManService.getById(id).subscribe({
      next: (data: IReadDeliveryMan) => {
        this.editForm.patchValue({
          name: data.fullName || '',
          email: data.email || '',
          userName: data.userName || '',
          phoneNumber: data.phoneNumber || '',
          branchId: data.branchId ? Number(data.branchId) : null,
          cityIds: data.cityIds ? data.cityIds.map(Number) : [],
          isActive: !data.isDeleted,
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading delivery man:', err);
        this.errorMsg = 'Failed to load delivery man data. Please try again.';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/delivery-men']), 2000);
      },
    });
  }

  onSubmit() {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.editForm.invalid || !this.deliveryManId) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const data: IUpdateDeliveryMan = {
      ...this.editForm.value,
      branchId: Number(this.editForm.value.branchId),
      cityIds: this.editForm.value.cityIds
        .map((id: any) => Number(id))
        .filter((id: number) => !!id),
      isDeleted: !this.editForm.value.isActive,
    };
    delete (data as any).isActive;

    // Log for debugging
    console.log('isActive:', this.editForm.value.isActive, 'isDeleted:', data.isDeleted);

    if (!data.password || data.password.trim() === '') {
      delete data.password;
    }

    console.log('Sending data to backend:', data);

    this.deliveryManService.update(this.deliveryManId, data).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Success!',
          text: 'Delivery man has been updated successfully.',
          icon: 'success',
          confirmButtonColor: '#055866',
        }).then(() => {
          this.router.navigate(['/dashboard/delivery-men']);
        });
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Backend error:', err);
        this.isSubmitting = false;

        if (err?.error?.details) {
          this.errorMsg = JSON.stringify(err.error.details, null, 2);
        } else if (err?.error?.error) {
          this.errorMsg = err.error.error;
        } else if (err?.status === 404) {
          this.errorMsg = 'Delivery man not found.';
        } else if (err?.status === 409) {
          this.errorMsg = 'Username or email already exists.';
        } else {
          this.errorMsg = 'Error updating delivery man. Please try again.';
        }
      },
    });
  }

  // Helper method to check if form field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  // Helper method to get field error message
  getFieldErrorMessage(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} is required.`;
    if (field.errors['email']) return 'Please enter a valid email address.';
    if (field.errors['minlength'])
      return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters.`;
    if (field.errors['maxlength'])
      return `${fieldName} must be at most ${field.errors['maxlength'].requiredLength} characters.`;
    if (field.errors['pattern']) return `${fieldName} format is invalid.`;
    if (field.errors['min'])
      return `${fieldName} must be at least ${field.errors['min'].min}.`;

    return `${fieldName} is invalid.`;
  }

  goToDeliveryMenList() {
    this.router.navigateByUrl('/dashboard/delivery-men');
  }
}
