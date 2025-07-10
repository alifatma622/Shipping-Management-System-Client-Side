import { Component, OnInit } from '@angular/core';
import { SellerServiceService } from '../../../../Services/Seller_Service/seller-service.service';
import { ISellerModels } from '../../../../Models/seller_models/iseller-models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-seller',
  imports: [CommonModule,FormsModule],
  templateUrl: './all-seller.component.html',
  styleUrl: './all-seller.component.css'
})
export class AllSellerComponent implements OnInit {

  sellers: ISellerModels[] = [];



  pageNumber = 1;
  pageSize = 5;
  totalPages = 0;
  itemsPerPageOptions = [5, 10, 20, 50];

  constructor(private sellerService  :SellerServiceService, private router :Router) { }

  ngOnInit(): void {
    this.getAllSellers();
  }


  getAllSellers() {

      this.sellerService.getAllSellers(this.pageNumber ,this.pageSize).subscribe({

        next: (response) => {
          this.sellers = response.items;
          this.totalPages = response.totalPages;
          console.log(response);
        },
        error: (error) => {
          console.error('Error fetching sellers:', error);
        }

      });
  }


  onPageChange(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.pageNumber = page;
    this.getAllSellers();
  }
}



onItemsPerPageChange(count: number) {
  this.pageSize = count;
  this.pageNumber = 1;
  this.getAllSellers();
}

  Add(){
    this.router.navigate(['/dashboard/seller/add']);
  }

  edit(id: number) {
    this.router.navigate(['/dashboard/seller/edit', id]);
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this seller?')) {
      this.sellerService.deleteSeller(id).subscribe({
        next: () => {
          console.log('Seller deleted successfully');
          this.getAllSellers();
        },
        error: (error) => {
          console.error('Error deleting seller:', error);
          if (error.status === 404) {
            alert('Seller not found or already deleted.');
          } else {
            alert('Error deleting seller. Please try again.');
          }
        }
      });
    }
  }


}
