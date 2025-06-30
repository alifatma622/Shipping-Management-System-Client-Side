import { Routes } from '@angular/router';
import { LoginComponent } from './../Components/login/login.component';
import { RegisterComponent } from '../Components/register/register.component';
import { LandingComponent } from './../Components/landing/landing.component';
import { AllDeliveryMenComponent } from './../Components/delivery-men/all-delivery-men/all-delivery-men.component';
import { AddDeliveryManComponent } from './../Components/delivery-men/add-delivery-man/add-delivery-man.component';
import { EditDeliveryManComponent } from './../Components/delivery-men/edit-delivery-man/edit-delivery-man.component';
import { AllSellerComponent } from '../Components/seller/all-seller/all-seller/all-seller.component';


export const routes: Routes = [
  { path: 'Landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'seller', component: AllSellerComponent },
   // Delivery Men Routes
  { path: 'delivery-men', component: AllDeliveryMenComponent },
  { path: 'delivery-men/add', component: AddDeliveryManComponent },
  { path: 'delivery-men/edit/:id', component: EditDeliveryManComponent },
];
