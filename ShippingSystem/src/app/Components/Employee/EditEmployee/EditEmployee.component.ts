import { Component, OnInit } from '@angular/core';
import { AddEmployeeComponent } from '../AddEmployee/AddEmployee.component';
import { AddEmployeeDTO, ReadEmployeeDTO } from '../../../Models/IEmployee';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BranchService, IBranch } from '../../../Services/branch.service';
import { EmployeeService } from '../../../Services/Employee-Services/Employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../../Services/Role-Services/Role.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-EditEmployee',
  imports :[NgIf, NgFor, ReactiveFormsModule,CommonModule],
  templateUrl: './EditEmployee.component.html',
  styleUrls: ['./EditEmployee.component.css']
})
export class EditEmployeeComponent implements OnInit {
 editForm: FormGroup;
  isSubmitting = false;
  isLoading = false;
  errorMsg = '';
  successMsg = '';
  // department:string = '' ;
  branches: IBranch[] = [];
  departments:string[] = [];
  employeeId: number | null = null;
  excludedDepts = ['DeliveryAgent', 'Seller','Employee']

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private branchService: BranchService,
    private roleService:RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z\\s]+$')]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z\\s]+$')]],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30), Validators.pattern('^[a-zA-Z0-9_]+$')]],
      password: ['', [
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}:;<>.,?]).+$')
      ]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')]],
      branchId: [null, [Validators.required, Validators.min(1)]],
      specificRole: [[], [Validators.required, Validators.min(1)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.loadEmployeeData();
  }

  private loadInitialData(): void {
    // Load branches
    this.branchService.getAllBranches().subscribe({
      next: (data) => this.branches = data,
      error: (err) => {
        console.error('Error loading branches:', err);
        this.errorMsg = 'Error loading branches. Please refresh the page.';
      }
    });

    // Load roles
    this.roleService.getAllRoles().subscribe({
      next: (data) => (this.departments = data,this.departments = this.departments.filter(dept => !this.excludedDepts.includes(dept)), console.log(this.departments)),
      error: (err) => {
        console.error('Error loading departments:', err);
        this.errorMsg = 'Error loading departments. Please refresh the page.';
      }
    });
  }

  private loadEmployeeData(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id ==='1'){
        this.errorMsg = 'You cannot edit the main admin account.';
        setTimeout(() => this.router.navigate(['dashboard/employee']), 2000);
        return;
      }
      if (id) {
        this.employeeId = +id;
        this.loadEmployee(+id);
      } else {
        this.errorMsg = 'Invalid employee ID.';
        setTimeout(() => this.router.navigate(['dashboard/employee']), 2000);
      }
    });
  }

  loadEmployee(id: number) {
    this.isLoading = true;
    this.errorMsg = '';

    this.employeeService.getEmployeeById(id).subscribe({
      next: (data: ReadEmployeeDTO) => {
        this.editForm.patchValue({
          firstName: data.firstName || '',
          lastName: data.firstName || '',
          email: data.email || '',
          userName: data.userName || '',
          phoneNumber: data.phoneNumber || '',
          branchId: data.branchId ? Number(data.branchId) : null,
          specificRole: data.specificRole,
          isActive: !data.isDeleted,
          password:data.password
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading delivery man:', err);
        this.errorMsg = 'Failed to load delivery man data. Please try again.';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['dashboard/employee']), 2000);
      }
    });
  }

  onSubmit() {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.editForm.invalid || !this.employeeId) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const data: AddEmployeeDTO = {
      ...this.editForm.value,
      branchId: Number(this.editForm.value.branchId),
      department: this.editForm.value.department,
      isActive: this.editForm.value.isActive
    };

    // if (!data.password || data.password.trim() === '') {
    //   delete data.password;
    // }

    console.log('Sending data to backend:', data);

    this.employeeService.updateEmployee(this.employeeId, data).subscribe({
      next: (res) => {
        this.successMsg = ' Employee updated successfully!';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['dashboard/employee']), 1200);
      },
      error: (err) => {
        console.error('Backend error:', err);
        this.isSubmitting = false;

        if (err?.error?.details) {
          this.errorMsg = JSON.stringify(err.error.details, null, 2);
        } else if (err?.error?.error) {
          this.errorMsg = err.error.error;
        } else if (err?.status === 404) {
          this.errorMsg = 'Delivery man not found.';
        } else if (err?.status === 409) {
          this.errorMsg = 'Username or email already exists.';
        } else {
          this.errorMsg = 'Error updating employee. Please try again.';
        }
      }
    });
  }

  // Helper method to check if form field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  // Helper method to get field error message
  getFieldErrorMessage(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${fieldName} is required.`;
    if (field.errors['email']) return 'Please enter a valid email address.';
    if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters.`;
    if (field.errors['maxlength']) return `${fieldName} must be at most ${field.errors['maxlength'].requiredLength} characters.`;
    if (field.errors['pattern']) return `${fieldName} format is invalid.`;
    if (field.errors['min']) return `${fieldName} must be at least ${field.errors['min'].min}.`;

    return `${fieldName} is invalid.`;
  }

  goToEmployeeList() {
    this.router.navigate(['dashboard/employee']);
  }

}
