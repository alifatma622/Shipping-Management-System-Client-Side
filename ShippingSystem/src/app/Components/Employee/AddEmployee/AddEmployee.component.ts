import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IBranch } from '../../../Services/branch.service';
import { ICity } from '../../../Services/city.service';
import { EmployeeService } from '../../../Services/Employee-Services/Employee.service';
import { BranchService } from '../../../Services/branch.service';
import { AddEmployeeDTO } from '../../../Models/IEmployee';

import{ReactiveFormsModule} from '@angular/forms';import { IRole } from '../../../Models/IRole';
import { RoleService } from '../../../Services/Role-Services/Role.service';
import Swal from 'sweetalert2';
; 
@Component({
  selector: 'app-AddEmployee',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './AddEmployee.component.html',
  styleUrls: ['./AddEmployee.component.css']
})

export class AddEmployeeComponent implements OnInit {
  addForm: FormGroup;
  isSubmitting = false;
  errorMsg = '';
  successMsg = '';
  branches: IBranch[] = [];
  departments: string[] = [];
  excludedDepts = ['DeliveryAgent', 'Seller','Employee']

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private branchService: BranchService,
    private roleService: RoleService,
    private router: Router
  ) {
    this.addForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z\\s]+$'),
        ],
      ],lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z\\s]+$'),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z0-9_]+$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}:;<>.,?]).+$'
          ),
        ],
      ],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')],
      ],
      branchId: ['', [Validators.required, Validators.min(1)]],
      specificRole: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.branchService.getAllBranches().subscribe({
      next: (data) => (this.branches = data,console.log(data)),
      error: () => (this.errorMsg = 'Error loading branches'),
    });
     this.roleService.getAllRoles().subscribe({
      next: (data) => (this.departments = data,this.departments = this.departments.filter(dept => !this.excludedDepts.includes(dept)), console.log(this.departments)),
      
      error: () => (this.errorMsg = 'Error loading departments'),
    });
  }

  onSubmit() {
    this.errorMsg = '';
    this.successMsg = '';
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    // تحويل branchId و roleId لأرقام والتأكد من صحتهم
    const branchId = Number(this.addForm.value.branchId);
    const specificRole = this.addForm.value.specificRole;
    if (!branchId) {
      this.errorMsg = 'Please select a valid branch.';
      this.isSubmitting = false;
      return;
    }
    if (!specificRole) {
      this.errorMsg = 'Please select a valid department.';
      this.isSubmitting = false;
      return;
    }

    const data: AddEmployeeDTO = {
      ...this.addForm.value,
      branchId,
      specificRole
    };

    console.log(data);

    this.employeeService.addEmployee(data).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: 'Employee has been added successfully.',
          icon: 'success',
          confirmButtonColor: '#055866',
        }).then(() => {
          this.router.navigate(['employee']);
        });
      },
    error: (err) => {
  console.log('Backend error:', err);
  this.errorMsg = err?.error?.error || JSON.stringify(err?.error) || 'Error adding employee!';
  this.isSubmitting = false;
      },
    });
  }

}
