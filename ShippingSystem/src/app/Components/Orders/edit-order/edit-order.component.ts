import { ShippingType } from '../../../Enum/ShippingType';
import { PaymentType } from '../../../Enum/PaymentType';
import { OrderStatus } from '../../../Enum/OrderStatus';
import { OrderType } from '../../../Enum/OrderType';
import { FormGroup , Validators , FormBuilder } from '@angular/forms';

import { OrderService } from './../../../Services/Order-Services/Order.service';
import { ActivatedRoute } from '@angular/router';
import { Component , OnInit } from '@angular/core';
import { ReadOneOrderDTO , UpdateOrderDTO , UpdateProductDTO , Product } from '../../../Models/IOrder';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-edit-order',
  imports: [],
  templateUrl: './edit-order.component.html',
  styleUrl: './edit-order.component.css'
})
export class EditOrderComponent implements OnInit {
  orderId: number = 0;
  LoadedOrder! : ReadOneOrderDTO;
  Updated! : UpdateOrderDTO;
  ProductList! : Product[];
  orderForm!: FormGroup;
  OrderStatuses: OrderStatus[] = [];
  ShippingTypes: ShippingType[] = [];
  PaymentTypes: PaymentType[] = [];
  OrderTypes: string[] = [];


  constructor(private route: ActivatedRoute , private OrderService : OrderService , private fb : FormBuilder) {
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
    });
  }

  //Load Order
  ngOnInit(): void {
  forkJoin({
    order: this.OrderService.getOrderById(this.orderId),
    statuses: this.OrderService.getOrderStatuses(),
    shippingTypes: this.OrderService.getShippingTypes(),
    orderTypes: this.OrderService.getOrderTypes(),
    paymentTypes: this.OrderService.getPaymentTypes(),
  }).subscribe({
    next: ({ order, statuses, shippingTypes, paymentTypes, orderTypes }) => {
      this.LoadedOrder = order;
      this.ProductList = order.products;
      this.OrderStatuses = statuses;
      this.ShippingTypes = shippingTypes;
      this.PaymentTypes = paymentTypes;
      this.OrderTypes = orderTypes;

      // ✅ الآن المكان الصحيح لإنشاء النموذج:
      this.orderForm = this.fb.group({
        id: [order.orderID],
        notes: [order.notes],
        customerName: [order.customerName, Validators.required],
        customerPhone: [order.customerPhone, Validators.required],
        isShippedToVillage: [order.isShippedToVillage],
        address: [order.address],
        status: [order.status],
        shippingType: [order.shippingType],
        orderType: [order.orderType],
        paymentType: [order.paymentType],
        isPickup: [order.isPickup],
        isActive: [order.isActive],
        deliveryManId: [order.deliverManId ?? null],
      });
    },
    error: (err) => {
      console.error('Failed to load order data:', err);
    },
  });
}

submit(): void {
  const formData = this.orderForm.value;

  const updatedOrder: UpdateOrderDTO = {
    orderID: formData.id,
    notes: formData.notes,
    customerName: formData.customerName,
    customerPhone: formData.customerPhone,
    isShippedToVillage: formData.isShippedToVillage,
    address: formData.address,
    status: formData.status,
    shippingType: formData.shippingType,
    orderType: formData.orderType,
    paymentType: formData.paymentType,
    isPickup: formData.isPickup,
    isActive: formData.isActive,
    deliveyManId: formData.deliveryManId,
    products: this.ProductList.map((p) => ({
      name: p.name,
      price: p.price,
      weight: p.weight,
      quantity: p.quantity,
      orderId: formData.id
    }))
  };

  this.OrderService.updateOrder(updatedOrder).subscribe({
    next: () => console.log('Order updated successfully'),
    error: (err) => console.error('Update failed', err)
  });
}





}


