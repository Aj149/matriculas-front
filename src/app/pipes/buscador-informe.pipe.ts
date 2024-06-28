import { Pipe, PipeTransform } from '@angular/core';
import { InformeModel } from '../models/informe';

@Pipe({
  name: 'buscadorInforme',
  standalone: true
})
export class BuscadorInformePipe implements PipeTransform {

  transform(informe: InformeModel[], searchTerm: string): InformeModel[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return informe;
    }

    const searchTermLower = searchTerm.toLowerCase();

    return informe.filter((info: InformeModel) =>
      info.estudiante.toLowerCase().includes(searchTermLower)
    );
  }

}
