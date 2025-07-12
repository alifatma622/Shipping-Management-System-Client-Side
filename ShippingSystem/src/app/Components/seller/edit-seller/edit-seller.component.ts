import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SellerServiceService } from '../../../Services/Seller_Service/seller-service.service';
import { CommonModule } from '@angular/common';
import { CityService, ICity } from '../../../Services/city.service';
import { IUpdateseller } from '../../../Models/seller_models/IUpdateseller-models';

@Component({
  selector: 'app-edit-seller',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './edit-seller.component.html',
  styleUrl: './edit-seller.component.css'
})
export class EditSellerComponent implements OnInit {

  editForm: FormGroup;
  sellerId: number = 0;
  isSubmitting = false;
  successMsg = '';
  errorMsg = '';
  cities: ICity[] = [] ;

  constructor(private fb:FormBuilder,private cityService :CityService  ,private router:Router, private route: ActivatedRoute,private  sellerservice :SellerServiceService)
  {
    this.editForm = this.fb.group({
      storeName: ['', Validators.required],
      address: ['', Validators.required],
      cancelledOrderPercentage: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      cityId: [null, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')]],
      isActive: [true],
      password: ['', [
              Validators.minLength(8),
              Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}:;<>.,?]).+$')
            ]],
    });
  }



  // Load cities and seller data on component initialization
  ngOnInit(): void {
  this.sellerId = Number(this.route.snapshot.paramMap.get('id'));

  this.cityService.getAllCities().subscribe({
    next: (citiesData) => {
      this.cities = citiesData;
      console.log('Cities loaded:', this.cities);


      if (this.sellerId) {
        this.sellerservice.getSellerById(this.sellerId).subscribe({
          next: (data) => {
            const matchingCity = this.cities.find(city => city.name === data.cityName);
            const cityId = matchingCity?.id || null;
            console.log('City ID:', cityId);

            this.editForm.patchValue({
              storeName: data.storeName,
              address: data.address,
              cancelledOrderPercentage: data.cancelledOrderPercentage,
              cityId: cityId,
              username: data.username,
              email: data.email,
              phoneNumber: data.phoneNumber,
              firstName: data.fullName.split(' ')[0],
              lastName: data.fullName.split(' ').slice(1).join(' '),
              isActive:!data.isDeleted,
              password:data.password
            });
          },
          error: (err) => {
            console.error(err);
            this.errorMsg = 'Failed to load seller data';
          }
        });
      }
    },
    error: (err) => {
      console.error('Failed to load cities', err);
      this.errorMsg = 'Failed to load cities';
    }
  });
}





  // Handle form submission


  onSubmit() {
    this.isSubmitting = true;

    // if (!data.password || data.password.trim() === '') {
    //   delete data.password;
    // }
     if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    else {
      const updatedSeller = { ...this.editForm.value, id: this.sellerId,isDeleted: !this.editForm.value.isActive };
      // delete (data as any).isActive;
      this.sellerservice.updateSeller(this.sellerId, updatedSeller).subscribe({
        next: () => {
          this.successMsg = 'Seller updated successfully';
          setTimeout(() => {
            this.router.navigate(['/dashboard/seller']);
          }, 2000);
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'Failed to update seller';
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

}

