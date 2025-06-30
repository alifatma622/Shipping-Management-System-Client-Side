import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { LandingComponent } from './Components/landing/landing.component';
import { DashboardComponent } from './Components/Dashboard/Dashboard.component';
import { MainComponent } from './Components/Main/Main.component';
import { MainEmployeeComponent } from './Components/Employee/MainEmployee/MainEmployee.component';
import { AllDeliveryMenComponent } from './Components/delivery-men/all-delivery-men/all-delivery-men.component';
import { AddDeliveryManComponent } from './Components/delivery-men/add-delivery-man/add-delivery-man.component';
import { EditDeliveryManComponent } from './Components/delivery-men/edit-delivery-man/edit-delivery-man.component';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: '', component: MainComponent },
      { path: 'employee', component: MainEmployeeComponent },
      { path: 'delivery-men', component: AllDeliveryMenComponent },
      { path: 'delivery-men/add', component: AddDeliveryManComponent },
      { path: 'delivery-men/edit/:id', component: EditDeliveryManComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
