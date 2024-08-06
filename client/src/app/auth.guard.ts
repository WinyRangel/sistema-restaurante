import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.estaAutenticado()) {
      const expectedRoles = route.data['expectedRoles']; 
      const userRole = this.authService.obtenerRol(); 

      if (expectedRoles && expectedRoles.indexOf(userRole) === -1) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Acceso no autorizado",
        });
        this.router.navigate(['/inicio']);
        return false;
      }
      return true;
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Navegación no permitida",
      });
      this.router.navigate(['/signin']); 
      return false; 
    }
  }
}