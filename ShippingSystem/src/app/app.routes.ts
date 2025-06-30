import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Auth/login/login.component';

import { LandingComponent } from './Components/landing/landing.component';
import { AllCityComponent } from './Components/Regions/all-city/all-city.component';
import { AddCityComponent } from './Components/Regions/add-city/add-city.component';
import { UpdateCityComponent } from './Components/Regions/update-city/update-city.component';
import { RegisterComponent } from './Components/Auth/register/register.component';
import { AllBranchComponent } from './Components/Branchs/all-branch/all-branch.component';
import { UpdateBranchComponent } from './Components/Branchs/update-branch/update-branch.component';
import { AddBranchComponent } from './Components/Branchs/add-branch/add-branch.component';

export const routes: Routes = [
  {
    path: 'Landing',
    component: LandingComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'Allcity', component: AllCityComponent },
  { path: 'Addcity', component: AddCityComponent },
  { path: 'Updatecity/:id', component: UpdateCityComponent },
  { path: 'AllBranch', component: AllBranchComponent },
  { path: 'UpdateBranch/:id', component: UpdateBranchComponent },
  { path: 'AddBranch', component: AddBranchComponent },
];
