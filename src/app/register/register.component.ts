import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { plainToInstance } from 'class-transformer';
import { Member } from '../entities/member';
import { validateSync } from 'class-validator';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AuthModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private readonly authService: AuthService, private router: Router) {}
  public registrationError$ = new BehaviorSubject<boolean>(false);

  registerForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      repeatPassword: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordsMatchValidator },
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
      const member = Object.assign(new Member(), this.registerForm.value);
      delete member.repeatPassword;

      const memberInstance = plainToInstance(Member, member);
      const validateError = validateSync(memberInstance);
      if (validateError?.length > 0) {
        console.error('Invalid body request:', validateError);
        this.registrationError$.next(true);
        return;
      }
      try {
        console.log('Sending form');
        this.authService.register(memberInstance).subscribe({
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
