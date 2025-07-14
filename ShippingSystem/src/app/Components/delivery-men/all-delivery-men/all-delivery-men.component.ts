import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryManService } from './../../../Services/delivery-man.service';
import { IReadDeliveryMan } from '../../../Models/IDeliveryMan_model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthServiceService, PermissionModel } from '../../../Services/Auth_Services/auth-service.service';
import { Department } from '../../../Enum/Department';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-all-delivery-men',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-delivery-men.component.html',
  styleUrls: ['./all-delivery-men.component.css'],

})
export class AllDeliveryMenComponent implements OnInit {
  deliveryMen: IReadDeliveryMan[] = [];
  isLoading = true;
  errorMsg = '';
  routes: any;
  searchUserName: string = '';

  currentPage = 1;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  totalCount = 0;
  selectedManId:number =0;
  permissions: { [departmentId: number]: PermissionModel } = {};
  userRole: string[] = [];
  constructor(private deliveryManService: DeliveryManService, private router: Router, private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.initializeUserRolesAndPermissions();
  }

  private initializeUserRolesAndPermissions(): void {
    this.userRole = this.authService.getRole();
    const isAdmin = this.authService.hasRole('Admin');
    const role = this.userRole?.find(r => r !== 'Employee') ?? '';

    if (isAdmin) {
      this.getPaginatedDelivery();
      return;
    }

    if (role && role !== 'Employee') {
      const departmentIds = Object.values(Department).filter(v => typeof v === 'number') as number[];
      const permissionCalls = departmentIds.map(depId =>
        this.authService.getPermissionFromApi(role, depId)
      );
      forkJoin(permissionCalls).subscribe(results => {
        results.forEach(p => {
          this.permissions[p.department] = p;
        });
        this.getPaginatedDelivery();
      }, err => {
        this.errorMsg = 'Error loading permissions';
        this.isLoading = false;
      });
    } else {
      // For Employee role without specific permissions
      this.getPaginatedDelivery();
    }
  }

  canAdd(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.DeliveryMen]?.add ?? false;
  }

  canEdit(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.DeliveryMen]?.edit ?? false;
  }

  canDelete(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.DeliveryMen]?.delete ?? false;
  }

  // getAllDeliveryMen() {
  //   this.isLoading = true;
  //   this.deliveryManService.getAllDeliveryMen().subscribe({
  //     next: (data) => {
  //       this.deliveryMen = data;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       this.errorMsg = 'Error loading delivery agents!';
  //       this.isLoading = false;
  //     }
  //   });
  // }

  getPaginatedDelivery(){
    this.isLoading = true;
    this.deliveryManService.getAllPaginated(this.currentPage,
      this.itemsPerPage).subscribe({
        next: (response) => {
          this.deliveryMen = response.items;
          this.totalCount = response.totalCount;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMsg = 'Error loading delivery agents';
          this.isLoading = false;
        }
      });
  }
  onEdit(id: number) {
    this.router.navigate(['dashboard/delivery-men/edit', id]);
  }

  onDelete(id: number) {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: "You won't be able to revert this! This will permanently delete the delivery agent from the database.",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#d33',
    //   cancelButtonColor: '#3085d6',
    //   confirmButtonText: 'Yes, delete it!',
    //   cancelButtonText: 'Cancel'
    // }).then((result) => {
      // if (result.isConfirmed) {
        this.deliveryManService.softDelete(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deactivated!',
              text: 'Delivery agent has been deactivated.',
              icon: 'success',
              confirmButtonColor: '#055866',
            });
            this.getPaginatedDelivery();
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: err?.error?.message || 'Failed to deactivate delivery agent. Please try again.',
              icon: 'error',
              confirmButtonColor: '#d33',
            });
          }
        });
      }
    // });
  // }

  onAdd() {
    this.router.navigate(['dashboard/delivery-men/add']);
  }

  get filteredDeliveryMen(): IReadDeliveryMan[] {
    if (!this.searchUserName.trim()) return this.deliveryMen;
    return this.deliveryMen.filter(man =>
      man.userName?.toLowerCase().includes(this.searchUserName.trim().toLowerCase())
    );
  }
  onSearchChange(value: string) {
    this.searchUserName = value;
  }

  //#region pagination

  get pagedDelivery() {
    return this.deliveryMen;
  }

  get totalPages() {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getPaginatedDelivery();
  }
  onItemsPerPageChange(count: number) {
    this.itemsPerPage = count;
    this.currentPage = 1;
    this.getPaginatedDelivery();
  }
  //#endregion
}
