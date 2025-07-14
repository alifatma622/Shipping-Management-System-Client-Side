import { Component, OnInit } from '@angular/core';
import { SellerServiceService } from '../../../../Services/Seller_Service/seller-service.service';
import { ISellerModels } from '../../../../Models/seller_models/iseller-models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthServiceService, PermissionModel } from '../../../../Services/Auth_Services/auth-service.service';
import { Department } from '../../../../Enum/Department';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-all-seller',
  imports: [CommonModule, FormsModule],
  templateUrl: './all-seller.component.html',
  styleUrl: './all-seller.component.css'
})
export class AllSellerComponent implements OnInit {

  sellers: ISellerModels[] = [];

  selectedSellerId: number = 0;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  itemsPerPageOptions = [5, 10, 20, 50];

  permissions: { [departmentId: number]: PermissionModel } = {};
  userRole: string[] = [];

  constructor(private sellerService: SellerServiceService, private router: Router, private authService: AuthServiceService) { }

  ngOnInit(): void {
    this.initializeUserRolesAndPermissions();
  }

  private initializeUserRolesAndPermissions(): void {
    this.userRole = this.authService.getRole();
    const isAdmin = this.authService.hasRole('Admin');
    const role = this.userRole?.find(r => r !== 'Employee') ?? '';

    if (isAdmin) {
      this.getAllSellers();
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
        this.getAllSellers();
      }, err => {
        // Optionally handle error
        this.getAllSellers();
      });
    } else {
      // For Employee role without specific permissions
      this.getAllSellers();
    }
  }

  canAdd(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.Sellers]?.add ?? false;
  }

  canEdit(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.Sellers]?.edit ?? false;
  }

  canDelete(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.Sellers]?.delete ?? false;
  }


  getAllSellers() {

    this.sellerService.getAllSellers(this.pageNumber, this.pageSize).subscribe({

      next: (response) => {
        this.sellers = response.items;
        this.totalPages = response.totalPages;
        console.log(response);
      },
      error: (error) => {
        console.error('Error fetching sellers:', error);
      }

    });
  }


  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageNumber = page;
      this.getAllSellers();
    }
  }



  onItemsPerPageChange(count: number) {
    this.pageSize = count;
    this.pageNumber = 1;
    this.getAllSellers();
  }

  Add() {
    this.router.navigate(['/dashboard/seller/add']);
  }

  edit(id: number) {
    this.router.navigate(['/dashboard/seller/edit', id]);
  }

  delete(id: number) {

    this.sellerService.deleteSeller(id).subscribe(({
      next: () => {
        Swal.fire({
          title: 'Deactivated!',
          text: 'Seller has been deactivated.',
          icon: 'success',
          confirmButtonColor: '#055866',
        });
        this.getAllSellers();
      },
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: err?.error?.message || 'Failed to deactivate seller. Please try again.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }))
  }

  onDelete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This seller will be deactivated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#055866',
      confirmButtonText: 'Yes, deactivate it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.sellerService.deleteSeller(id).subscribe(({
          next: () => {
            Swal.fire({
              title: 'Deactivated!',
              text: 'Seller has been deactivated.',
              icon: 'success',
              confirmButtonColor: '#055866',
            });
            this.getAllSellers();
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: err?.error?.message || 'Failed to deactivate seller. Please try again.',
              icon: 'error',
              confirmButtonColor: '#d33',
            });
          },
        }));
      }
    });
  }
}


