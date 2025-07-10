import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { BranchService } from '../../../Services/Branch-Services/branch.service';
import { Router } from '@angular/router';
import { AllBranch } from '../../../Models/Branch/all-branch';
@Component({
  selector: 'app-all-branch',
  imports: [CommonModule, FormsModule],
  templateUrl: './all-branch.component.html',
  styleUrl: './all-branch.component.css',
})
export class AllBranchComponent implements OnInit {
  branches: AllBranch[] = [];
  searchTerm: string = '';
  constructor(private _branchService: BranchService, private _router: Router) {}

  // for test pagination before API Working

  currentPage: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];

  get pagedBranches(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBranches().slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBranches().length / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
  }

  onSearch(event?: Event) {
    if (event) event.preventDefault();
    this.currentPage = 1;
  }

  /* /// this Is Removing When API Working //// */

  ngOnInit(): void {
    this.getBranches();
  }

  getBranches() {
    this._branchService.getAllBranch().subscribe({
      next: (res) => {
        this.branches = res;
      },
      error: (err) => {
        console.error('Error fetching branches:', err);
      },
    });
  }

  filteredBranches(): AllBranch[] {
    return this.branches.filter((branch) =>
      branch.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onAddBranch() {
    this._router.navigate(['dashboard/AddBranch']);
  }

  onEdit(branch: AllBranch) {
    this._router.navigate(['dashboard/UpdateBranch', branch.id]);
  }

  onDelete(id: number) {
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
        this._branchService.hardDeleteBranch(id).subscribe({
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
