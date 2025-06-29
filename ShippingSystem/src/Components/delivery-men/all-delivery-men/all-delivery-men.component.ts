import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryManService } from './../../../Services/deliveryMan_Service/delivery-man.service';
import { IReadDeliveryMan } from '../../../Models/deliveryMan_models/IDeliveryMan_model';

@Component({
  selector: 'app-all-delivery-men',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-delivery-men.component.html',
  styleUrls: ['./all-delivery-men.component.css'],

})
export class AllDeliveryMenComponent implements OnInit {
  deliveryMen: IReadDeliveryMan[] = [];
  isLoading = true;
  errorMsg = '';

  constructor(private deliveryManService: DeliveryManService) {}

  ngOnInit(): void {
    this.getAllDeliveryMen();
  }

  getAllDeliveryMen() {
    this.isLoading = true;
    this.deliveryManService.getAllDeliveryMen().subscribe({
      next: (data) => {
        this.deliveryMen = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error loading delivery men!';
        this.isLoading = false;
      }
    });
  }

  onEdit(id: number) {
    // هنا تروح لصفحة التعديل
    // مثال: this.router.navigate(['/delivery-men/edit', id]);
  }

  onDelete(id: number) {
    // هنا ممكن تفتح Dialog تأكيد ثم تنفذ الحذف
    // this.deliveryManService.softDelete(id).subscribe(() => this.getAllDeliveryMen());
  }
}
