import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css'] // Corrección: Cambiar "styleUrl" a "styleUrls"
})
export class IniciarSesionComponent {
  signinForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signinForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  signin() {
    if (this.signinForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario no válido',
        text: 'Por favor, complete todos los campos requeridos correctamente'
      });
      return;
    }

    const user = {
      email: this.signinForm.get('email')?.value,
      password: this.signinForm.get('password')?.value
    };

    this.authService.inicioSesion(user).subscribe(
      response => {
        Swal.fire({
          title: 'Inicio de sesión exitoso',
          icon: 'success'
        });
        this.router.navigate(['/inicio']); // Redirigir a la página de inicio
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Parece que ha habido un error con tus credenciales. Por favor, verifica nuevamente.'
        });
      }
    );
  }
}
