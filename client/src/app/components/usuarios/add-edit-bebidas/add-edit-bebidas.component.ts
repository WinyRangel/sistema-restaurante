import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BebidaService } from '../../../services/bebida.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-bebidas',
  templateUrl: './add-edit-bebidas.component.html',
  styleUrl: './add-edit-bebidas.component.css'
})
export class AddEditBebidasComponent {
  bebidaForm: FormGroup;
  operacion: boolean = true;
  bebidaId: number = 0; 
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private _bebidaService: BebidaService,
    private router: Router,
    private route: ActivatedRoute //para que permita obtener un parametro como ruta (id)
  ) { 
    this.bebidaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: ['', [Validators.required, Validators.min(0)]],
      imagen: ['']
    });
  }

  ngOnInit(): void {
    // Verificar si estamos editando o agregando un nuevo platillo
    this.route.params.subscribe(params => {
      this.bebidaId = +params['id']; // El '+' convierte el parámetro a número, lo obtiene como ruta
      if (this.bebidaId) {//si obtiene un id ...
        this.operacion = false; // Ahora ponemos que no es nuevo para editarlo
        this._bebidaService.getBebidaById(this.bebidaId).subscribe(platillo => {
          this.bebidaForm.patchValue(platillo); //llenar el formulario con los datos del platillo
        });
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {//para crear platillo
    if (this.bebidaForm.valid) {
      const formData = new FormData();
      formData.append('nombre', this.bebidaForm.get('nombre')!.value);//interfaz que te permite construir un objeto que puede ser enviado, appemd--agregar valores a un objeto
      formData.append('descripcion', this.bebidaForm.get('descripcion')!.value);
      formData.append('precio', this.bebidaForm.get('precio')!.value);
  
      // Si se ha seleccionado un archivo, añadirlo al FormData
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile);
      } else {
        // Para la edición, si no se selecciona un nuevo archivo, añadir el valor actual de la imagen
        formData.append('imagen', this.bebidaForm.get('imagen')!.value || '');
      }
  
      //enviar a bebidas en ambos casos
      if (this.operacion) {
        this._bebidaService.createBebida(formData).subscribe(() => {
          this.router.navigate(['/bebidas']);
        });
      } else {
        this._bebidaService.updateBebida(this.bebidaId, formData).subscribe(() => {
          this.router.navigate(['/bebidas']);
        });
      }
    }
  }
}
