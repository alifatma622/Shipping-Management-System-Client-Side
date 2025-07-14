import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReadEmployeeDTO } from '../../../Models/IEmployee';
import { EmployeeService } from '../../../Services/Employee-Services/Employee.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthServiceService , PermissionModel } from '../../../Services/Auth_Services/auth-service.service';
import { Department } from '../../../Enum/Department';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-MainEmployee',
  imports: [RouterModule, FormsModule, FormsModule, CommonModule],
  templateUrl: './MainEmployee.component.html',
  styleUrls: ['./MainEmployee.component.css']
})
export class MainEmployeeComponent implements OnInit {
  public employees: ReadEmployeeDTO[] = [];
  isLoading = true;
  errorMsg = '';
  routes: any;
  searchString: string = '';
  selectedEmpId: number = 0;
  permissions: { [departmentId: number]: PermissionModel } = {};
  userRole: string[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  totalCount = 0;
  constructor(private EmployeeService: EmployeeService, private router: Router , private authService : AuthServiceService) { }
  ngOnInit(): void {
    this.initializeUserRolesAndPermissions();
  }

  private initializeUserRolesAndPermissions(): void {
    this.userRole = this.authService.getRole();
    const isAdmin = this.authService.hasRole('Admin');
    const role = this.userRole?.find(r => r !== 'Employee') ?? '';

    if (isAdmin) {
      this.getPaginatedEmployees();
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
        this.getPaginatedEmployees();
      }, err => {
        this.errorMsg = 'Error loading permissions';
        this.isLoading = false;
      });
    } else {
      // For Employee role without specific permissions
      this.getPaginatedEmployees();
    }
  }

  // getAllEmployees() {
  //   this.isLoading = true;
  //   this.EmployeeService.getAllEmployees().subscribe({
  //     next: (data) => {
  //       this.employees = data;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       this.errorMsg = 'Error loading employees!';
  //       this.isLoading = false;
  //     }
  //   });
  // }

  canAdd(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.Employees]?.add ?? false;
  }

  canEdit(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.Employees]?.edit ?? false;
  }

  canDelete(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.Employees]?.delete ?? false;
  }

  getPaginatedEmployees() {
    this.isLoading = true;
    this.EmployeeService.getPaginatedEmployees(this.currentPage,
      this.itemsPerPage).subscribe({
        next: (response) => {
          this.employees = response.items;
          this.totalCount = response.totalCount;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMsg = 'Error loading employees';
          this.isLoading = false;
        }
      });
  }

  onEdit(id: number) {
    this.router.navigate(['dashboard/employee/edit', id]);
  }

  onDelete(id: number) {
     Swal.fire({
          title: 'Are you sure?',
          text: 'This employee will be deactivated!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#055866',
          confirmButtonText: 'Yes, deactivate it!',
        }).then((result) => {
          if (result.isConfirmed) {
    this.EmployeeService.softDeleteEmployee(id).subscribe({
      next: () => {
        Swal.fire({
          title: 'Deactivated!',
          text: 'Employee has been deactivated.',
          icon: 'success',
          confirmButtonColor: '#055866',
        });
        this.getPaginatedEmployees();
      },
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: err?.error?.message || 'Failed to deactivate employee. Please try again.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
          },
        });
      }
    });
  }

  onAdd() {
    this.router.navigate(['dashboard/employee/add']);
  }

  get filteredEmployees(): ReadEmployeeDTO[] {
    if (!this.searchString.trim()) return this.employees;

    const searchTerm = this.searchString.trim().toLowerCase();

    return this.employees.filter(e => {
      // Convert all searchable fields to lowercase strings for comparison
      const fieldsToSearch = [
        e.firstName,
        e.lastName,
        e.branch,
        e.email,
        e.phoneNumber,
        e.specificRole,
        e.userName
        // Add more fields as needed
      ].filter(f => f); // Remove undefined/null values

      return fieldsToSearch.some(f =>
        f?.toLowerCase().includes(searchTerm)
      );
    });
  }
  onSearchChange(value: string) {
    this.searchString = value;
  }



  //#region pagination

  get pagedEmps() {
    return this.employees;
  }

  get totalPages() {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getPaginatedEmployees();
  }

  onItemsPerPageChange(count: number) {
    this.itemsPerPage = count;
    this.currentPage = 1;
    this.getPaginatedEmployees();
  }
  //#endregion
}



