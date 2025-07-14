import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ShippingType } from '../../../Enum/ShippingType';
import { PaymentType } from '../../../Enum/PaymentType';
import { OrderStatus } from '../../../Enum/OrderStatus';
import { OrderType } from '../../../Enum/OrderType';

import {
  ReadOneOrderDTO,
  UpdateOrderDTO,
  Product
} from '../../../Models/IOrder';

import { OrderService } from './../../../Services/Order-Services/Order.service';
import { CityService, ICity } from '../../../Services/city.service';
import { BranchService, IBranch } from '../../../Services/branch.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class EditOrderComponent implements OnInit {
  orderId: number = 0;
  LoadedOrder!: ReadOneOrderDTO;
  ProductList: Product[] = [];

  orderForm!: FormGroup;
  productForm!: FormGroup;



  OrderStatuses: OrderStatus[] = [];
  ShippingTypes: { value: number, label: string }[] = [];
  PaymentTypes: { value: number, label: string }[] = [];
  OrderTypes: { value: number, label: string }[] = [];

  successMsg: string = '';
  errorMsg: string = '';
  isSubmitting = false;

  cities: ICity[] = [];
  branches: IBranch[] = [];

  constructor(
    private route: ActivatedRoute,
    private OrderService: OrderService,
    private fb: FormBuilder,
    private branchService: BranchService,
    private cityService: CityService,

    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.orderId = +params['id'];
    });
  }

  ngOnInit(): void {
    forkJoin({
      order: this.OrderService.getOrderById(this.orderId),
      statuses: this.OrderService.getOrderStatuses(),
      shippingTypes: this.OrderService.getShippingTypes(),
      orderTypes: this.OrderService.getOrderTypes(),
      paymentTypes: this.OrderService.getPaymentTypes(),
      cities: this.cityService.getAllCities(),
      branches: this.branchService.getAllBranches() // <-- And this
    }).subscribe({
      next: ({
        order,
        statuses,
        shippingTypes,
        paymentTypes,
        orderTypes,
        cities,
        branches
      }) => {
        this.LoadedOrder = order;
        this.ProductList = order.products;
        this.OrderStatuses = statuses;
        this.cities = cities;
        this.branches = branches;
        // Set select options first
        console.log('orderTypeId = ', order.orderTypeId);
        console.log('typeof orderTypeId = ', typeof order.orderTypeId);
        console.log('OrderTypes list = ', this.OrderTypes);

        this.ShippingTypes = Object.keys(ShippingType)
          .filter(key => !isNaN(Number((ShippingType as any)[key])))
          .map(key => ({ value: Number((ShippingType as any)[key]), label: key }));
        this.PaymentTypes = Object.keys(PaymentType)
          .filter(key => !isNaN(Number((PaymentType as any)[key])))
          .map(key => ({ value: Number((PaymentType as any)[key]), label: key }));
        this.OrderTypes = Object.keys(OrderType)
          .filter(key => !isNaN(Number((OrderType as any)[key])))
          .map(key => ({ value: Number((OrderType as any)[key]), label: key }));

        // Now initialize the form with the loaded order's values
        this.orderForm = this.fb.group({
          id: [order.orderID],
          notes: [order.notes],
          customerName: [order.customerName, Validators.required],
          customerPhone: [order.customerPhone, Validators.required],
          isShippedToVillage: [order.isShippedToVillage],
          address: [order.address, Validators.required],
          status: Number(order.status) ,
          shippingType: Number(order.shippingTypeID),
          orderType: Number(order.orderTypeId),
          paymentType: Number(order.paymentTypeId),
          isPickup: [order.isPickup],
          isActive: [order.isActive],
          deliveryManId: [order.deliverManId ?? null],
          cityId: [
              this.cities.find(c => c.name === order.customerCityName)?.id ?? null,
              Validators.required
            ],
            branchId: [
              this.branches.find(b => b.name === order.branchName)?.id ?? null,
              Validators.required
            ]

        });

        this.productForm = this.fb.group({
          name: ['', Validators.required],
          price: [0, [Validators.required, Validators.min(0.01)]],
          weight: [0, [Validators.required, Validators.min(0.01)]],
          quantity: [1, [Validators.required, Validators.min(1)]],
        });
      },
      error: (err) => {
        console.error('Failed to load order data:', err);
      },
    });
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const newProduct: Product = this.productForm.value;
      this.ProductList.push(newProduct);
      this.productForm.reset({
        name: '',
        price: 0,
        weight: 0,
        quantity: 1,
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  removeProduct(index: number): void {
    this.ProductList.splice(index, 1);
  }

  submit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    if (this.ProductList.length === 0) {
      this.errorMsg = 'At least one product is required.';
      return;
    }

    const formData = this.orderForm.value;

    const updatedOrder: UpdateOrderDTO = {
      id : this.orderId, // <-- use 'id' not 'orderID'
      notes: formData.notes,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      isShippedToVillage: formData.isShippedToVillage,
      address: formData.address,
      status: Number(formData.statusId), // use the value from the form
      shippingType: Number(formData.shippingType),
      orderType: Number(formData.orderType),
      paymentType: Number(formData.paymentType),
      isPickup: formData.isPickup,
      isActive: formData.isActive,
      deliveryManId: this.LoadedOrder.deliverManId ?? 0, // <-- use 'deliveryManId'
      cityId: Number(formData.cityId),
      branchId: Number(formData.branchId),
      products: this.ProductList.map((p) => ({
        name: p.name,
        price: p.price,
        weight: p.weight,
        quantity: p.quantity,
        orderId: this.orderId,
      })),
    };

    console.log('Submitting updated order:', updatedOrder);

    this.isSubmitting = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.OrderService.updateOrder(updatedOrder).subscribe({
      next: () => {
        this.successMsg = 'Order updated successfully.';
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Update failed', err);
        this.errorMsg = 'Failed to update order. Please try again.';
        this.isSubmitting = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/order']);
  }
}
