import { catchError } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { CityService } from '../../../Services/city.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,

} from '@angular/forms';

import { Router } from '@angular/router';
import { AuthServiceService } from '../../../Services/Auth_Services/auth-service.service';
import { RegisterModel } from '../../../Models/Auht-Models/register-model';

export interface ICity {
  id: number;
  name: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent implements OnInit {
  errorMessage: string = '';
  registerForm: FormGroup;
  cities : ICity[] = []
  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _authService: AuthServiceService,
    private cityService : CityService
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
      cityId: [null, Validators.required],
      storeName: ['', Validators.required],
      address: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.cityService.getAllCities().subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: (err) => {
        console.error('Failed to load cities:', err); // Debug
        this.errorMessage = 'Failed to load cities';
      }
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
        address : formValue.address,
        cityId : formValue.cityId,
        storeName : formValue.storeName
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

  goHome(): void {
    this._router.navigate(['/']);
  }



}
