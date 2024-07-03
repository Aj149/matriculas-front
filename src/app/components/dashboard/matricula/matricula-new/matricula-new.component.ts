import { Component } from '@angular/core';
import { Matricula, Programacion, Materias } from '../../../../models/matricula';
import { NuevoUsuario } from '../../../../models/nuevo-usuario';
import { Estudiante } from '../../../../models/estudiante';
import { MatriculaService } from '../../../../services/matricula.service';
import { EstudianteService } from '../../../../services/estudiante.service';
import { AuthService } from '../../../../services/auth.service';
import { MateriaService } from '../../../../services/materia.service';
import { NuevaMateria, ViewMateria } from '../../../../models/materia';
import { Horario } from '../../../../models/horario';
import { HorarioService } from '../../../../services/horario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterByModalidadPipe } from '../../../../pipes/modalidad_matricula.pipe';
import { TokenService } from '../../../../services/token.service';

@Component({
  selector: 'app-matricula-new',
  standalone: true,
  imports: [FormsModule, FilterByModalidadPipe],
  templateUrl: './matricula-new.component.html',
  styleUrl: './matricula-new.component.css',
})
export class MatriculaNewComponent {
  matricula: Matricula = new Matricula();
  usuarios: NuevoUsuario[] = [];
  estudiantes: Estudiante[] = [];
  materias: NuevaMateria[] = [];
  horarios: Horario[] = [];
  selectedHorarios: number[] = [];
  totalPrecio: number = 0; 

  //1 traer materias
selectedMateria: number[] = [];
//1################
  listaVacia: string | undefined;
  // isAdmin: boolean = true;

  //modalidad
  selectedModalidad: string = ''; // Variable para almacenar la modalidad seleccionada

  constructor(
    private matriculaService: MatriculaService,
    private estudianteService: EstudianteService,
    private materiaService: MateriaService,
    private horarioService: HorarioService,
    private usuarioService: AuthService,
    private token: TokenService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //  this.isAdmin = this.token.isAdmin()?true:false;
    this.cargarUsuarios();
    this.cargarEstudiantes();
    this.cargarMaterias();
    this.cargarHorarios();
    this.calcularTotal();
    // Obtener la fecha actual en el formato YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0
    const dd = String(today.getDate()).padStart(2, '0');
    // Asignar la fecha actual al campo fecha
    this.matricula.fecha = `${yyyy}-${mm}-${dd}`;
  }

  crearMatricula(): void {
    this.matriculaService.save(this.matricula).subscribe(
      (data: any) => {
        this.toastr.success(data.message, 'Matricula Creada con exito', {
          timeOut: 3000,
          positionClass: 'toast-top-center',
        });
        this.volver();
      },
      (err: any) => {
        this.toastr.error(err.error.message, 'Fail', {
          timeOut: 3000,
          positionClass: 'toast-top-center',
        });
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/matricula']);
  }

  cargarUsuarios(): void {
    const esAdmin = false; // Aquí debes establecer la lógica para determinar si el usuario actual es administrador o no

    this.usuarioService.lista().subscribe(
      (data: NuevoUsuario[]) => {
        if (esAdmin) {
          // Si el usuario es administrador, simplemente asigna todos los usuarios
          this.usuarios = data;
        } else {
          // Si el usuario no es administrador, filtra los usuarios que no son administradores
          this.usuarios = data.filter(
            (usuario) => !this.esAdministrador(usuario)
          );
        }
        this.listaVacia =
          this.usuarios.length === 0 ? 'No tienes usuarios' : undefined;
      },
      (error: any) => {
        this.listaVacia = 'No tienes usuarios';
      }
    );
  }

  esAdministrador(usuario: NuevoUsuario): boolean {
    // Verifica si el usuario tiene el rol de administrador
    return usuario.roles.some((rol) => rol.rolNombre === 'admin');
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

  cargarMaterias() {
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

  cargarHorarios() {
    if (this.selectedModalidad === '') {
      this.horarioService.lista().subscribe(
        (data: Horario[]) => {
          this.horarios = data;
          this.listaVacia = undefined;
        },
        (error: any) => {
          this.listaVacia = 'No tienes horarios';
        }
      );
    } else {
      this.horarioService
        .getAllHorariosByModalidad(this.selectedModalidad)
        .subscribe(
          (data: Horario[]) => {
            this.horarios = data;
            this.listaVacia = undefined;
          },
          (error: any) => {
            this.listaVacia = `No hay horarios ${this.selectedModalidad}`;
          }
        );
    }
  }

//1 para calcular el total
getHorarioPrecio(id: number): number {
  const horario = this.getHorario(id);
  return horario ? horario.precio : 0;
}

removePrecio(horarioId: number): void {
  const index = this.selectedHorarios.indexOf(horarioId);
  if (index !== -1) {
    this.selectedHorarios.splice(index, 1);
    
    this.calcularTotal(); // Recalcula el total al remover un horario
  }
}

addPrecio(horarioId: number): void {
  this.selectedHorarios.push(horarioId);
  this.calcularTotal(); // Llama a calcularTotal() después de agregar un horario
}

calcularTotal(): void {
  this.totalPrecio = 0;
  this.selectedHorarios.forEach(id => {
    this.totalPrecio += this.getHorarioPrecio(id);
  });
}
//1 ###################################


  removeHorarioFromMatricula(horarioId: number) {
    const index = this.matricula.programacion.horario_id.indexOf(horarioId);
    if (index !== -1) {
      this.matricula.programacion.horario_id.splice(index, 1);
    }
  }

  getHorario(id: number) {
    return this.horarios.find((h) => h.id_horario === id);
  }

  
  onHorarioChange() {
    if (!this.matricula.programacion) {
      this.matricula.programacion = new Programacion();
      this.matricula.programacion.horario_id = [];
    }
    for (let horarioId of this.selectedHorarios) {
      if (!this.matricula.programacion.horario_id.includes(horarioId)) {
        this.matricula.programacion.horario_id.push(horarioId);
      }
    }
  }
 
  //1 traer las materias
  
  onMateriaChange() {
    if (!this.matricula.materias) {
      this.matricula.materias = new Materias();
      this.matricula.materias.materias_id = [];
    }
    for (let materiasId of this.selectedMateria) {
      if (!this.matricula.materias.materias_id.includes(materiasId)) {
        this.matricula.materias.materias_id.push(materiasId);
      }
    }
  }

  removeMateria(materiasId: number) {
    const index = this.matricula.materias.materias_id.indexOf(materiasId);
    if (index !== -1) {
      this.matricula.materias.materias_id.splice(index, 1);
    }
  }

  getMateria(id: number) {
    return this.materias.find((h) => h.id_materia === id);
  }

  //1 ##################################
}

