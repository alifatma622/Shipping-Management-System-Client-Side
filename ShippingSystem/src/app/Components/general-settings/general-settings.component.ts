import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralSettingsServiceTsService } from '../../Services/GeneralSettings/general-settings.service';
import { AuthServiceService, PermissionModel } from '../../Services/Auth_Services/auth-service.service';
import { Department } from '../../Enum/Department';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent implements OnInit {
  settings: any = null;
  originalSettings: any = null; // Store original values to display in the card
  isLoading: boolean = false;
  showSuccessMessage: boolean = false;
  permissions: { [departmentId: number]: PermissionModel } = {};
  userRole: string[] = [];

  constructor(private settingsService: GeneralSettingsServiceTsService, private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.initializeUserRolesAndPermissions();
  }

  private initializeUserRolesAndPermissions(): void {
    this.userRole = this.authService.getRole();
    const isAdmin = this.authService.hasRole('Admin');
    const role = this.userRole?.find(r => r !== 'Employee') ?? '';

    if (isAdmin) {
      this.settingsService.getSettings().subscribe({
        next: (data) => {
          this.settings = { ...data };
          this.originalSettings = { ...data };
        },
        error: (err) => {
          console.error('Error loading settings:', err);
        }
      });
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
        this.settingsService.getSettings().subscribe({
          next: (data) => {
            this.settings = { ...data };
            this.originalSettings = { ...data };
          },
          error: (err) => {
            console.error('Error loading settings:', err);
          }
        });
      }, err => {
        this.settingsService.getSettings().subscribe({
          next: (data) => {
            this.settings = { ...data };
            this.originalSettings = { ...data };
          },
          error: (err) => {
            console.error('Error loading settings:', err);
          }
        });
      });
    } else {
      // For Employee role without specific permissions
      this.settingsService.getSettings().subscribe({
        next: (data) => {
          this.settings = { ...data };
          this.originalSettings = { ...data };
        },
        error: (err) => {
          console.error('Error loading settings:', err);
        }
      });
    }
  }

  onSubmit() {
    if (!this.settings) {
      return;
    }

    this.isLoading = true;

    const updatedSettings = {
      ...this.settings,
      employeeId: 1 // fixed ID for now
    };

    this.settingsService.updateSettings(updatedSettings).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccessMessage = true;

        // Update original settings to reflect the new saved values
        this.originalSettings = { ...this.settings };

        // Hide success message after 3 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error updating settings:', err);
      }
    });
  }

  canEdit(): boolean {
    if (this.authService.hasRole('Admin')) return true;
    return this.permissions[Department.GeneralSetting]?.edit ?? false;
  }

  // Helper method to format numbers for display
  formatNumber(value: number): string {
    return value ? value.toFixed(2) : '0.00';
  }

  // Helper method to validate form inputs
  isFormValid(): boolean {
    if (!this.settings) {
      return false;
    }

    return (
      this.settings.defaultWeight > 0 &&
      this.settings.extraPriceKg >= 0 &&
      this.settings.extraPriceVillage >= 0 &&
      this.settings.fast >= 0 && this.settings.fast <= 100 &&
      this.settings.express >= 0 && this.settings.express <= 100
    );
  }
}
