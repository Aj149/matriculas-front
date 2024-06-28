import { Component } from '@angular/core';
import { MatriculaList } from '../../../models/matricula';
import { MatriculaService } from '../../../services/matricula.service';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';
import { NuevoUsuario } from '../../../models/nuevo-usuario';
import { Estudiante } from '../../../models/estudiante';
import { NuevaMateria } from '../../../models/materia';
import { AuthService } from '../../../services/auth.service';
import { EstudianteService } from '../../../services/estudiante.service';
import { MateriaService } from '../../../services/materia.service';
import { TokenService } from '../../../services/token.service';
import { FormsModule } from '@angular/forms';
import { BuscadorMatriculaPipe } from '../../../pipes/buscador-matricula.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-matricula',
  standalone: true,
  imports: [NgxPaginationModule, RouterLink, FormsModule, BuscadorMatriculaPipe],
  templateUrl: './matricula.component.html',
  styleUrl: './matricula.component.css'
})
export class MatriculaComponent {

  matriculaList: MatriculaList[] = [];
  usuarios: NuevoUsuario[] = [];
  estudiantes: Estudiante[] = [];
  materias: NuevaMateria[] = [];

  public page!: number;
  listaVacia: string | undefined;

  isAdmin: boolean = true;
  searchTerm: string = '';
  idUser: number = 0;

  constructor(
    private matriculaService: MatriculaService,
    private usuarioService: AuthService,
    private estudianteService: EstudianteService,
    private materiaService: MateriaService,
    private tokenService: TokenService,
    private toaster: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.idUser = Number(this.tokenService.getUserId());
    this.isAdmin = this.tokenService.isAdmin() ?? false;

    if (this.isAdmin) {
      this.obtenerMatriculas();
    } else {
      if (this.idUser) {
        this.getMatriculasByUsuario(this.idUser);
      } else {
        this.toaster.error("Error al obtener el usuario");
      }
    }

    this.cargarUsuarios();
    this.cargarEstudiantes();
    this.cargarMaterias();
  }

  obtenerMatriculas(): void {
    this.matriculaService.lista().subscribe({
      next: (matricula: MatriculaList[]) => {
        this.matriculaList = matricula;
      },
      error: (err: any) => {
        this.toaster.warning('No existen matriculas')
      }
    })
  }

  getMatriculasByUsuario(idUsuario: number): void {
    this.matriculaService.getMatriculasByUsuario(idUsuario).subscribe({
      next: (matricula: MatriculaList[]) => {
        this.matriculaList = matricula;
      },
      error: (err: any) => {
        this.toaster.warning('No tienes matriculas')
      }
    });
  }


  cargarUsuarios(): void {
    this.usuarioService.lista().subscribe(
      (data: NuevoUsuario[]) => {
        this.usuarios = data;
        this.listaVacia = undefined;
      },
      (error: any) => {
        this.listaVacia = 'No tienes usuarios';
      }
    );

  }

  cargarEstudiantes(): void {
    this.estudianteService.getAllEstudiante().subscribe(
      (data: Estudiante[]) => {
        this.estudiantes = data;
        this.listaVacia = undefined;
      },
      (error: any) => {
        this.listaVacia = 'No tienes estudiantes';
      }
    );
  }

  cargarMaterias(){
    this.materiaService.lista().subscribe(
      (data: NuevaMateria[]) => {
        this.materias = data;
        this.listaVacia = undefined;
      },
      (error: any) => {
        this.listaVacia = 'No tienes materias';
      }
    );
  }

  confirmarEliminar(id_matricula: number): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres eliminar esta matricula?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.matriculaService.delete(id_matricula).subscribe({
          next: () => {
            Swal.fire(
              'Error!',
              'Hubo un problema al eliminar la matricula.',
              'error'
              );
          },
          error: (fail: any) => {
              Swal.fire(
                'Eliminado!',
                'La matricula ha sido eliminada correctamente.',
                'success'
              );
              this.obtenerMatriculas();
          }
        });
      }
    });
  }

}
