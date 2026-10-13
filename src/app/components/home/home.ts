import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { PeliculaService } from '../../services/pelicula.service';
import { SerieService } from '../../services/serie.service';
import { Pelicula } from '../../models/pelicula.model';
import { Serie } from '../../models/serie.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home implements OnInit {
  private peliculaService = inject(PeliculaService);
  private serieService = inject(SerieService);

  //Listas originales del backend
  peliculasOriginales: Pelicula[] = [];
  seriesOriginales: Serie[] = [];

  //Lista filtrada y combinada
  itemsFiltrados: any[] = [];

  //Estado de los filtros
  mostrarPeliculas: boolean = true;
  mostrarSeries: boolean = true;
  terminoBusqueda: string = '';

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    forkJoin({
      peliculas: this.peliculaService.obtenerTodas(),
      series: this.serieService.obtenerTodas()
    }).subscribe({
      next: (res) => {
        this.peliculasOriginales = res.peliculas;
        this.seriesOriginales = res.series;
        this.aplicarFiltros(); // Filtramos al cargar para mostrar todo por defecto
      },
      error: (err) => console.error('Error al cargar los datos del backend:', err)
    });
  }

  aplicarFiltros(): void {
    let peliculasFiltradas: Pelicula[] = [];
    let seriesFiltradas: Serie[] = [];

    // 1. Filtrar películas si la casilla está marcada
    if (this.mostrarPeliculas) {
      peliculasFiltradas = this.peliculasOriginales.filter(p =>
        p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }

    // 2. Filtrar series si la casilla está marcada
    if (this.mostrarSeries) {
      seriesFiltradas = this.seriesOriginales.filter(s =>
        s.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }

    // 3. Unificar ambas listas en una sola
    this.itemsFiltrados = [...peliculasFiltradas, ...seriesFiltradas];
  }

  // Método auxiliar para saber en el HTML si un elemento es película o serie
  esPelicula(item: any): boolean {
    return 'duracion' in item;
  }

}

