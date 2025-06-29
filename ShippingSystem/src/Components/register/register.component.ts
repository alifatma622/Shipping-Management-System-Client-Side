import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../Services/auth_Service/auth-service.service';
import { RegisterModel } from './../../Models/auth_models/register-model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  errorMessage: string = '';
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _authService: AuthServiceService
  ) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phones: this.fb.array([
        this.fb.control('', [
          Validators.required,
          Validators.minLength(11),
          Validators.pattern(/^01[0125][0-9]{8}$/),
        ]),
      ]),
    });
  }

  get phones() {
    return this.registerForm.get('phones') as FormArray;
  }

  addPhone() {
    this.phones.push(
      this.fb.control('', [
        Validators.required,
        Validators.minLength(11),
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ])
    );
  }

  removePhone(index: number) {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const request: RegisterModel = {
        userName: formValue.userName,
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phone: formValue.phones[0],
        password: formValue.password,
      };

      this._authService.register(request).subscribe({
        next: (res) => {
          this.errorMessage = '';
          this._router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Unexpected error';
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
