import { Component, OnInit } from '@angular/core';
import { IRole } from '../../../Models/IRole';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleService } from '../../../Services/Role-Services/Role.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-Roles-list',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './Roles-list.component.html',
  styleUrls: ['./Roles-list.component.css']
})
export class RolesListComponent implements OnInit {
  roles: string[] = [];
  filteredRoles: string[] = [];
  searchName = '';
  isLoading = true;
  errorMsg = '';

  // Form-related fields
  roleForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  // Pagination-related fields
  currentPage = 1;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  totalCount = 0;

  constructor(
    private roleService: RoleService,
    private fb: FormBuilder,
    private router:Router,
     private route: ActivatedRoute 
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getRoles();
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.getRoles();
  }

  private initForm(): void {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  totalPages(): number[] {
    return Array(Math.ceil(this.totalCount / this.itemsPerPage)).fill(0).map((_, i) => i + 1);
  }

  get name() {
    return this.roleForm.get('name');
  }
  isFormVisible = false;
  getRoles(): void {
    this.roleService.getRolesPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.roles = data.items;
        this.filteredRoles = data.items;
        this.totalCount = data.totalCount;
        this.isLoading = false;
        console.log(this.roles)
        
      },
      error: () => {
        this.errorMsg = 'Failed to load roles';
        this.filteredRoles = [];
        this.isLoading = false;
      }
    });
  }

  onSearchChange(value: string): void {
    const searchValue = value.toLowerCase();
    this.filteredRoles = this.roles.filter(g =>
      g.toLowerCase().includes(searchValue)
    );
  }

  onItemsPerPageChange(count: number): void {
    this.itemsPerPage = count;
    this.currentPage = 1;
    this.getRoles();
  }


  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const newRole = this.roleForm.value.name.trim()
    
    console.log(newRole)
    this.roleService.addRole(newRole).subscribe({
      next: () => {
        this.successMessage = 'Role added successfully!';
        this.roleForm.reset();
        this.getRoles();
      },
      error: (error) => {
        this.errorMessage = 'Failed to add role.';
        console.error(error);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }



onDelete(roleName: string): void {
  Swal.fire({
    title: 'Are you sure?',
    text: `This will permanently delete the role "${roleName}".`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#055866',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.roleService.hardDeleteRole(roleName).subscribe({
        next: () => {
          this.getRoles();
          Swal.fire({
            title: 'Deleted!',
            text: `Role "${roleName}" was successfully deleted.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete the role.',
            icon: 'error',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
  });
}


oldRoleName: string | null = null;
newRoleName: string = '';
  startEdit(role: string): void {
      this.oldRoleName = role;      
  this.newRoleName = role; 
  }

  cancelEdit(): void {
   this.oldRoleName = null;
  this.newRoleName = '';
  }

 saveEdit(): void {
  if (this.newRoleName.trim() && this.oldRoleName) {
    this.roleService.updateRole(this.oldRoleName, this.newRoleName.trim()).subscribe({
      next: () => {
        const index = this.filteredRoles.indexOf(this.oldRoleName!);
        if (index !== -1) {
          this.filteredRoles[index] = this.newRoleName.trim();
        }
        this.cancelEdit();
        this.successMessage = "Role updated successfully.";
      },
      error: () => {
        this.errorMessage = "Failed to update role.";
      }
    });
  }
}

  private markAllAsTouched(): void {
    Object.values(this.roleForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  goToUpdatePermissions(roleName: string) {
  // Navigate to the permission page with role name as a parameter
  this.router.navigate(['../permissions', roleName], { relativeTo: this.route });
}

}

