import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Services/Order-Services/Order.service';
import { Router } from '@angular/router';
import { ReadOrderDTO } from '../../../Models/IOrder';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderStatus } from '../../../Enum/OrderStatus';

@Component({
  selector: 'app-orders-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
 orders: ReadOrderDTO[] = [];
  isLoading = true;
  errorMsg = '';
  routes: any;
  searchUserName: string = '';

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders() {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error loading orders!';
        this.isLoading = false;
      }
    });
  }

  onEdit(id: number) {
    this.router.navigate(['/order/edit', id]);
  }

  onDelete(id: number) {
  //   this.orderService.softDelete(id).subscribe(() => this.getAllOrders());
  }

  onAdd() {
    this.router.navigate(['dashboard/order/add']);
  }

  get filteredOrders(): ReadOrderDTO[] {
    if (!this.searchUserName.trim()) return this.orders;
    return this.orders.filter(o =>
      o.sellerName?.toLowerCase().includes(this.searchUserName.trim().toLowerCase())
    );
  }
  onSearchChange(value: string) {
    this.searchUserName = value;
  }

  getStatusText(status: string): string {
  switch(status) {
    case 'Pending': return 'Pending';
    case 'AcceptedByDeliveryCompany': return 'Accepted';
    case 'RejectedByDeliveryCompany': return 'Rejected';
    case 'Delivered': return 'Delivered';
    case 'DeliveredToDeliveryMan': return 'With Agent';
    case 'CanNotBeReached': return 'Unreachable';
    case 'Postponed': return 'Postponed';
    case 'PartiallyDelivered': return 'Partial';
    case 'CanceledByCustomer': return 'Canceled';
    case 'RejectWithPayment': return 'Rejected (Paid)';
    case 'RejectWithoutPayment': return 'Rejected (Unpaid)';
    case 'RejectWithPartiallyPaid': return 'Rejected (Partial)';
    default: return 'Unknown';
  }
}

getStatusClass(status: string): string {
  switch(status) {
    case 'Pending': return 'status-pending';
    case 'AcceptedByDeliveryCompany': return 'status-accepted';
    case 'RejectedByDeliveryCompany':
    case 'RejectWithPayment':
    case 'RejectWithoutPayment':
    case 'RejectWithPartiallyPaid':
      return 'status-rejected';
    case 'Delivered': return 'status-delivered';
    case 'DeliveredToDeliveryMan': return 'status-with-agent';
    case 'CanNotBeReached': return 'status-unreachable';
    case 'Postponed': return 'status-postponed';
    case 'PartiallyDelivered': return 'status-partial';
    case 'CanceledByCustomer': return 'status-canceled';
    default: return 'status-unknown';
  }
}

// In your component class
viewDetails(orderId: number): void {
  this.router.navigate(['/dashboard/Details', orderId]);
}

assignOrder(order: ReadOrderDTO): void {
  // const dialogRef = this.dialog.open(AssignAgentDialogComponent, {
  //   width: '500px',
  //   data: { order }
  // });

  // dialogRef.afterClosed().subscribe(result => {
  //   if (result) {
  //     // Handle assignment logic here
  //     console.log('Assigned to:', result.agentId);
  //   }
  // });
}
}
