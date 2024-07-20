import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatilloService } from '../../../services/platillo.service';
import { Platillo } from '../../../interfaces/Platillo';
@Component({
  selector: 'app-add-edit-platillos',
  templateUrl: './add-edit-platillos.component.html',
  styleUrls: ['./add-edit-platillos.component.css']
})
export class AddEditPlatillosComponent implements OnInit {

  platilloForm: FormGroup;
  operacion: boolean = true;
  platilloId: number = 0; 
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private platilloService: PlatilloService,
    private router: Router,
    private route: ActivatedRoute //para que permita obtener un parametro como ruta (id)
  ) { 
    this.platilloForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: ['', [Validators.required, Validators.min(0)]],
      imagen: ['']
    });
  }

  ngOnInit(): void {
    // Verificar si estamos editando o agregando un nuevo platillo
    this.route.params.subscribe(params => {
      this.platilloId = +params['id']; // El '+' convierte el parámetro a número, lo obtiene como ruta
      if (this.platilloId) {//si obtiene un id ...
        this.operacion = false; // Ahora ponemos que no es nuevo para editarlo
        this.platilloService.getPlatilloById(this.platilloId).subscribe(platillo => {
          this.platilloForm.patchValue(platillo); //llenar el formulario con los datos del platillo
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
    if (this.platilloForm.valid) {
      const formData = new FormData();
      formData.append('nombre', this.platilloForm.get('nombre')!.value);//interfaz que te permite construir un objeto que puede ser enviado, appemd--agregar valores a un objeto
      formData.append('descripcion', this.platilloForm.get('descripcion')!.value);
      formData.append('precio', this.platilloForm.get('precio')!.value);
  
      // Si se ha seleccionado un archivo, añadirlo al FormData
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile);
      } else {
        // Para la edición, si no se selecciona un nuevo archivo, añadir el valor actual de la imagen
        formData.append('imagen', this.platilloForm.get('imagen')!.value || '');
      }
  
      //enviar a platillos en ambos casos
      if (this.operacion) {
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
