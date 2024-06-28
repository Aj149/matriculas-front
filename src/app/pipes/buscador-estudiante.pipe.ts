import { Pipe, PipeTransform } from '@angular/core';
import { Estudiante } from '../models/estudiante';

@Pipe({
  name: 'buscadorEstudiante',
  standalone: true
})
export class BuscadorEstudiantePipe implements PipeTransform {

  transform(estudiante: Estudiante[], searchTerm: string): Estudiante[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return estudiante;
    }

    const searchTermLower = searchTerm.toLowerCase();

    return estudiante.filter((estudiantes: Estudiante) =>
      estudiantes.nombre_estudiante.toLowerCase().includes(searchTermLower)
    );
  }

}
