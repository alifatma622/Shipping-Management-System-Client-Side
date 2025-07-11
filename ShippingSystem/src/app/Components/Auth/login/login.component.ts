import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

import { Router } from '@angular/router';
import { AuthServiceService } from '../../../Services/Auth_Services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class LoginComponent {
  userName: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private _authService: AuthServiceService,
    private _router: Router
  ) {}

  onLoginSubmit(form: NgForm) {
    if (form.valid) {
      const data = {
        userName: this.userName,
        password: this.password,
      };

      this._authService.login(data).subscribe({
        next: (res) => {
          const token = res.token;
          localStorage.setItem('token', token);

          const decodedToken: any = jwtDecode(token);
          const role =
            decodedToken[
              'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ];

          console.log('Token:', token);
          console.log('Role:', role);
          // هنا هيضاف Role ال باقيه وكمان عنضبط ليهم Route In App.routes
          if (role[0] === 'Admin' && role[1] === 'Employee') {
            this._router.navigate(['/dashboard/overview']);
          } else if (role === 'Seller') {
            this._router.navigate(['/dashboard/seller-dashboard']);
          }

          else if (role === 'DeliveryAgent') {
            this._router.navigate(['/dashboard/deliveryman']);
          }
          else {
            this._router.navigate(['/']);
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Unexpected error occurred';
        },
      });
    } else {
      this.errorMessage = 'Form is invalid';
    }
  }

  goHome(): void {
    this._router.navigate(['/']);
  }

  goBack(): void {
    this._router.navigate(['/dashboard/overview']); // or use: window.history.back();
  }
}
