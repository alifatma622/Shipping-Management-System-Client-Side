import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryManService } from './../../../Services/delivery-man.service';
import { IReadDeliveryMan } from '../../../Models/IDeliveryMan_model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-delivery-men',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-delivery-men.component.html',
  styleUrls: ['./all-delivery-men.component.css'],

})
export class AllDeliveryMenComponent implements OnInit {
  deliveryMen: IReadDeliveryMan[] = [];
  isLoading = true;
  errorMsg = '';
  routes: any;
  searchUserName: string = '';

  constructor(private deliveryManService: DeliveryManService, private router: Router) {}

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
        this.errorMsg = 'Error loading delivery agents!';
        this.isLoading = false;
      }
    });
  }

  onEdit(id: number) {
    this.router.navigate(['dashboard/delivery-men/edit', id]);
  }

  onDelete(id: number) {
    this.deliveryManService.softDelete(id).subscribe(() => this.getAllDeliveryMen());
  }

  onAdd() {
    this.router.navigate(['dashboard/delivery-men/add']);
  }

  get filteredDeliveryMen(): IReadDeliveryMan[] {
    if (!this.searchUserName.trim()) return this.deliveryMen;
    return this.deliveryMen.filter(man =>
      man.userName?.toLowerCase().includes(this.searchUserName.trim().toLowerCase())
    );
  }
  onSearchChange(value: string) {
    this.searchUserName = value;
  }

}
