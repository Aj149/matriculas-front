import { Component } from '@angular/core';
import {  MatriculaView } from '../../../../models/matricula';
import { MatriculaService } from '../../../../services/matricula.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HorarioService } from '../../../../services/horario.service';
import { Horario } from '../../../../models/horario';
import { NuevaAula } from '../../../../models/aula';
import { AulaService } from '../../../../services/aula.service';
import { Estudiante } from '../../../../models/estudiante';
import { NuevaMateria } from '../../../../models/materia';
import { NuevoUsuario } from '../../../../models/nuevo-usuario';
import { EstudianteService } from '../../../../services/estudiante.service';
import { MateriaService } from '../../../../services/materia.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-matricula-view',
  standalone: true,
  imports: [],
  templateUrl: './matricula-view.component.html',
  styleUrl: './matricula-view.component.css'
})
export class MatriculaViewComponent {

  matricula: MatriculaView = {
    fecha: '',
    fechaInicio: '',
    fechaFinal: '',
    alumno: {
      id_estudiante: 0,
      nombre_estudiante: '',
      cedula_estudiante: '',
      email_estudiante: '',
      edad_estudiante: 0,
      numero_estudiante: ''
    },
    profesor: {
      id_usuario: 0,
      nombres_usuario: '',
      cedula: '',
    },
    materia: {
      id_materia: 0,
      nombre: '',
    },
    programacion:{
      id_programacion: 0,
      horario: []
    },
  };
  usuarios: NuevoUsuario[] = [];
  estudiantes: Estudiante[] = [];
  materias: NuevaMateria[] = [];
  horarios: Horario[] = [];
  aulas: NuevaAula[] = [];

  listaVacia: string | undefined;

  constructor(
    private matriculaService: MatriculaService,
    private horarioService: HorarioService,
    private estudianteService: EstudianteService,
    private materiaService: MateriaService,
    private usuarioService: AuthService,
    private aulaService:AulaService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params["id_matricula"];
    this.matriculaService.detail(id).subscribe(
      (data: MatriculaView) => {
        this.matricula = data;
      },
      (err) => {
        this.toastr.error(err.error.message, 'Fail', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        this.volver();
      }
      );
      this.cargarHorario();
      this.cargarUsuarios();
      this.cargarEstudiantes();
      this.cargarMaterias();
    }

    cargarHorario(): void {
      this.horarioService.lista().subscribe(
        (data: Horario[]) => {
          this.horarios = data;
          this.listaVacia = undefined;
        },
        (error: any) => {
          this.listaVacia = 'No tienes horarios';
        }
      );
    }

    //1 calcular precio de la matricula

    // selectedHorarios: Horario[] = []; // Array para almacenar los horarios seleccionados

    // toggleSelection(horario: Horario) {
    //     horario.seleccionado = !horario.seleccionado;
    
    //     if (horario.seleccionado) {
    //         this.selectedHorarios.push(horario);
    //     } else {
    //         this.selectedHorarios = this.selectedHorarios.filter(h => h.id !== horario.id);
    //     }
    
    //     this.calcularPrecioTotal();
    // }
    
    // calcularPrecioTotal() {
    //     let totalPrice = 0;
    //     this.selectedHorarios.forEach(horario => {
    //         totalPrice += horario.precio;
    //     });
    //     return totalPrice;
    // }
    

    //1 ######################################

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


  volver(): void {
    this.router.navigate(['/dashboard/matricula']);
  }
  downloadPDF1(): void {
    this.router.navigate(['/dashboard/matricula']);
  }

}
