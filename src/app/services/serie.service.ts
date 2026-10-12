import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Serie } from '../models/serie.model';

@Injectable({
  providedIn: 'root',
})

export class SerieService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/series';

  obtenerTodas(): Observable<Serie[]> {
    return this.http.get<Serie[]>(this.apiUrl);
  }

  buscarPorTitulo(titulo: string): Observable<Serie[]> {
    return this.http.get<Serie[]>(`${this.apiUrl}/titulo/${titulo}`);
  }

  guardar(serie: Serie): Observable<Serie> {
    return this.http.post<Serie>(this.apiUrl, serie);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
