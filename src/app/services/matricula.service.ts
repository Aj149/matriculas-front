import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Matricula, MatriculaList, MatriculaUpdate, MatriculaView } from '../models/matricula';
import { Observable } from 'rxjs';
import { ViewHorario } from '../models/horario';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  matriculaURL = `${environment.URL}matricula/`;


  constructor(private httpClient: HttpClient) { }

  getMatriculasByUsuario(id_usuario: number): Observable<MatriculaList[]> {
    const url = `${this.matriculaURL}usuario/${id_usuario}/matriculas`;
    return this.httpClient.get<MatriculaList[]>(url);
  }


  getHorariosByMatricula(id_matricula: number): Observable<ViewHorario[]> {
    const url = `${this.matriculaURL}${id_matricula}/horarios`;
    return this.httpClient.get<ViewHorario[]>(url);
  }

  public lista(): Observable<MatriculaList[]> {
    return this.httpClient.get<MatriculaList[]>(`${this.matriculaURL}`);
  }

  public detail(id_matricula: number): Observable<MatriculaView> {
    return this.httpClient.get<MatriculaView>(`${this.matriculaURL}${id_matricula}`);
  }

  public save(materia: Matricula): Observable<any> {
    return this.httpClient.post<any>(`${this.matriculaURL}`, materia);
  }

  public update(id_matricula: number, matricula: MatriculaUpdate): Observable<any> {
    return this.httpClient.patch<any>(`${this.matriculaURL}${id_matricula}`, matricula);
  }

  public delete(id_matricula: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.matriculaURL}${id_matricula}`);
  }
}
