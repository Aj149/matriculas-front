import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NuevoTurno } from '../models/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  base = environment.URL;
  turnoURL = `${this.base}matricula/turno/`;

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<NuevoTurno[]> {
    return this.httpClient.get<NuevoTurno[]>(`${this.turnoURL}`);
  }

  public detail(id_turno: number): Observable<NuevoTurno> {
    return this.httpClient.get<NuevoTurno>(`${this.turnoURL}${id_turno}`);
  }

  public save(turno: NuevoTurno): Observable<any> {
    return this.httpClient.post<any>(`${this.turnoURL}`,turno);
  }
  public update(id_turno: number, turno: NuevoTurno): Observable<any> {
    return this.httpClient.patch<any>(`${this.turnoURL}${id_turno}`,turno);
  }

  public delete(id_turno: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.turnoURL}${id_turno}`)};
}
