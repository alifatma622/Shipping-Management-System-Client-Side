import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IBranch } from '../../../Services/branch.service';
import { ICity } from '../../../Services/city.service';
import { EmployeeService } from '../../../Services/Employee-Services/Employee.service';
import { BranchService } from '../../../Services/branch.service';
import { AddEmployeeDTO } from '../../../Models/employee';
import { NgFor, NgIf } from '@angular/common';
import{ReactiveFormsModule} from '@angular/forms';; 
@Component({
  selector: 'app-AddEmployee',
  imports: [RouterModule, NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './AddEmployee.component.html',
  styleUrls: ['./AddEmployee.component.css']
})
export class AddEmployeeComponent implements OnInit {
addForm: FormGroup;
  isSubmitting = false;
  errorMsg = '';
  successMsg = '';
  branches: IBranch[] = [];
  departments: ICity[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private branchService: BranchService,
    private router: Router
  ) {
    this.addForm = this.fb.group({
      name: [
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
      cityIds: [[], [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    this.branchService.getAllBranches().subscribe({
      next: (data) => (this.branches = data),
      error: () => (this.errorMsg = 'Error loading branches'),
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

    // تحويل branchId و cityIds لأرقام والتأكد من صحتهم
    const branchId = Number(this.addForm.value.branchId);

    if (!branchId) {
      this.errorMsg = 'Please select a valid branch.';
      this.isSubmitting = false;
      return;
    }

    const data: AddEmployeeDTO = {
      ...this.addForm.value,
      branchId
    };

    console.log(data);

    this.employeeService.addEmployee(data).subscribe({
      next: () => {
        this.successMsg = 'Employee added successfully!';
        setTimeout(() => this.router.navigate(['/employee']), 1200);
      },
    error: (err) => {
  console.log('Backend error:', err);
  this.errorMsg = err?.error?.error || JSON.stringify(err?.error) || 'Error adding employee!';
  this.isSubmitting = false;
      },
    });
  }

}
