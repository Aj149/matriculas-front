import { Component } from '@angular/core';
import { MateriaService } from '../../../../services/materia.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NuevaMateria } from '../../../../models/materia';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-materia-new',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './materia-new.component.html',
  styleUrl: './materia-new.component.css'
})
export class MateriaNewComponent {

  nombre: string = '';

  constructor(
    private materiaService: MateriaService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  Create(): void {
    const materia = new NuevaMateria();
    materia.nombre = this.nombre;
    this.materiaService.save(materia).subscribe(
      (data: any) => {
        this.toastr.success(data.message, 'Ok', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
        this.volver();
      },
      (err: any) => {
        this.toastr.error(err.error.message, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/materia']);
  }
}
