import { Component, ElementRef, ViewChild } from '@angular/core';
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
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { InformeModel } from '../../../../models/informe';

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

  horario: Horario = {
    id_horario: 0,
    dia: '',
    horaInicio: '',
    horaSalida: '',
    modalidad: '',
    aula: {
      id_aula: 0,
      nombreAula: '',
      capacidad: 0,
    },
    precio: 0
  }
  usuarios: NuevoUsuario[] = [];
  estudiantes: Estudiante[] = [];
  materias: NuevaMateria[] = [];
  horarios: Horario[] = [];
  aulas: NuevaAula[] = [];

  listaVacia: string | undefined;

  //1 para el pdf
  @ViewChild('content') content!: ElementRef;
  info: InformeModel | null = null;
//1 ###################
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
  
  public downloadPDF1(): void {
    const estudiante = this.info?.estudiante;
    const DATA = this.content.nativeElement;
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres descargar el informe en formato PDF?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, descargar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        html2canvas(DATA).then(canvas => {
          const fileWidth = 190;
          const fileHeight = canvas.height * fileWidth / canvas.width;

          const FILEURI = canvas.toDataURL('image/png');
          const PDF = new jsPDF('p', 'mm', 'a4');
          const position = 10;
          const leftMargin = 10;
          PDF.addImage(FILEURI, 'PNG', leftMargin, position, fileWidth, fileHeight)

          PDF.save(`informe_${estudiante}.pdf`);
        }).catch(error => {
          console.error('Error al generar el PDF:', error);
        });
      }
    });
  }
}