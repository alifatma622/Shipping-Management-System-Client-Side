import { Component, OnInit } from '@angular/core';
import { ShippingType } from '../../../Enum/ShippingType';
import { OrderType } from '../../../Enum/OrderType';
import { PaymentType } from '../../../Enum/PaymentType';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../../../app/Services/Order-Services/Order.service';
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
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css'
})
export class AddOrderComponent implements OnInit {
  orderForm: FormGroup;
  productForm: FormGroup;
  addedProducts: any[] = [];

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
    private orderService: OrderService,
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
      products: this.fb.array([]) // will set this before submit
    });

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      weight: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadCities();
    this.loadBranches();
    this.loadSellers();
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
    this.sellerService.getAllSellers(1 , 50).subscribe({
      next: data => this.sellers = data.items,
      error: err => console.error('Failed to load sellers', err)
    });
  }

  addProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

      console.log('Adding product:', this.productForm.value); // ✅ للتأكيد

    this.addedProducts.push({ ...this.productForm.value });

    console.log('Added products:', this.addedProducts); // ✅ للتأكيد

    this.productForm.reset({
      name: '',
      price: 0,
      weight: 0,
      quantity: 1
    });
  }

  removeProduct(index: number): void {
    this.addedProducts.splice(index, 1);
  }

  onSubmit(): void {
    this.successMsg = '';
    this.errorMsg = '';

    if (this.orderForm.invalid || this.addedProducts.length === 0) {
      this.orderForm.markAllAsTouched();
      return;
    }

    // ✅ استخدمي متغير مؤقت لعدم التأثير على addedProducts
    // const productsFormArray = this.fb.array(this.addedProducts.map(prod =>
    //   this.fb.group({
    //     name: [prod.name],
    //     price: [prod.price],
    //     weight: [prod.weight],
    //     quantity: [prod.quantity]
    //   })
    // ));

    // this.orderForm.setControl('products', productsFormArray);

      const productFormArray: FormArray<FormGroup> = this.fb.array<FormGroup>([]);

      this.addedProducts.forEach(prod => {
        const group = this.fb.group({
          name: [prod.name, Validators.required],
          price: [prod.price, [Validators.required, Validators.min(0.01)]],
          weight: [prod.weight, [Validators.required, Validators.min(0.01)]],
          quantity: [prod.quantity, [Validators.required, Validators.min(1)]]
        });

        productFormArray.push(group);
      });

      this.orderForm.setControl('products', productFormArray);



    const formValue = this.orderForm.value;
    const order: AddOrder = {
      ...formValue,
      shippingType: +formValue.shippingType,
      orderType: +formValue.orderType,
      paymentType: +formValue.paymentType
    };

    this.isSubmitting = true;

    this.orderService.addOrder(order).subscribe({
      next: (_:any) => {
        this.successMsg = 'Order added successfully';
        this.isSubmitting = false;
        this.addedProducts = [];
        this.productForm.reset({ name: '', price: 0, weight: 0, quantity: 1 });
        this.orderForm.reset();
        this.orderForm.patchValue({
          shippingType: ShippingType.Standard,
          orderType: OrderType.Normal,
          paymentType: PaymentType.CashOnDelivery,
          isShippedToVillage: false,
          isPickup: false,
          creationDate: new Date().toISOString()
        });
      },
      error: (err : any) => {
        console.error(err);
        this.errorMsg = 'Failed to add order. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
