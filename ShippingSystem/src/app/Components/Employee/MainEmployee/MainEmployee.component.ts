import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReadEmployeeDTO } from '../../../Models/IEmployee';
import { EmployeeService } from '../../../Services/Employee-Services/Employee.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  currentPage = 1;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  totalCount = 0;
  constructor(private EmployeeService: EmployeeService, private router: Router) { }
  ngOnInit(): void {
    this.getPaginatedEmployees();
  }

  getAllEmployees() {
    this.isLoading = true;
    this.EmployeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error loading employees!';
        this.isLoading = false;
      }
    });
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
    this.EmployeeService.hardDeleteEmployee(id).subscribe(() => this.getAllEmployees());
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



