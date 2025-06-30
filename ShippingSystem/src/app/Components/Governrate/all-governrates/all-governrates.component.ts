import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GovernratesService, Governrate } from '../../../Services/Governrates/governrates.service';

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

  constructor(
    private governratesService: GovernratesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getGovernrates();
  }

  private initForm(): void {
    this.governrateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  get name() {
    return this.governrateForm.get('name');
  }
  isFormVisible = false;
  getGovernrates(): void {
    this.governratesService.getAllGovernrates().subscribe({
      next: (data) => {
        this.governrates = data;
        this.filteredGovernrates = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load governorates';
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

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this governorate?')) {
      this.governratesService.deleteGovernrate(id).subscribe(() => {
        this.getGovernrates();
      });
    }
  }

  editingId: number | null = null;

startEdit(id: number): void {
  this.editingId = id;
}

cancelEdit(): void {
  this.editingId = null;
}

saveEdit(governorate: Governrate): void {
  const updatedGov = { name: governorate.name };

  this.governratesService.updateGovernrate(governorate.id, updatedGov).subscribe({
    next: () => {
      this.successMessage = 'Governorate updated successfully!';
      this.editingId = null;
      setTimeout(() => this.successMessage = '', 3000);
    },
    error: () => {
      this.errorMessage = 'Failed to update governorate.';
      setTimeout(() => this.errorMessage = '', 3000);
    }
  });
}

  private markAllAsTouched(): void {
    Object.values(this.governrateForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}

