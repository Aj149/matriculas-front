import { Estudiante, UpdateEstudiante, ViewEstudiante } from './estudiante';
import { Horario, ViewHorario } from './horario';
import { NuevaMateria, ViewMateria } from './materia';
import { NuevoUsuario, Profesor, UpdateUsuario } from './nuevo-usuario';
export class Matricula {
  id_matricula?: number = 0;
  fecha: string = '';
  fechaInicio: string = '';
  fechaFinal: string = '';
  id_estudiante: number = 0;
  id_usuario: number = 0;
  id_materia: number = 0;
  programacion: Programacion = new Programacion();
}
export class Programacion {
  horario_id: number[] = [];
}

export class MatriculaList {
  id_matricula?: number = 0;
  fecha: string = '';
  fechaInicio: string = '';
  fechaFinal: string = '';
  alumno: Estudiante = new Estudiante();
  profesor: NuevoUsuario = new NuevoUsuario();
  materia: NuevaMateria = new NuevaMateria();
  programacion:  Programacion = new Programacion();
}


export class MatriculaView {
  id_matricula?: number;
  fecha: string = '';
  fechaInicio: string = '';
  fechaFinal: string = '';
  alumno: ViewEstudiante = new ViewEstudiante();
  profesor: Profesor = new Profesor();
  materia: ViewMateria = new ViewMateria();
  programacion: ProgramacionList = new ProgramacionList();
}
export class ProgramacionList {
  id_programacion?: number;
  horario: ViewHorario[] =[];
}


export class MatriculaUpdate {
  id_matricula?: number = 0;
  fecha: string = '';
  fechaInicio: string = '';
  fechaFinal: string = '';
  alumno!: UpdateEstudiante;
  profesor!: UpdateUsuario;
  materia!: NuevaMateria;
  programacion: Programacion = new Programacion();

}
