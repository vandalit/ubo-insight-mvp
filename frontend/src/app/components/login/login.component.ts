import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = signal<LoginCredentials>({ email: '', password: '' });
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials().email || !this.credentials().password) {
      this.errorMessage.set('Por favor ingresa email y contraseña');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.credentials()).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        if (user) {
          console.log('Login exitoso:', user);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Credenciales incorrectas');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al iniciar sesión');
        console.error('Error login:', error);
      }
    });
  }

  updateCredentials(field: keyof LoginCredentials, value: string): void {
    this.credentials.update(creds => ({
      ...creds,
      [field]: value
    }));
  }
}
