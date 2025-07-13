import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { BranchService } from '../../../Services/Branch-Services/branch.service';
import { Router } from '@angular/router';
import { AllBranch } from '../../../Models/Branch/all-branch';

@Component({
  selector: 'app-all-branch',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-branch.component.html',
  styleUrl: './all-branch.component.css',
})
export class AllBranchComponent implements OnInit {
  allBranches: AllBranch[] = [];
  filteredBranches: AllBranch[] = [];

  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  itemsPerPageOptions: number[] = [5, 10, 15];

  constructor(private _branchService: BranchService, private _router: Router) {}

  ngOnInit(): void {
    this.getBranches();
  }

  getBranches(): void {
    this._branchService.getAllBranchesPagination(this.currentPage, this.itemsPerPage).subscribe({
      next: (res) => {
        this.allBranches = res.items;
        this.totalItems = res.totalCount;
        this.applyFilter(); // فلترة الصفحة الحالية
      },
      error: (err) => {
        console.error('Error fetching branches:', err);
      },
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredBranches = [...this.allBranches];
    } else {
      this.filteredBranches = this.allBranches.filter(branch =>
        branch.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onSearch(): void {
    this.applyFilter();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getBranches();
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.getBranches();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onAddBranch(): void {
    this._router.navigate(['dashboard/AddBranch']);
  }

  onEdit(branch: AllBranch): void {
    this._router.navigate(['dashboard/UpdateBranch', branch.id]);
  }

  onDelete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._branchService.deleteBranch(id).subscribe({
          next: () => {
            this.getBranches();
            Swal.fire({
              title: 'Deleted!',
              text: 'Branch has been deleted.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'An error occurred while deleting the branch.',
              icon: 'error',
            });
            console.error('Delete failed:', err);
          },
        });
      }
    });
  }
}
