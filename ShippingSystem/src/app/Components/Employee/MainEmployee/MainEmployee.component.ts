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
  public employees:ReadEmployeeDTO[] =[];
  isLoading = true;
  errorMsg = '';
  routes: any;
  searchUserName: string = '';
  selectedEmpId: number =0;

      currentPage = 1;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  totalCount = 0;
  constructor(private EmployeeService:EmployeeService,private router: Router) { }
ngOnInit(): void {
    this.getAllEmployees();
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
    if (!this.searchUserName.trim()) return this.employees;
    return this.employees.filter(emp =>
      emp.userName?.toLowerCase().includes(this.searchUserName.trim().toLowerCase())
    );
  }
  onSearchChange(value: string) {
    this.searchUserName = value;
  }

  

//#region pagination

get pagedOrders() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.filteredEmployees.slice(start, start + this.itemsPerPage);
}

get totalPages() {
  return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
}

onPageChange(page: number) {
  this.currentPage = page;
}

onItemsPerPageChange(count: number) {
  this.itemsPerPage = count;
  this.currentPage = 1;
}
//#endregion
}



