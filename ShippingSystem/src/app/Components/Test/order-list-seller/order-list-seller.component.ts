import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Services/Order-Services/Order.service';
import { Router } from '@angular/router';
import { ReadOrderDTO } from '../../../Models/IOrder';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list-seller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list-seller.component.html',
  styleUrl: './order-list-seller.component.css',
})
export class OrderListSellerComponent implements OnInit {
  orders: ReadOrderDTO[] = [];
  isLoading = false;
  errorMsg = '';
  searchString: string = '';

  currentPage = 1;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  totalCount = 0;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    // When API Working Remove Comment For This Code
    //   this.isLoading = true;
    //   this.orderService.getOrders().subscribe({ اضبطي هنا بس ي جهاد حته الاوردر ال تظهر ليه هي بتاعته بس
    //     next: (data) => {
    //       this.orders = data;
    //       this.isLoading = false;
    //     },
    //     error: (err) => {
    //       this.errorMsg = 'Error loading orders!';
    //       this.isLoading = false;
    //     }
    //   });

    // Remove This When API  Working This For Test only
    this.orders = [
      {
        orderID: 1,
        notes: 'Leave at door',
        customerName: 'Ahmed Youssef',
        customerPhone: '01012345678',
        customerCityName: 'Cairo',
        sellerName: 'Mohamed Ali',
        sellerCityName: 'Giza',
        deliveryAgentName: null,
        branchName: 'Cairo Branch',
        isShippedToVillage: false,
        address: '123 Main St',
        creationDate: new Date().toISOString(),
        status: 1,
        shippingType: 'Standard',
        orderType: 'Normal',
        paymentType: 'Cash',
        isPickup: false,
        isActive: true,
        isDeleted: false,
        shippingCost: 30,
        totalCost: 150,
        totalWeight: 12.5,
        showStatusDropdown: false,
      },
      {
        orderID: 2,
        notes: '',
        customerName: 'Salma Khaled',
        customerPhone: '01198765432',
        customerCityName: 'Alexandria',
        sellerName: 'Eman Samir',
        sellerCityName: 'Cairo',
        deliveryAgentName: 'Mostafa Omar',
        branchName: 'Alex Branch',
        isShippedToVillage: true,
        address: '456 Nile Ave',
        creationDate: new Date().toISOString(),
        status: 2,
        shippingType: 'Express',
        orderType: 'Gift',
        paymentType: 'Credit Card',
        isPickup: true,
        isActive: true,
        isDeleted: false,
        shippingCost: 50,
        totalCost: 200,
        totalWeight: 9.7,
        showStatusDropdown: false,
      },
      {
        orderID: 3,
        notes: 'Call before delivery',
        customerName: 'Hany Farid',
        customerPhone: '01234567890',
        customerCityName: 'Mansoura',
        sellerName: 'Ali Saleh',
        sellerCityName: 'Tanta',
        deliveryAgentName: null,
        branchName: 'Delta Branch',
        isShippedToVillage: false,
        address: '789 Freedom Rd',
        creationDate: new Date().toISOString(),
        status: 4,
        shippingType: 'Standard',
        orderType: 'Return',
        paymentType: 'Wallet',
        isPickup: false,
        isActive: true,
        isDeleted: false,
        shippingCost: 25,
        totalCost: 100,
        totalWeight: 7.3,
        showStatusDropdown: false,
      },
    ];

    this.totalCount = this.orders.length;
    this.isLoading = false;
  }

  onAdd() {
    this.router.navigate(['dashboard/order/add']);
  }

  onEdit(id: number) {
    this.router.navigate(['dashboard/order/edit', id]);
  }

  viewDetails(orderId: number) {
    this.router.navigate(['dashboard/order/details', orderId]);
  }

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
    this.loadOrders();
  }

  onItemsPerPageChange(count: number) {
    this.itemsPerPage = count;
    this.currentPage = 1;
    this.loadOrders();
  }

  trackByOrderId(index: number, order: ReadOrderDTO): number {
    return order.orderID;
  }
}
