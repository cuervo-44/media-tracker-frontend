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
        this.aplicarFiltros();//Calcula el contenido que se muestra
      },
      error: (err) => console.error('Error al cargar los datos:', err)
    });
  }

  aplicarFiltros(): void {
    let peliculasFiltradas: Pelicula[] = [];
    let seriesFiltradas: Serie[] = [];

    //Filtra las películas si la casilla está marcada
    if (this.mostrarPeliculas) {
      peliculasFiltradas = this.peliculasOriginales.filter(p =>
        p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }

    //Filtra lasseries si la casilla está marcada
    if (this.mostrarSeries) {
      seriesFiltradas = this.seriesOriginales.filter(s =>
        s.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }

    //Unifica ambas listas en una sola
    this.itemsFiltrados = [...peliculasFiltradas, ...seriesFiltradas];
  }

  // Método auxiliar para saber en el HTML si un elemento es película o serie
  esPelicula(item: any): boolean {
    return 'duracion' in item;
  }

  // Control para mostrar/ocultar el formulario de creación
  mostrarFormCrear: boolean = false;
  tipoNuevo: 'pelicula' | 'serie' = 'pelicula';

  // Objeto unificado o separado para el formulario de creación
  nuevoItem: any = {
    nombre: '',
    anyo: new Date().getFullYear(),
    puntuacion: 0,
    duracion: 120 // Específico de película por defecto
  };

  toggleFormCrear(): void {
    this.mostrarFormCrear = !this.mostrarFormCrear;
    if (this.mostrarFormCrear) {
      // Resetear valores por defecto
      this.nuevoItem = {
        nombre: '',
        anyo: new Date().getFullYear(),
        puntuacion: 0,
        duracion: 120
      };
    }
  }

  validarPuntuacion(): void {
    if (this.nuevoItem.puntuacion === null || this.nuevoItem.puntuacion === undefined || (this.nuevoItem.puntuacion as any) === '') return;
    if (+this.nuevoItem.puntuacion > 10) {
      this.nuevoItem.puntuacion = 10;
    } else if (+this.nuevoItem.puntuacion < 0) {
      this.nuevoItem.puntuacion = 0;
    }
  }

  guardarNuevoItem(): void {
    if (this.tipoNuevo === 'pelicula') {
      if (
        this.nuevoItem.puntuacion === null ||
        this.nuevoItem.puntuacion === undefined ||
        isNaN(+this.nuevoItem.puntuacion) ||
        +this.nuevoItem.puntuacion < 0 ||
        +this.nuevoItem.puntuacion > 10
      ) {
        alert('La puntuación debe estar comprendida entre 0 y 10.');
        return;
      }

      this.peliculaService.guardar(this.nuevoItem).subscribe({
        next: () => {
          alert('Película creada con éxito');
          this.mostrarFormCrear = false;
          this.cargarDatos(); // Recargamos el listado
        },
        error: (err) => console.error('Error al crear película:', err)
      });
    } else {
      // Para la serie creamos la estructura base (sin temporadas inicialmente, ya se añaden en su detalle)
      const nuevaSerie = {
        nombre: this.nuevoItem.nombre,
        anyo: this.nuevoItem.anyo,
        temporadas: []
      };
      this.serieService.guardar(nuevaSerie).subscribe({
        next: () => {
          alert('Serie creada con éxito');
          this.mostrarFormCrear = false;
          this.cargarDatos(); // Recargamos el listado
        },
        error: (err) => console.error('Error al crear serie:', err)
      });
    }
  }

}

