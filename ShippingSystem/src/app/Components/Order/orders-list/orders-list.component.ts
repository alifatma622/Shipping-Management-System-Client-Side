import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Services/Order-Services/Order.service';
import { Router } from '@angular/router';
import { AddOrderDTO, ReadOrderDTO } from '../../../Models/IOrder';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeliveryManService } from '../../../Services/delivery-man.service';
import { IReadDeliveryMan } from '../../../Models/IDeliveryMan_model';

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
  searchString: string = '';
  selectedOrderId: number = 0;
  deliveryAgents:IReadDeliveryMan[] = [];
  filteredAgents: IReadDeliveryMan[] = [];
  selectedAgent: IReadDeliveryMan | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  totalCount = 0;
  constructor(private orderService: OrderService, private router: Router, private deliveryService:DeliveryManService) {}

  //#region init
  ngOnInit(): void {
    this.loadOrders();

    this.deliveryService.getAllDeliveryMen().subscribe({
      next: (data) => {
        this.deliveryAgents = data.filter(agent => !agent.isDeleted);
      },
      error: (err) => {
        console.error('Error loading delivery agents:', err);
      }
    });
  }

  // getAllOrders() {
  //   this.isLoading = true;
  //   this.orderService.getOrders().subscribe({
  //     next: (data) => {
  //       this.orders = data;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       this.errorMsg = 'Error loading orders!';
  //       this.isLoading = false;
  //     }
  //   });
  // }

loadOrders() {
   this.isLoading = true;
    this.orderService.getPaginatedOrders(
      this.currentPage,
      this.itemsPerPage
    ).subscribe({
      next: (response) => {
        this.orders = response.items;
        this.totalCount = response.totalCount;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error loading orders';
        this.isLoading = false;
      }
    });
  }
  onEdit(id: number) {
    this.router.navigate(['dashboard/order/edit', id]);
  }

  onDelete(id: number) {
  //   this.orderService.softDelete(id).subscribe(() => this.getAllOrders());
  }

  onAdd() {
    this.router.navigate(['dashboard/order/add']);
  }

  get filteredOrders(): ReadOrderDTO[] {
  if (!this.searchString.trim()) return this.orders;

  const searchTerm = this.searchString.trim().toLowerCase();

  return this.orders.filter(o => {
    // Convert all searchable fields to lowercase strings for comparison
    const fieldsToSearch = [
      o.status,
      o.branchName,
      o.address,
      o.customerName,
      o.orderID?.toString(),
      o.creationDate.toString(),
      o.sellerName,
      o.totalCost.toString(),
      o.totalWeight.toString(),
      o.customerCityName
      // Add more fields as needed
    ].filter(f => f); // Remove undefined/null values

    return fieldsToSearch.some(f =>
      f.toLowerCase().includes(searchTerm)
    );
  });
}
  onSearchChange(value: string) {
    this.searchString = value;
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

viewDetails(deliveryId: number): void {
  this.router.navigate(['dashboard/orders', deliveryId]);
}
//#endregion

//#region assign agent

filterDeliveryAgents(order: ReadOrderDTO): IReadDeliveryMan[] {
  const cityName = order.customerCityName ?? '';
  return this.filteredAgents = this.deliveryAgents.filter(agent => agent.cities?.includes(cityName));
}

selectAgent(agent: IReadDeliveryMan): void {
  this.selectedAgent = agent;
}

assignOrder(orderId:number): void {
  this.orderService.assignDeliveryAgent(orderId, this.selectedAgent?.id ?? 0).subscribe({
     next: (response) => {
          console.log('Agent assigned successfully', response);
           this.selectedAgent = null;
           this.loadOrders();
        },
        error: (error) => {
          console.error('Error assigning agent', error);}
    });
}
//#endregion

//#region pagination

get pagedOrders() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredOrders.slice(start, start + this.itemsPerPage);
}

get totalPages() {
  return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
}

onPageChange(page: number) {
  this.currentPage = page;
}

onItemsPerPageChange(count: number) {
  this.itemsPerPage = count;
  this.currentPage = 1;
}
//#endregion
}
