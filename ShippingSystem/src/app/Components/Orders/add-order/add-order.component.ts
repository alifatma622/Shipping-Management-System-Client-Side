// import { Component, OnInit } from '@angular/core';
// import { ShippingType } from '../../../Enum/ShippingType';
// import { OrderType } from '../../../Enum/OrderType';
// import { PaymentType } from '../../../Enum/PaymentType';
// import { CommonModule } from '@angular/common';
// import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { OrderServiceService } from '../../../Services/Order_Service/order-service.service';
// import { AddOrder } from '../../../Models/orders_models/add-order';
// import { CityService, ICity } from '../../../Services/city.service';
// import { BranchService, IBranch } from '../../../Services/branch.service';
// import { ISellerModels } from '../../../Models/seller_models/iseller-models';
// import { SellerServiceService } from '../../../Services/Seller_Service/seller-service.service';




// export const ShippingTypeLabels: Record<ShippingType, string> = {
//   [ShippingType.Standard]: 'Standard (5-7 days)',
//   [ShippingType.Fast]: 'Priority (3 - 4 Days)',
//   [ShippingType.Express24h]: 'Express (24 H)'
// };



// export const OrderTypeLabels: Record<OrderType, string> = {
//   [OrderType.Normal]: 'Normal',
//   [OrderType.Pickup]: 'Pickup'
// }



// export const PaymentTypeLabels: Record<PaymentType, string> = {
//   [PaymentType.CashOnDelivery]: 'Cash on Delivery',
//   [PaymentType.Prepaid]: 'Prepaid',
//   [PaymentType.ParcelExchange]: 'Parcel Exchange'
// };




// @Component({
//   selector: 'app-add-order',
//   imports: [CommonModule,FormsModule,ReactiveFormsModule],
//   templateUrl: './add-order.component.html',
//   styleUrl: './add-order.component.css'
// })
// export class AddOrderComponent implements OnInit {

//   orderForm: FormGroup;

//   // Enum options
//   shippingTypes = Object.values(ShippingType).filter(v => typeof v === 'number');
//   orderTypes = Object.values(OrderType).filter(v => typeof v === 'number');
//   paymentTypes = Object.values(PaymentType).filter(v => typeof v === 'number');

//   // Labels
//   shippingTypeLabels = ShippingTypeLabels;
//   orderTypeLabels = OrderTypeLabels;
//   paymentTypeLabels = PaymentTypeLabels;

//   cities: ICity[] = [];
//   branches: IBranch[] = [];
//   sellers: ISellerModels[] = [];

//   constructor(private fb: FormBuilder, private orderService: OrderServiceService,private cityService: CityService, private branchService: BranchService, private sellerService: SellerServiceService  ) {
//     this.orderForm = this.fb.group({
//       notes: [''],
//       customerName: ['', Validators.required],
//       customerPhone: ['', Validators.required],
//       address: ['', Validators.required],
//       isShippedToVillage: [false],
//       isPickup: [false],
//       creationDate: [new Date().toISOString()],
//       shippingType: [ShippingType.Standard, Validators.required],
//       orderType: [OrderType.Normal, Validators.required],
//       paymentType: [PaymentType.CashOnDelivery, Validators.required],
//       cityId: [null, Validators.required],
//       sellerId: [null, Validators.required],
//       branchId: [null, Validators.required],
//       products: this.fb.array([this.createProduct()])
//     });
//   }

//   ngOnInit(): void {
//     this.loadCities();
//     this.loadBranches();
//     this.loadSellers();
//   }


//   loadCities(): void {
//   this.cityService.getAllCities().subscribe({
//     next: data => this.cities = data,
//     error: err => console.error('Failed to load cities', err)
//   });
// }


// loadSellers(): void {
//    this.sellerService.getAllSellers().subscribe({
//     next: (res) => this.sellers = res,
//     error: (err) => console.error('Error loading sellers',err)
//   });
// }

// loadBranches(): void {
//   this.branchService.getAllBranches().subscribe({
//     next: data => this.branches = data,
//     error: err => console.error('Failed to load branches', err)
//   });
// }







//   get products(): FormArray {
//     return this.orderForm.get('products') as FormArray;
//   }

//   createProduct(): FormGroup {
//     return this.fb.group({
//       name: ['', Validators.required],
//       price: [0, [Validators.required, Validators.min(0.01)]],
//       weight: [0, [Validators.required, Validators.min(0.01)]],
//       quantity: [1, [Validators.required, Validators.min(1)]]
//     });
//   }

//   addProduct(): void {
//     this.products.push(this.createProduct());
//   }

//   removeProduct(index: number): void {
//     if (this.products.length > 1) {
//       this.products.removeAt(index);
//     }
//   }

//   onSubmit(): void {
//     if (this.orderForm.valid) {

//       const formValue = this.orderForm.value;

//       const order: AddOrder = {
//         ...formValue,
//         shippingType: +formValue.shippingType,
//         orderType: +formValue.orderType,
//         paymentType: +formValue.paymentType
//       };

