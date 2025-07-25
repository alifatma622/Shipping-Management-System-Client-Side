import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Services/Order-Services/Order.service';
import { Router } from '@angular/router';
import { ReadOrderDTO } from '../../../Models/IOrder';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DeliveryManService } from '../../../Services/delivery-man.service';
import { IReadDeliveryMan } from '../../../Models/IDeliveryMan_model';
import { OrderStatus } from '../../../Enum/OrderStatus';
import { AuthServiceService } from '../../../Services/Auth_Services/auth-service.service';

@Component({
  selector: 'app-deliveryman-orders',
  imports: [FormsModule , CommonModule],
  templateUrl: './deliveryman-orders.component.html',
  styleUrl: './deliveryman-orders.component.css'
})
export class DeliverymanOrdersComponent {

  //#region variables
  orders: ReadOrderDTO[] = [];
  isLoading = true;
  errorMsg = '';
  routes: any;
  searchString: string = '';

  selectedStatus: string = ''; // أضفت هذا المتغير

  selectedOrderId: number = 0;
  deliveryAgents: IReadDeliveryMan[] = [];
  filteredAgents: IReadDeliveryMan[] = [];
  selectedAgent: IReadDeliveryMan | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  totalCount = 0;

  OrderStatus = OrderStatus;
  orderStatuses = Object.values(OrderStatus).filter(v => !isNaN(Number(v))&& Number(v) !== 1) as number[];

  userId:string|null='';
  deliveryId:number=0;
  //#endregion


  constructor(
    private orderService: OrderService,
    private router: Router,
    private deliveryService: DeliveryManService,

    private authService: AuthServiceService
  ) {}

  //#region init
  ngOnInit(): void {
     this.userId = this.getUserId();


    // First get the delivery ID, THEN load orders
    this.deliveryService.getId(this.userId).subscribe({
      next: (deliveryId) => {
        this.deliveryId = deliveryId;
        this.loadOrders();
      },
      error: (err) => {
        this.errorMsg = 'Failed to load delivery ID';
        this.isLoading = false;
      }
    });

  }

  loadOrders() {
    this.isLoading = true;


    this.deliveryService.getOrdersByDeliveryAgent(
      this.deliveryId,
      this.currentPage,
      this.itemsPerPage,
      this.selectedStatus // أضفت هذا الباراميتر

    ).subscribe({
      next: (response) => {
        // Add showStatusDropdown property to each order
        this.orders = response.items.map(order => ({
          ...order,
          status: this.getStatusNumberFromName(order.status), // always a number
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


  // أضفت دالة onStatusChange
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
  //#endregion

  //#region search
  get filteredOrders(): ReadOrderDTO[] {
    let filtered = this.orders;

    // 1. Filter by status if selected
    if (this.selectedStatus) {
      filtered = filtered.filter(o => o.status === Number(this.selectedStatus));
    }

    // 2. Filter by search string (on other fields)
    if (this.searchString.trim()) {
      const searchTerm = this.searchString.trim().toLowerCase();
      filtered = filtered.filter((o) => {
        const fieldsToSearch = [
          o.branchName,
          o.address,
          o.customerName,
          o.orderID?.toString(),
          o.creationDate.toString(),
          o.sellerName,
          o.totalCost.toString(),
          o.totalWeight.toString(),
          o.customerCityName
        ].filter(Boolean);

        return fieldsToSearch.some((f) => f!.toLowerCase().includes(searchTerm));
      });
    }

    return filtered;
  }

  onSearchChange(value: string) {
    this.searchString = value;
  }
  //#endregion

  //#region status text & classes
  getStatusText(status: any): string {
    // console.log(status);
    switch (status) {
      // case 1: return 'Pending';
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
    // console.log(status)
    switch (status) {
      // case 1: return 'status-pending';
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

  //#endregion

  //#region assign agent

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
  //#endregion

  //#region pagination

  get pagedOrders() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredOrders.slice(start, end);
  }
  

  get totalPages() {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
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
  //#endregion

  //#region update status
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
    if (typeof status === 'number') return status; // Already a number, return as is

    const enumEntry = Object.entries(OrderStatus).find(([key]) => key === status);
    return enumEntry ? Number(enumEntry[1]) : -1; // Return -1 or a fallback value
  }
  //#endregion

  getUserId(){
   return this.authService.getUserId();
  }

}



