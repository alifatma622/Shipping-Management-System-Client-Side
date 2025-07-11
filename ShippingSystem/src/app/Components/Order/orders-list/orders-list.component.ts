import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Services/Order-Services/Order.service';
import { Router } from '@angular/router';
import { ReadOrderDTO } from '../../../Models/IOrder';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeliveryManService } from '../../../Services/delivery-man.service';
import { IReadDeliveryMan } from '../../../Models/IDeliveryMan_model';
import { OrderStatus } from '../../../Enum/OrderStatus';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-orders-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
})
export class OrdersListComponent implements OnInit {

  orders: ReadOrderDTO[] = [];
  isLoading = true;
  errorMsg = '';
  routes: any;
  searchString: string = '';
  selectedStatus: string = '';
  selectedOrderId: number = 0;
  deliveryAgents: IReadDeliveryMan[] = [];
  filteredAgents: IReadDeliveryMan[] = [];
  selectedAgent: IReadDeliveryMan | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  totalCount = 0;

  OrderStatus = OrderStatus;
  orderStatuses = Object.values(OrderStatus).filter(v => !isNaN(Number(v))) as number[];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private deliveryService: DeliveryManService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadOrders();

    this.deliveryService.getAllDeliveryMen().subscribe({
      next: (data) => {
        this.deliveryAgents = data.filter((agent) => !agent.isDeleted);
      },
      error: (err) => {
        console.error('Error loading delivery agents:', err);
      },
    });
  }

  loadOrders() {
    this.isLoading = true;

    this.orderService.getPaginatedOrders(
      this.currentPage,
      this.itemsPerPage,
      this.selectedStatus // هنا نمرر الفلتر
    ).subscribe({
      next: (response) => {
        this.orders = response.items.map(order => ({
          ...order,
          status: this.getStatusNumberFromName(order.status),
          showStatusDropdown: false
        }));
        this.totalCount = response.totalCount;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error loading orders';
        this.isLoading = false;
      }
    });
  }

  onStatusChange() {
    this.currentPage = 1;
    this.loadOrders();
  }

  onEdit(id: number) {
    this.router.navigate(['dashboard/Order/Edit', id]);
  }

  onDelete(id: number) {
    //   this.orderService.softDelete(id).subscribe(() => this.getAllOrders());
  }

  onAdd() {
    this.router.navigate(['dashboard/order/add']);
  }

  viewDetails(deliveryId: number): void {
    this.router.navigate(['dashboard/Order/Details', deliveryId]);
  }

  get filteredOrders(): ReadOrderDTO[] {
    if (!this.searchString.trim()) return this.orders;

    const searchTerm = this.searchString.trim().toLowerCase();

    return this.orders.filter(o => {
      const fieldsToSearch = [
        o.status.toString(),
        o.branchName,
        o.address,
        o.customerName,
        o.orderID?.toString(),
        o.creationDate.toString(),
        o.sellerName,
        o.totalCost.toString(),
        o.totalWeight.toString(),
        o.customerCityName
      ].filter(f => f);

      return fieldsToSearch.some(f =>
        f.toLowerCase().includes(searchTerm)
      );
    });
  }
  onSearchChange(value: string) {
    this.searchString = value;
  }

  getStatusText(status: any): string {
    switch (status) {
      case 1: return 'Pending';
      case 2: return 'Accepted';
      case 3: return 'Rejected';
      case 4: return 'Delivered';
      case 5: return 'With Agent';
      case 6: return 'Unreachable';
      case 7: return 'Postponed';
      case 8: return 'Partial';
      case 9: return 'Canceled';
      case 10: return 'Rejected (Paid)';
      case 11: return 'Rejected (Unpaid)';
      case 12: return 'Rejected (Partial)';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: any): string {
    switch (status) {
      case 1: return 'status-pending';
      case 2: return 'status-accepted';
      case 3:
      case 10:
      case 11:
      case 12:
        return 'status-rejected';
      case 4: return 'status-delivered';
      case 5: return 'status-with-agent';
      case 6: return 'status-unreachable';
      case 7: return 'status-postponed';
      case 8: return 'status-partial';
      case 9: return 'status-canceled';
      default: return 'status-unknown';
    }
  }

  filterDeliveryAgents(order: ReadOrderDTO): IReadDeliveryMan[] {
    const cityName = order.customerCityName ?? '';
    return this.filteredAgents = this.deliveryAgents.filter(agent => agent.cities?.includes(cityName));
  }

  selectAgent(agent: IReadDeliveryMan): void {
    this.selectedAgent = agent;
  }

  assignOrder(orderId: number): void {
    this.orderService.assignDeliveryAgent(orderId, this.selectedAgent?.id ?? 0).subscribe({
      next: (response) => {
        console.log('Agent assigned successfully', response);
        this.selectedAgent = null;
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error assigning agent', error);
      }
    });
  }

  get pagedOrders() {
    return this.orders;
  }

  get totalPages() {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadOrders();
  }
  onItemsPerPageChange(count: number) {
    this.itemsPerPage = count;
    this.currentPage = 1;
    this.loadOrders();
  }

  updateOrderStatus(order: ReadOrderDTO, newstatus: OrderStatus): void {
    this.orderService.changeOrderStatus(order.orderID, newstatus).subscribe({
      next: () => {
        order.status = newstatus;
      },
      error: (err) => {
        console.error('Error updating order status:', err);
      }
    });
  }
  getStatusNumberFromName(status: string | number): number {
    if (typeof status === 'number') return status;
    const enumEntry = Object.entries(OrderStatus).find(([key]) => key === status);
    return enumEntry ? Number(enumEntry[1]) : -1;
  }
}