import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { BranchService } from '../../../Services/Branch-Services/branch.service';
import { Router } from '@angular/router';
import { AllBranch } from '../../../Models/Branch/all-branch';
import { AuthServiceService, PermissionModel } from '../../../Services/Auth_Services/auth-service.service';
import { Department } from '../../../Enum/Department';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-all-branch',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-branch.component.html',
  styleUrl: './all-branch.component.css',
})
export class AllBranchComponent implements OnInit {
  allBranches: AllBranch[] = [];
  filteredBranches: AllBranch[] = [];

  searchTerm: string = '';
  permissions: { [departmentId: number]: PermissionModel } = {};
  userRole: string[] = [];
  constructor(private _branchService: BranchService, private _router: Router, private authService: AuthServiceService) {}

  // for test pagination before API Working

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  itemsPerPageOptions: number[] = [5, 10, 15];


  ngOnInit(): void {
    this.initializeUserRolesAndPermissions();
  }

  private initializeUserRolesAndPermissions(): void {
    this.userRole = this.authService.getRole();
    const isAdmin = this.authService.hasRole('Admin');
    const role = this.userRole?.find(r => r !== 'Employee') ?? '';

    if (isAdmin) {
      this.getBranches();
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
        this.getBranches();
      }, err => {
        this.getBranches();
      });
    } else {
      // For Employee role without specific permissions
      this.getBranches();
    }
  }

  canAdd(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.Branches]?.add ?? false;
  }

  canEdit(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.Branches]?.edit ?? false;
  }

  canDelete(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.Branches]?.delete ?? false;
  }

  getBranches(): void {
    this._branchService.getAllBranchesPagination(this.currentPage, this.itemsPerPage).subscribe({
      next: (res) => {
        this.allBranches = res.items;
        this.totalItems = res.totalCount;
        this.applyFilter(); // فلترة الصفحة الحالية
      },
      error: (err) => {
        console.error('Error fetching branches:', err);
      },
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredBranches = [...this.allBranches];
    } else {
      this.filteredBranches = this.allBranches.filter(branch =>
        branch.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onSearch(): void {
    this.applyFilter();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getBranches();
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.getBranches();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onAddBranch(): void {
    this._router.navigate(['dashboard/AddBranch']);
  }

  onEdit(branch: AllBranch): void {
    this._router.navigate(['dashboard/UpdateBranch', branch.id]);
  }

  onDelete(id: number): void {
    Swal.fire({
     title: 'Are you sure?',
          text: 'This branch will be deactivated!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#055866',
          confirmButtonText: 'Yes, deactivate it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._branchService.deleteBranch(id).subscribe({
          next: () => {
            this.getBranches();
            Swal.fire({
               title: 'Deactivated!',
          text: 'Branch has been deactivated.',
          icon: 'success',
          confirmButtonColor: '#055866',
            });
          },
          error: (err) => {
            Swal.fire({
               title: 'Error!',
          text: err?.error?.message || 'Failed to deactivate branch. Please try again.',
          icon: 'error',
          confirmButtonColor: '#d33',
            });
            console.error('Deactivation failed:', err);
          },
        });
      }
    });
  }
}
