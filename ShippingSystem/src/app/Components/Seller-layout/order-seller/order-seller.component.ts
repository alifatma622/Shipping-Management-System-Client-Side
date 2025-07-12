import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Services/Order-Services/Order.service';
import { Router } from '@angular/router';
import { ReadOrderDTO } from '../../../Models/IOrder';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../../Services/Auth_Services/auth-service.service';
import { SellerServiceService } from '../../../Services/Seller_Service/seller-service.service';

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

  totalCount = 0;
  searchString: string = '';

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
        this.orderService.getOrdersBySellerId(sellerId, this.currentPage, this.itemsPerPage).subscribe({
          next: (response) => {
            this.orders = response.items;
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

  get filteredOrders(): ReadOrderDTO[] {
    if (!this.searchString.trim()) return this.orders;

    const searchTerm = this.searchString.trim().toLowerCase();
    return this.orders.filter((o) => {
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

  onAdd() {
    // this.router.navigate(['dashboard/order/add']);
    
    this.router.navigate(['seller-dashboard/add-order']);
  }

  onEdit(id: number) {
    this.router.navigate(['dashboard/order/edit', id]);
  }

  viewDetails(orderId: number) {
    this.router.navigate(['dashboard/order/details', orderId]);
  }
}
