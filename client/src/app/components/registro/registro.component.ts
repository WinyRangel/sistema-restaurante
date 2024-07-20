
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  usuarioForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registrarUsuario() {
    if (this.usuarioForm.valid) {
      this.authService.registrarUsuario(this.usuarioForm.value).subscribe(
        response => {
          console.log(response);
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Usuario registrado exitosamente'
          });
          this.router.navigate(['iniciar-sesion'])
        },
        error => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El usuario o correo electrónico ya se encuentran registrados'
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario no válido',
        text: 'Por favor, complete todos los campos requeridos correctamente'
      });
    }
  }
}
