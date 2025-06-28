import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeliveryMenListComponent } from "../Components/DeliveryComponents/delivery-men-list/delivery-men-list.component";
import { CommonModule } from '@angular/common';
import { AddDeliveryManComponent } from "../Components/DeliveryComponents/add-delivery-man/add-delivery-man.component";
// import { AddDeliveryManComponent } from "../Components/DeliveryComponents/add-delivery-man/add-delivery-man.component";
// import { DeliveryMenListComponent } from "../Components/DeliveryComponents/delivery-men-list/delivery-men-list.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DeliveryMenListComponent, CommonModule, AddDeliveryManComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ShippingSystem';
}
