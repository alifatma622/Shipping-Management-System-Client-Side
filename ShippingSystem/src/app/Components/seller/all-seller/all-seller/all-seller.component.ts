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

  constructor(private sellerService  :SellerServiceService, private router :Router) { }

  ngOnInit(): void {
    this.getAllSellers();
  }


  getAllSellers() {

      this.sellerService.getAllSellers().subscribe({

        next: (response) => {
          this.sellers = response;
          console.log(response);
        },
        error: (error) => {
          console.error('Error fetching sellers:', error);
        }

      });
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
          this.getAllSellers();
        },
        error: (error) => {
          console.error('Error deleting seller:', error);
        }
      });
    }
  }


}
