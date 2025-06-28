
import { Component ,OnInit} from '@angular/core';
import { DeliveryManService } from './../../../Services/DeliveryMan/delivery-man.service';
import { IDeliveryManDTO } from './../../../Models/DeliveryMan/IDeliveryManDTO';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-delivery-men-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './delivery-men-list.component.html',
  styleUrls: ['./delivery-men-list.component.css']
})
export class DeliveryMenListComponent implements OnInit {
    deliveryMen: IDeliveryManDTO[] = [];
      isLoading = true;
  error: string | null = null;

  //inject service of delivery
  constructor(private deliveryManService: DeliveryManService) {}

   ngOnInit(): void {
    this.deliveryManService.getAllDeliveryMen().subscribe({
      next: (data) => {
        this.deliveryMen = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load delivery men';
        this.isLoading = false;
      }
    });
  }
}


