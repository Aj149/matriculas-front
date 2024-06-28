import { Pipe, PipeTransform } from '@angular/core';
import { MatriculaList } from '../models/matricula';

@Pipe({
  name: 'buscadorMatricula',
  standalone: true
})
export class BuscadorMatriculaPipe implements PipeTransform {

  transform(matriculas: MatriculaList[], searchTerm: string): MatriculaList[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return matriculas;
    }

    const searchTermLower = searchTerm.toLowerCase();

    return matriculas.filter((matricula: MatriculaList) =>
      this.matchSearchTerm(matricula, searchTermLower)
    );
  }

  private matchSearchTerm(matricula: MatriculaList, searchTerm: string): boolean {
    // Comprobar si el término de búsqueda coincide con el nombre de la materia
    if (matricula.materia.nombre.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Comprobar si el término de búsqueda coincide con el nombre del estudiante
    if (matricula.alumno.nombre_estudiante.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Comprobar si el término de búsqueda coincide con el nombre del docente
    if (matricula.profesor.nombres_usuario.toLowerCase().includes(searchTerm)) {
      return true;
    }

    return false;
  }

}
