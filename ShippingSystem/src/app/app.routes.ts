import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { LandingComponent } from './Components/landing/landing.component';
import { DashboardComponent } from './Components/Dashboard/Dashboard.component';

export const routes: Routes = [
  // { path: '', redirectTo: 'Landing', pathMatch: 'full' },
  { path: 'Landing', component: LandingComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent }
];
