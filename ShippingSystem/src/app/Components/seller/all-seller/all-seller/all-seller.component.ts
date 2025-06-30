import { Component, OnInit } from '@angular/core';
import { SellerServiceService } from '../../../../Services/Seller_Service/seller-service.service';
import { ISellerModels } from '../../../../Models/seller_models/iseller-models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-seller',
  imports: [CommonModule,FormsModule],
  templateUrl: './all-seller.component.html',
  styleUrl: './all-seller.component.css'
})
export class AllSellerComponent implements OnInit {

  sellers: ISellerModels[] = [];

  constructor(private sellerService  :SellerServiceService) { }

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


}
