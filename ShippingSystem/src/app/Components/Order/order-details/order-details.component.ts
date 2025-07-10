import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../Services/Order-Services/Order.service';
import { ActivatedRoute } from '@angular/router';
import { ReadOneOrderDTO } from '../../../Models/IOrder';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent implements OnInit {
  orderDetails: ReadOneOrderDTO | null = null;
  orderId: number = 0;
  sections = [
    { title: 'General Information', key: 'general', open: true },
    { title: 'Customer Information',  key: 'customer', open: false },
    { title: 'Shipping Information', key: 'shipping', open: false },
    { title: 'Seller & Branch Information', key: 'seller', open: false },
  ];
  constructor(private _orderService: OrderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('id')!;
    this._orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.orderDetails = order;
      },
      error: (err) => {
        this.orderDetails = null;
        // handle error (could show a message)
      }
    });
  }

  toggleSection(section: any): void {
    section.open = !section.open;
  }
}
