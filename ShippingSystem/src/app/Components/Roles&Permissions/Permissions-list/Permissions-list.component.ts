import { Component, OnInit } from '@angular/core';
import { IPermission } from '../../../Models/IPermission';
import { PermissionsService } from '../../../Services/Permissions-Service/Permissions.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Department } from '../../../Enum/Department';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-Permissions-list',
  imports:[FormsModule , CommonModule],
  templateUrl:'./Permissions-list.component.html',
  styleUrls: ['./Permissions-list.component.css']
})
export class PermissionsListComponent implements OnInit {
 permissions: IPermission[] = [];
  editedPermissions: { [key: string]: IPermission } = {};
  selectedRole : string='';
  isLoading = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';

  constructor(private permissionService: PermissionsService,private route: ActivatedRoute,) { }

 ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const roleFromRoute = params.get('roleName');
    if (roleFromRoute) {
      this.selectedRole = roleFromRoute;
      this.loadPermissions();
    } else {
      this.errorMessage = 'No role selected.';
    }
  });
  
  }

  loadPermissions(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.permissionService.getAllRolePermissions(this.selectedRole).subscribe({
      next: (data) => {
         const validDepartments = Object.values(Department).filter(val => typeof val === 'number') as number[];
      this.permissions = data.filter(p => validDepartments.includes(p.department));
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load permissions';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onRoleChange(): void {
    this.isEditing = false;
    this.loadPermissions();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      // Initialize edited permissions
      this.editedPermissions = {};
      this.permissions.forEach(perm => {
        const key = `${perm.roleName}_${perm.department}`;
        this.editedPermissions[key] = { ...perm };
      });
    }
  }

  onPermissionChange(permission: IPermission, field: string): void {
    const key = `${permission.roleName}_${permission.department}`;
    this.editedPermissions[key][field] = !this.editedPermissions[key][field];
  }

  saveChanges(): void {
    this.isLoading = true;
    const changes = Object.values(this.editedPermissions);
    
    this.permissionService.bulkUpdatePermissions(changes).subscribe({
      next: () => {
        this.successMessage = 'Permissions updated successfully!';
        this.isEditing = false;
        this.loadPermissions();
      },
      error: (err) => {
        this.errorMessage = 'Failed to update permissions';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  getDepartmentName(departmentId: number): string {
    const departments = Department;
    return departments[departmentId ] || `Department ${departmentId}`;
  }
}