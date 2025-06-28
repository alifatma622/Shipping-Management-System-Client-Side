import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { AuthServiceService } from '../../Services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
          if (role === 'Admin') {
            this._router.navigate(['/admin-dashboard']);
          } else if (role === 'Seller') {
            this._router.navigate(['/seller-dashboard']);
          } else {
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
}
