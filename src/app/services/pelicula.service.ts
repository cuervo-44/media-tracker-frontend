import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pelicula } from '../models/pelicula.model';

@Injectable({
  providedIn: 'root',
})
export class PeliculaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/peliculas';

  obtenerTodas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.apiUrl);
  }

  buscarPorTitulo(titulo: string): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(`${this.apiUrl}/titulo/${titulo}`);
  }

  guardar(pelicula: Pelicula): Observable<Pelicula> {
    return this.http.post<Pelicula>(this.apiUrl, pelicula);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