//       console.log('Final order to submit:', order);
//       this.orderService.addOrder(order).subscribe({
//         next: res => alert('Order added successfully'),
//         error: err => console.error(err)
//       });
//     }
//   }

 
// }




import { Component, OnInit } from '@angular/core';
import { ShippingType } from '../../../Enum/ShippingType';
import { OrderType } from '../../../Enum/OrderType';
import { PaymentType } from '../../../Enum/PaymentType';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderServiceService } from '../../../Services/Order_Service/order-service.service';
import { AddOrder } from '../../../Models/orders_models/add-order';
import { CityService, ICity } from '../../../Services/city.service';
import { BranchService, IBranch } from '../../../Services/branch.service';
import { ISellerModels } from '../../../Models/seller_models/iseller-models';
import { SellerServiceService } from '../../../Services/Seller_Service/seller-service.service';

export const ShippingTypeLabels: Record<ShippingType, string> = {
  [ShippingType.Standard]: 'Standard (5-7 days)',
  [ShippingType.Fast]: 'Priority (3 - 4 Days)',
  [ShippingType.Express24h]: 'Express (24 H)'
};

export const OrderTypeLabels: Record<OrderType, string> = {
  [OrderType.Normal]: 'Normal',
  [OrderType.Pickup]: 'Pickup'
};

export const PaymentTypeLabels: Record<PaymentType, string> = {
  [PaymentType.CashOnDelivery]: 'Cash on Delivery',
  [PaymentType.Prepaid]: 'Prepaid',
  [PaymentType.ParcelExchange]: 'Parcel Exchange'
};

@Component({
  selector: 'app-add-order',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css'
})
export class AddOrderComponent implements OnInit {

  orderForm: FormGroup;
  isSubmitting = false;
  successMsg = '';
  errorMsg = '';

  shippingTypes = Object.values(ShippingType).filter(v => typeof v === 'number');
  orderTypes = Object.values(OrderType).filter(v => typeof v === 'number');
  paymentTypes = Object.values(PaymentType).filter(v => typeof v === 'number');

  shippingTypeLabels = ShippingTypeLabels;
  orderTypeLabels = OrderTypeLabels;
  paymentTypeLabels = PaymentTypeLabels;

  cities: ICity[] = [];
  branches: IBranch[] = [];
  sellers: ISellerModels[] = [];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderServiceService,
    private cityService: CityService,
    private branchService: BranchService,
    private sellerService: SellerServiceService
  ) {
    this.orderForm = this.fb.group({
      notes: [''],
      customerName: ['', Validators.required],
      customerPhone: ['', Validators.required],
      address: ['', Validators.required],
      isShippedToVillage: [false],
      isPickup: [false],
      creationDate: [new Date().toISOString()],
      shippingType: [ShippingType.Standard, Validators.required],
      orderType: [OrderType.Normal, Validators.required],
      paymentType: [PaymentType.CashOnDelivery, Validators.required],
      cityId: [null, Validators.required],
      sellerId: [null, Validators.required],
      branchId: [null, Validators.required],
      products: this.fb.array([this.createProduct()])
    });
  }

  ngOnInit(): void {
    this.loadCities();
    this.loadBranches();
    this.loadSellers();
  }

  get products(): FormArray {
    return this.orderForm.get('products') as FormArray;
  }

  createProduct(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      weight: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addProduct(): void {
    this.products.push(this.createProduct());
  }

  removeProduct(index: number): void {
    if (this.products.length > 1) {
      this.products.removeAt(index);
    }
  }

  loadCities(): void {
    this.cityService.getAllCities().subscribe({
      next: data => this.cities = data,
      error: err => console.error('Failed to load cities', err)
    });
  }

  loadBranches(): void {
    this.branchService.getAllBranches().subscribe({
      next: data => this.branches = data,
      error: err => console.error('Failed to load branches', err)
    });
  }

  loadSellers(): void {
    this.sellerService.getAllSellers().subscribe({
      next: res => this.sellers = res,
      error: err => console.error('Error loading sellers', err)
    });
  }

  onSubmit(): void {
    this.successMsg = '';
    this.errorMsg = '';

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const formValue = this.orderForm.value;
    const order: AddOrder = {
      ...formValue,
      shippingType: +formValue.shippingType,
      orderType: +formValue.orderType,
      paymentType: +formValue.paymentType
    };

    this.isSubmitting = true;

    this.orderService.addOrder(order).subscribe({
      next: _ => {
        this.successMsg = 'Order added successfully';
        this.isSubmitting = false;
        this.orderForm.reset();
        // Reset to default values again
        this.orderForm.patchValue({
          shippingType: ShippingType.Standard,
          orderType: OrderType.Normal,
          paymentType: PaymentType.CashOnDelivery,
          isShippedToVillage: false,
          isPickup: false,
          creationDate: new Date().toISOString()
        });
        this.products.clear();
        this.products.push(this.createProduct());
      },
      error: err => {
        console.error(err);
        this.errorMsg = 'Failed to add order. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
