import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Services/Order-Services/Order.service';
import { Router } from '@angular/router';
import { ReadOrderDTO } from '../../../Models/IOrder';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../../Services/Auth_Services/auth-service.service';
import { SellerServiceService } from '../../../Services/Seller_Service/seller-service.service';
import { OrderStatus } from '../../../Enum/OrderStatus';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-seller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-seller.component.html',
  styleUrl: './order-seller.component.css'
})
export class OrderSellerComponent implements OnInit {
  orders: ReadOrderDTO[] = [];
  isLoading = false;
  errorMsg = '';
  currentPage = 1;
  itemsPerPage = 10;

  itemsPerPageOptions = [5, 10, 20, 50];
  selectedOrderId: number = 0;

  totalCount = 0;
  searchString: string = '';
  selectedStatus: string = '';

  OrderStatus = OrderStatus;
  orderStatuses = Object.values(OrderStatus).filter(v => !isNaN(Number(v))) as number[];

  constructor(
    private orderService: OrderService,
    private authService: AuthServiceService,
    private sellerService: SellerServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchSellerOrders();
  }

  fetchSellerOrders() {
    this.isLoading = true;

    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMsg = 'No token found';
      this.isLoading = false;
      return;
    }

    let userId = '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch (e) {
      console.error("Failed to parse token", e);
      this.errorMsg = 'Invalid token';
      this.isLoading = false;
      return;
    }

    this.sellerService.getSellerByUserId(userId).subscribe({
      next: (seller) => {
        const sellerId = seller.id;
        this.orderService.getOrdersBySeller(sellerId, this.currentPage, this.itemsPerPage).subscribe({
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
            this.errorMsg = 'Error fetching orders!';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.errorMsg = 'Failed to get seller data.';
        this.isLoading = false;
      }
    });
  }

  // ------------------------
  // Pagination + Search Logic
  // ------------------------

  onSearchChange(value: string) {
    this.searchString = value;
  }

  onStatusChange() {
    this.currentPage = 1;
    // If you want to reload from server, call fetchSellerOrders();
    // Otherwise, just let the filteredOrders getter do the work.
  }

  get filteredOrders(): ReadOrderDTO[] {
    let filtered = this.orders;

    // Filter by status if selected
    if (this.selectedStatus) {
      filtered = filtered.filter(o => o.status?.toString() === this.selectedStatus);
    }

    // Filter by search string
    if (this.searchString.trim()) {
      const searchTerm = this.searchString.trim().toLowerCase();
      filtered = filtered.filter((o) => {
        const fieldsToSearch = [
          o.orderID?.toString(),
          o.totalWeight?.toString(),
          o.totalCost?.toString(),
          o.address,
          o.branchName,
        ].filter(Boolean);

        return fieldsToSearch.some((f) => f!.toLowerCase().includes(searchTerm));
      });
    }

    return filtered;
  }

  get pagedOrders(): ReadOrderDTO[] {
    return this.filteredOrders;
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchSellerOrders();
  }

  onItemsPerPageChange(count: number) {
    this.itemsPerPage = count;
    this.currentPage = 1;
    this.fetchSellerOrders();
  }

  trackByOrderId(index: number, order: ReadOrderDTO): number {
    return order.orderID;
  }

  // ------------------------
  // Navigation Actions
  // ------------------------

  getStatusText(status: any): string {
    console.log(status);
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


  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'status-pending';
      case 2: return 'status-accepted';
      case 3: return 'status-rejected';
      case 4: return 'status-delivered';
      case 5: return 'status-with-agent';
      case 6: return 'status-unreachable';
      case 7: return 'status-postponed';
      case 8: return 'status-partial';
      case 9: return 'status-canceled';
      case 10: return 'status-rejected-paid';
      case 11: return 'status-rejected-unpaid';
      case 12: return 'status-rejected-partial';
      default: return '';
    }
  }

  updateOrderStatus(order: ReadOrderDTO, newStatus: OrderStatus): void {
    this.orderService.changeOrderStatus(order.orderID, newStatus).subscribe({
      next: () => {
        order.status = newStatus;
      },
      error: (err) => {
        console.error('Error updating order status:', err);
      }
    });
  }

  onAdd() {
    // this.router.navigate(['dashboard/order/add']);

    this.router.navigate(['dashboard/add-order-seller']);
  }

  onEdit(id: number) {
    this.router.navigate(['dashboard/Order/Edit', id]);
  }

  viewDetails(orderId: number) {
    this.router.navigate(['dashboard/Order/Details', orderId]);
  }

  getStatusNumberFromName(status: string | number): number {
    if (typeof status === 'number') return status;
    // Map string names to numbers using the OrderStatus enum
    const enumEntry = Object.entries(OrderStatus).find(([key, value]) => key === status);
    if (enumEntry) return enumEntry[1] as number;
    return 0; // or another fallback value
  }

  onDelete(id: number) {
      Swal.fire({
                title: 'Are you sure?',
                text: 'This order will be canceled!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#055866',
                confirmButtonText: 'Yes, cancel it!',
              }).then((result) => {
                if (result.isConfirmed) {
        this.orderService.changeOrderStatus(id, OrderStatus.CanceledByCustomer).subscribe({
      next: () => {
                Swal.fire({
                  title: 'Canceled!',
                  text: 'Order has been canceled.',
                  icon: 'success',
                  confirmButtonColor: '#055866',
                });
                this.fetchSellerOrders();
              },
              error: (err) => {
                Swal.fire({
                  title: 'Error!',
                  text: err?.error?.message || 'Failed to cancel order. Please try again.',
                  icon: 'error',
                  confirmButtonColor: '#d33',
                });
            },
          });
        }
      });
    }
}
