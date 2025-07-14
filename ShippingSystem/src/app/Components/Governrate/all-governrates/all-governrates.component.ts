import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GovernratesService, Governrate } from '../../../Services/Governrates/governrates.service';
import Swal from 'sweetalert2';
import { AuthServiceService, PermissionModel } from '../../../Services/Auth_Services/auth-service.service';
import { Department } from '../../../Enum/Department';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-governrates-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './all-governrates.component.html',
  styleUrls: ['./all-governrates.component.css']
})
export class GovernratesListComponent implements OnInit {
  governrates: Governrate[] = [];
  filteredGovernrates: Governrate[] = [];
  searchName = '';
  isLoading = true;
  errorMsg = '';

  // Form-related fields
  governrateForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  // Pagination-related fields
  currentPage = 1;
  itemsPerPage = 10;
  itemsPerPageOptions = [5, 10, 20, 50];
  totalCount = 0;

  permissions: { [departmentId: number]: PermissionModel } = {};
  userRole: string[] = [];

  constructor(
    private governratesService: GovernratesService,
    private fb: FormBuilder,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.initializeUserRolesAndPermissions();
  }

  private initializeUserRolesAndPermissions(): void {
    this.userRole = this.authService.getRole();
    const isAdmin = this.authService.hasRole('Admin');
    const role = this.userRole?.find(r => r !== 'Employee') ?? '';

    if (isAdmin) {
      this.initForm();
      this.getGovernrates();
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
        this.initForm();
        this.getGovernrates();
      }, err => {
        this.initForm();
        this.getGovernrates();
      });
    } else {
      // For Employee role without specific permissions
      this.initForm();
      this.getGovernrates();
    }
  }

  canAdd(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.Governorates]?.add ?? false;
  }

  canEdit(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.Governorates]?.edit ?? false;
  }

  canDelete(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.Governorates]?.delete ?? false;
  }

  onPageChange(page: number): void {
  this.currentPage = page;
  this.getGovernrates();
 }

  private initForm(): void {
    this.governrateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  totalPages(): number[] {
  return Array(Math.ceil(this.totalCount / this.itemsPerPage)).fill(0).map((_, i) => i + 1);
}

  get name() {
    return this.governrateForm.get('name');
  }
  isFormVisible = false;
  getGovernrates(): void {
    this.governratesService.getAllGovernrates(this.currentPage , this.itemsPerPage).subscribe({
      next: (data) => {
        this.governrates = data.items;
        this.filteredGovernrates = data.items;
        this.totalCount = data.totalCount;
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load governorates';
        this.filteredGovernrates = [];
        this.isLoading = false;
      }
    });
  }

  onSearchChange(value: string): void {
  const searchValue = value.toLowerCase();
  this.filteredGovernrates = this.governrates.filter(g =>
    g.name.toLowerCase().includes(searchValue)
  );
  }

  onItemsPerPageChange(count: number): void {
  this.itemsPerPage = count;
  this.currentPage = 1;
  this.getGovernrates();
}


  onSubmit(): void {
    if (this.governrateForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const newGovernrate = {
      name: this.name?.value.trim()
    };

    this.governratesService.addGovernrate(newGovernrate).subscribe({
      next: () => {
        this.successMessage = 'Governorate added successfully!';
        this.governrateForm.reset();
        this.getGovernrates(); // Refresh list
      },
      error: (error) => {
        this.errorMessage = 'Failed to add governorate.';
        console.error(error);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

editedGovernorateStatus: { [id: number]: boolean } = {};

toggleStatus(gov: Governrate): void {
  // Just toggle the local copy for visual feedback
  this.editedGovernorateStatus[gov.id] = !this.getEditedStatus(gov);
}


  onDelete(id: number): void {
   Swal.fire({
         title: 'Are you sure?',
         text: "This governorate will be deactivated!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#d33',
         cancelButtonColor: '#055866',
         confirmButtonText: 'Yes, deactivate it',
         cancelButtonText: 'Cancel'
       }).then((result) => {
         if (result.isConfirmed) {
           this.governratesService.deleteGovernrate(id).subscribe({
             next: () => {
               Swal.fire({
                 title: 'Deactivated!',
                 text: 'Governorate has been deactivated.',
                 icon: 'success',
                 confirmButtonColor: '#055866',
               });
               this.getGovernrates();
             },
             error: (err) => {
               Swal.fire({
                 title: 'Error!',
                 text: err?.error?.message || 'Failed to governorate agent. Please try again.',
                 icon: 'error',
                 confirmButtonColor: '#d33',
               });
             }
           });
         }
       });
     }
   

  editingId: number | null = null;

startEdit(id: number): void {
  this.editingId = id;
}

cancelEdit(): void {
  this.editingId = null;
}

// saveEdit(governorate: Governrate): void {
//   const updatedGov = { name: governorate.name };

//   this.governratesService.updateGovernrate(governorate.id, updatedGov).subscribe({
//     next: () => {
//       this.successMessage = 'Governorate updated successfully!';
//       this.editingId = null;
//       setTimeout(() => this.successMessage = '', 3000);
//     },
//     error: () => {
//       this.errorMessage = 'Failed to update governorate.';
//       setTimeout(() => this.errorMessage = '', 3000);
//     }
//   });
// }
saveEdit(gov: Governrate): void {
  const updatedName = gov.name.trim();
  const originalStatus = gov.isDeleted;
  const newStatus = this.getEditedStatus(gov);

  // Validation
  if (!updatedName || updatedName.length < 2 || updatedName.length > 100) {
    this.errorMessage = 'Governorate name is invalid.';
    return;
  }

  // Call update endpoint
  this.governratesService.updateGovernrate(gov.id, { name: updatedName }).subscribe({
    next: () => {
      gov.name = updatedName;

      if (originalStatus !== newStatus) {
        this.governratesService.activateGovernorate(gov.id).subscribe({
          next: () => {
            gov.isDeleted = newStatus;
            this.successMessage = `Governorate updated successfully.`;
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: () => {
            this.errorMessage = 'Status change failed.';
            setTimeout(() => this.errorMessage = '', 3000);
          }
        });
      } else {
        this.successMessage = `Governorate updated successfully.`;
        setTimeout(() => this.successMessage = '', 3000);
      }

      this.editingId = null;
      delete this.editedGovernorateStatus[gov.id];
    },
    error: () => {
      this.errorMessage = 'Update failed.';
      setTimeout(() => this.errorMessage = '', 3000);
    }
  });
}

  private markAllAsTouched(): void {
    Object.values(this.governrateForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

getEditedStatus(gov: Governrate): boolean {
  return this.editedGovernorateStatus[gov.id] ?? gov.isDeleted;
}

}

