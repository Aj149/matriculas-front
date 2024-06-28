export class Estudiante {
  id_estudiante?: number= 0;
  nombre_estudiante: string ='';
  cedula_estudiante: string = '';
  email_estudiante: string = '';
  edad_estudiante: number = 0;
  numero_estudiante: string = '';
  representante: Representante = new Representante();
  direccion: Direccion = new Direccion();
  institucion: Institucion = new Institucion();
}
export class Representante {
  nombre_representante: string = '';
  cedula_representante: string = '';
  email_representante: string = '';
  numero_representante: string = '';
}

export class Direccion {
  ciudad: string = '';
  sector: string = '';
  detalle: string = '';
}
export class Institucion {
  nombre: string = '';
  tipo: string = '';
  nivel: string = '';
  grado: string = '';
  jornada: string = '';

}

export class UpdateEstudiante {
  id_estudiante?: number;
  nombre_estudiante: string = '';
}

export class ViewEstudiante {
  id_estudiante!: number;
  nombre_estudiante!: string;
  cedula_estudiante!: string;
  email_estudiante!: string;
  edad_estudiante!: number;
  numero_estudiante!: string;
}
