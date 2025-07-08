import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SellerServiceService } from '../../../Services/Seller_Service/seller-service.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CityService, ICity } from '../../../Services/city.service';

@Component({
  selector: 'app-add-seller',
  templateUrl: './add-seller.component.html',
  styleUrls: ['./add-seller.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddSellerComponent implements OnInit {
  addForm: FormGroup;
  cities: ICity[] = [];
  isSubmitting = false;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private sellerService: SellerServiceService, private router: Router,private cityService: CityService) {
    this.addForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}:;<>.,?]).+$')
      ]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')]],
      storeName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      cancelledOrderPercentage: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      cityId: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {

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

    const data = this.addForm.value;
    console.log('Form Data:', data);
    this.sellerService.addSeller(data).subscribe({
      next: () => {
        this.successMsg = 'Seller added successfully!';
        setTimeout(() => this.router.navigate(['/dashboard/seller']), 1500);
      },
      error: (err) => {
        console.error('Backend error:', err);
        this.errorMsg = err?.error?.err || 'Error adding seller.';
        this.isSubmitting = false;
      }
    });
  }
}
