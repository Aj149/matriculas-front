import { Component } from '@angular/core';
import { NuevaMateria } from '../../../../models/materia';
import { MateriaService } from '../../../../services/materia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
// Sweetalert -> para las alertas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-materia-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './materia-edit.component.html',
  styleUrl: './materia-edit.component.css'
})
export class MateriaEditComponent {
  materia: NuevaMateria = {
    nombre: '',
  };

  constructor(
    private materiaService: MateriaService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id_materia = this.activatedRoute.snapshot.params['id_materia'];
    this.materiaService.detail(id_materia).subscribe(
      (data: any) => {
        this.materia = data;
      },
      (err: any) => {
        this.toastr.error(err.error.message, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
        this.volver();
      }
    );
  }

  Update(): void {
    const id_materia = this.activatedRoute.snapshot.params['id_materia'];
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres actualizar la materia?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.materiaService.update(id_materia, this.materia).subscribe(
          (data: any) => {
            this.toastr.success(data.message, 'OK', {
              timeOut: 3000, positionClass: 'toast-top-center'
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
    });
  }

  volver(): void {
    this.router.navigate(['/dashboard/materia']);
  }
}
