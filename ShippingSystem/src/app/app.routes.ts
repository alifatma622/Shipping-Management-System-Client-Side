import { AllCityComponent } from './Components/Regions/all-city/all-city.component';
import { AddCityComponent } from './Components/Regions/add-city/add-city.component';
import { UpdateCityComponent } from './Components/Regions/update-city/update-city.component';
import { AllBranchComponent } from './Components/Branchs/all-branch/all-branch.component';
import { UpdateBranchComponent } from './Components/Branchs/update-branch/update-branch.component';
import { AddBranchComponent } from './Components/Branchs/add-branch/add-branch.component';
import { NgModule } from '@angular/core';
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
import { AddSellerComponent } from './Components/seller/add-seller/add-seller.component';
import { EditSellerComponent } from './Components/seller/edit-seller/edit-seller.component';
import { AddOrderComponent } from './Components/Orders/add-order/add-order.component';
import { AddEmployeeComponent } from './Components/Employee/AddEmployee/AddEmployee.component';
import { GeneralSettingsComponent } from './Components/general-settings/general-settings.component';
import { GovernratesListComponent } from './Components/Governrate/all-governrates/all-governrates.component';
import { EditEmployeeComponent } from './Components/Employee/EditEmployee/EditEmployee.component';
import { OrdersListComponent } from './Components/Order/orders-list/orders-list.component';
import { UnauthorizedComponent } from './Components/unauthorized/unauthorized.component';
import { authGuard } from './Guards/auth.guard';
import { AllSellerComponent } from './Components/seller/all-seller/all-seller/all-seller.component';
import { OrderDetailsComponent } from './Components/Order/order-details/order-details.component';
import { EditOrderComponent } from './Components/Orders/edit-order/edit-order.component';

import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { DeliverymanDashboardComponent } from './Components/deliveryman-layout/deliveryman-dashboard/deliveryman-dashboard.component';
import { SellerDashboardComponent } from './Components/Seller-layout/seller-dashboard/seller-dashboard.component';
import { OrderListSellerComponent } from './Components/Test/order-list-seller/order-list-seller.component';

import { DeliverymanOrdersComponent } from './Components/deliveryman-layout/deliveryman-orders/deliveryman-orders.component';

import { AddOrderSellerComponent } from './Components/Seller-layout/add-order-seller/add-order-seller.component';
import { OrderSellerComponent } from './Components/Seller-layout/order-seller/order-seller.component';


export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'test', component: OrderListSellerComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Employee'  , 'Seller' ,'DeliveryAgent'] },
    children: [
      { path: '', component: MainComponent },
      { path: 'employee', component: MainEmployeeComponent , canActivate:[authGuard], data : {roles: ['Employee']} },
      { path: 'delivery-men', component: AllDeliveryMenComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'delivery-men/add', component: AddDeliveryManComponent , canActivate:[authGuard], data : {roles: ['Employee']} },
      { path: 'delivery-men/edit/:id', component: EditDeliveryManComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'seller', component: AllSellerComponent , canActivate:[authGuard], data : {roles: ['Employee']} },
      { path: 'seller/add', component: AddSellerComponent , canActivate:[authGuard], data : {roles: ['Employee']} },
      { path: 'seller/edit/:id', component: EditSellerComponent , canActivate:[authGuard], data : {roles: ['Employee']} },
      { path: 'order/add', component: AddOrderComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'employee/add', component: AddEmployeeComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'employee/edit/:id', component: EditEmployeeComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'order', component: OrdersListComponent , canActivate:[authGuard], data : {roles: ['Employee' ]}},
      { path: 'Order/Details/:id', component: OrderDetailsComponent , canActivate:[authGuard], data : {roles: ['Employee' , 'Seller', 'DeliveryAgent']}},
      {path: 'Order/Edit/:id', component: EditOrderComponent, canActivate:[authGuard], data : {roles: ['Employee' , 'Seller']}},
      { path: 'Allcity', component: AllCityComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'Addcity', component: AddCityComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'Updatecity/:id', component: UpdateCityComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'AllBranch', component: AllBranchComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'UpdateBranch/:id', component: UpdateBranchComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'AddBranch', component: AddBranchComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'delivery-men', component: AllDeliveryMenComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'delivery-men/add', component: AddDeliveryManComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'delivery-men/edit/:id', component: EditDeliveryManComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'general-settings', component: GeneralSettingsComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      { path: 'governrates', component: GovernratesListComponent , canActivate:[authGuard], data : {roles: ['Employee']} },
      { path: 'seller', component: AllSellerComponent , canActivate:[authGuard], data : {roles: ['Employee']} },

      { path: 'deliveryman', component: DeliverymanDashboardComponent, canActivate: [authGuard], data: { roles: ['DeliveryAgent'] } },
      { path: 'order-delivery', component: DeliverymanOrdersComponent, canActivate: [authGuard], data: { roles: ['DeliveryAgent'] } },

      { path: 'overview', component: AdminDashboardComponent , canActivate:[authGuard], data : {roles: ['Employee']}},
      {
      path: 'seller-dashboard',
      component: SellerDashboardComponent,
      canActivate: [authGuard],
      data: { roles: ['Seller'] }
    },
      { path: 'add-order-seller', component: AddOrderSellerComponent, canActivate: [authGuard], data: { roles: ['Seller'] } },
      { path: 'orders-seller', component: OrderSellerComponent, canActivate: [authGuard], data: { roles: ['Seller'] } },


      {
        path: 'overview',
        component: AdminDashboardComponent,
        canActivate: [authGuard],
        data: { roles: ['Employee'] },
      },
    ],
  },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
