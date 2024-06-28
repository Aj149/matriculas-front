import { Component } from '@angular/core';
import { EstudianteService } from '../../../services/estudiante.service';
import { Estudiante } from '../../../models/estudiante';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Pipe de busqueda de estudiantes
import { BuscadorEstudiantePipe } from '../../../pipes/buscador-estudiante.pipe';
// Paginación de lista
import { NgxPaginationModule } from 'ngx-pagination';
// Sweetalert -> para las alertas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estudiante',
  standalone: true,
  imports: [RouterLink, NgxPaginationModule, FormsModule, BuscadorEstudiantePipe],
  templateUrl: './estudiante.component.html',
  styleUrl: './estudiante.component.css'
})
export class EstudianteComponent {

  estudiante: Estudiante[] = [];
  listaVacia: string | undefined;
  public page!: number;
  nombre = '';

  constructor(
    private estudianteService: EstudianteService,
  ) { }

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.estudianteService.getAllEstudiante().subscribe(
      (data: Estudiante[]) => {
        this.estudiante = data;
        this.listaVacia = undefined;
      },
      (error: any) => {
        this.listaVacia = 'No tienes estudiantes';
      }
    );
  }

  borrar(id_estudiante: number): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres eliminar al estudiante?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.estudianteService.deleteEstudiante(id_estudiante).subscribe({
          next: (response: any) => {
            Swal.fire(
              'Error!',
              'Hubo un problema al eliminar al estudiante.',
              'error'
            );
          },
          error: (error: any) => {
            Swal.fire(
              'Eliminado!',
              'El estudiante ha sido eliminado correctamente.',
              'success'
            );
            this.cargarEstudiantes();
          }
        });
      }
    });
  }
}
