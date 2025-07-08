import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../Services/Order-Services/Order.service';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent {
  constructor(private _orderService: OrderService) {}
  sections = [
    { title: 'General Information', icon: '🧾', key: 'general', open: true },
    { title: 'Customer Information', icon: '👤', key: 'customer', open: false },
    { title: 'Shipping Information', icon: '🚚', key: 'shipping', open: false },
    {
      title: 'Seller & Branch Information',
      icon: '🏪',
      key: 'seller',
      open: false,
    },
  ];
  toggleSection(section: any): void {
    section.open = !section.open;
  }
}
