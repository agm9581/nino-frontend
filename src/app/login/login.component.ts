import { Component } from '@angular/core';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { httpErrorInterceptor } from '../interceptors/http-error.interceptor';

@Component({
  selector: 'app-login',
  imports: [AuthModule, ReactiveFormsModule, RouterModule, CommonModule],

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public errorMessage: string = '';
  
  constructor(
    private readonly authService: AuthService,
    private router: Router
  ) {}
  public email!: string;
  public password!: string;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
    ]),
  });

  async onSubmit() {
    this.errorMessage = ''; // Clear any previous error messages
    
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (res) => {
          console.log('Login successful');
          localStorage.setItem('token', res.access_token);
          this.router.navigate(['/chat']);
        },
        error: (error) => {
          // Extract error message from the error response
          this.errorMessage = error.error?.response?.message || error.error?.message || error.message;
          console.error('Login error:', this.errorMessage);
        }
      });
    } else {
      console.log('Form Invalid');
    }
  }
}
