import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  message = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  // Getters para acceder a los controles del formulario
  get name() { return this.registerForm.get('name'); }
  get age() { return this.registerForm.get('age'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  onSubmit() {
    if (this.registerForm.valid) {
      this.message = '';
      this.loading = true;
      
      const userData = {
        name: this.registerForm.value.name.trim(),
        age: this.registerForm.value.age,
        password: this.registerForm.value.password.trim()
      };

      this.userService.registerUser(userData).subscribe({
        next: () => {
          this.message = '¡Usuario registrado con éxito!';
          this.registerForm.reset();
        },
        error: (err) => {
          this.message = 'Error: ' + (err.error?.message || 'Error desconocido');
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}
