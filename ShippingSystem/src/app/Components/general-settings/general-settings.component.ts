import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralSettingsServiceTsService } from '../../Services/GeneralSettings/general-settings.service';

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

  constructor(private settingsService: GeneralSettingsServiceTsService) {}

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe({
      next: (data) => {
        this.settings = { ...data }; // For form editing
        this.originalSettings = { ...data }; // For display (won't change)
      },
      error: (err) => {
        console.error('Error loading settings:', err);
      }
    });
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
