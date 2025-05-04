import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AuthModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(
    private readonly authService: AuthService,
    private router: Router
  ) {}
  registerForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      repeatPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordsMatchValidator }
  );

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;

    if (password !== repeatPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      try {
        console.log('Sending form');
        this.authService.register(email, password).subscribe({
          next: (res) => {
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Registration failed:', err);
          },
        });
      } catch (err) {
        throw new Error();
      }
    } else {
      console.log('Form Invalid');
    }
  }
}
