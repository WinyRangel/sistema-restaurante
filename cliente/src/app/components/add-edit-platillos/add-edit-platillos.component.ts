import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatilloService } from '../../services/platillo.service';
import { Platillo } from '../../interfaces/Platillo';

@Component({
  selector: 'app-add-edit-platillos',
  templateUrl: './add-edit-platillos.component.html',
  styleUrls: ['./add-edit-platillos.component.css']
})
export class AddEditPlatillosComponent implements OnInit {

  platilloForm: FormGroup;
  isNew: boolean = true;
  platilloId: number = 0; // O el valor inicial que corresponda

  constructor(
    private fb: FormBuilder,
    private platilloService: PlatilloService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.platilloForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: ['', [Validators.required, Validators.min(0)]],
      imagen: ['']
    });
  }

  ngOnInit(): void {
    this.platilloForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: ['', [Validators.required, Validators.min(0)]],
      imagen: ['']
    });

    // Verificar si estamos editando o agregando un nuevo platillo
    this.route.params.subscribe(params => {
      this.platilloId = +params['id']; // El '+' convierte el parámetro a número
      if (this.platilloId) {
        this.isNew = false;
        this.platilloService.getPlatilloById(this.platilloId).subscribe(platillo => {
          this.platilloForm.patchValue(platillo); // Prensa el formulario con los datos del platillo
        });
      }
    });
  }

  onSubmit() {
    if (this.platilloForm.valid) {
      const formData = this.platilloForm.value;
      if (this.isNew) {
        this.platilloService.createPlatillo(formData).subscribe(() => {
          this.router.navigate(['/platillos']);
        });
      } else {
        this.platilloService.updatePlatillo(this.platilloId, formData).subscribe(() => {
          this.router.navigate(['/platillos']);
        });
      }
    }
  }
}
