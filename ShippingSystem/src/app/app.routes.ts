import { AllCityComponent } from './Components/Regions/all-city/all-city.component';
import { AddCityComponent } from './Components/Regions/add-city/add-city.component';
import { UpdateCityComponent } from './Components/Regions/update-city/update-city.component';
import { AllBranchComponent } from './Components/Branchs/all-branch/all-branch.component';
import { UpdateBranchComponent } from './Components/Branchs/update-branch/update-branch.component';
import { AddBranchComponent } from './Components/Branchs/add-branch/add-branch.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/Auth/login/login.component';
import { RegisterComponent } from './Components/Auth/register/register.component';
import { LandingComponent } from './Components/landing/landing.component';
import { DashboardComponent } from './Components/Dashboard/Dashboard.component';
import { MainComponent } from './Components/Main/Main.component';
import { MainEmployeeComponent } from './Components/Employee/MainEmployee/MainEmployee.component';
import { AllDeliveryMenComponent } from './Components/delivery-men/all-delivery-men/all-delivery-men.component';
import { AddDeliveryManComponent } from './Components/delivery-men/add-delivery-man/add-delivery-man.component';
import { EditDeliveryManComponent } from './Components/delivery-men/edit-delivery-man/edit-delivery-man.component';
import { AddEmployeeComponent } from './Components/Employee/AddEmployee/AddEmployee.component';
import { GeneralSettingsComponent } from './Components/general-settings/general-settings.component';
import { GovernratesListComponent } from './Components/Governrate/all-governrates/all-governrates.component';
import { EditEmployeeComponent } from './Components/Employee/EditEmployee/EditEmployee.component';
import { OrdersListComponent } from './Components/Order/orders-list/orders-list.component';
import { AllSellerComponent } from './Components/seller/all-seller/all-seller/all-seller.component';
import { OrderDetailsComponent } from './Components/Order/order-details/order-details.component';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';

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
      { path: 'employee/add', component: AddEmployeeComponent },
      { path: 'employee/edit/:id', component: EditEmployeeComponent },
      { path: 'order', component: OrdersListComponent },
      { path: 'Details/:id', component: OrderDetailsComponent },
      { path: 'Allcity', component: AllCityComponent },
      { path: 'Addcity', component: AddCityComponent },
      { path: 'Updatecity/:id', component: UpdateCityComponent },
      { path: 'AllBranch', component: AllBranchComponent },
      { path: 'UpdateBranch/:id', component: UpdateBranchComponent },
      { path: 'AddBranch', component: AddBranchComponent },
      { path: 'delivery-men', component: AllDeliveryMenComponent },
      { path: 'delivery-men/add', component: AddDeliveryManComponent },
      { path: 'delivery-men/edit/:id', component: EditDeliveryManComponent },
      { path: 'general-settings', component: GeneralSettingsComponent },
      { path: 'governrates', component: GovernratesListComponent },
      { path: 'seller', component: AllSellerComponent },
      { path: 'overview', component: AdminDashboardComponent }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
