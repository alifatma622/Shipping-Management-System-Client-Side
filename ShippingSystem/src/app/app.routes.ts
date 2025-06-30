import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { LandingComponent } from './Components/landing/landing.component';
import { DashboardComponent } from './Components/Dashboard/Dashboard.component';
import { MainComponent } from './Components/Main/Main.component';
import { MainEmployeeComponent } from './Components/Employee/MainEmployee/MainEmployee.component';

export const routes: Routes = [
  // { path: '', redirectTo: 'Landing', pathMatch: 'full' },
  { path: 'Landing', component: LandingComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent},
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'employee', component: MainEmployeeComponent },
      // Add more child routes here if needed
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
