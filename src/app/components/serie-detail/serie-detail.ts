import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SerieService } from '../../services/serie.service';
import { Serie } from '../../models/serie.model';
import { Temporada } from '../../models/temporada.model';

@Component({
  selector: 'app-serie-detail',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './serie-detail.html',
  styleUrl: './serie-detail.css',
})
export class SerieDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private serieService = inject(SerieService);

  serie: Serie = {
    nombre: '',
    anyo: new Date().getFullYear(),
    temporadas: []
  };

  nuevaTemporada: Temporada = {
    numeroTemporada: 1,
    numeroCapitulos: 1,
    anyo: new Date().getFullYear(),
    puntuacion: 0
  };

  mostrarFormTemporada: boolean = false;
  temporadaEditando: Temporada | null = null;
  indiceTemporadaEditando: number | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.serieService.obtenerPorId(id).subscribe({
        next: (serie) => {
          this.serie = serie;
          // Sugiere el siguiente número de temporada automáticamente
          if (this.serie.temporadas && this.serie.temporadas.length > 0) {
            this.nuevaTemporada.numeroTemporada = this.serie.temporadas.length + 1;
          }
        },
        error: (err) => console.error('Error al cargar la serie:', err)
      });
    }
  }

  guardarCambios(): void {
    this.serieService.guardar(this.serie).subscribe({
      next: () => {
        alert('Serie actualizada correctamente');
        this.router.navigate(['/']);
      },
      error: (err) => console.error('Error al actualizar la serie:', err)
    });
  }

  agregarTemporada(): void {
    if (!this.serie) return;
    // Asegurar que los valores numéricos vengan correctamente tipados
    const nuevaTemp: Temporada = {
      numeroTemporada: +this.nuevaTemporada.numeroTemporada,
      numeroCapitulos: +this.nuevaTemporada.numeroCapitulos,
      anyo: +this.nuevaTemporada.anyo,
      puntuacion: +this.nuevaTemporada.puntuacion
    };

    // Crear la serie actualizada con la nueva temporada en la lista
    const serieActualizada: Serie = {
      ...this.serie,
      temporadas: [...(this.serie.temporadas || []), nuevaTemp]
    };

    // Guardar la serie completa en el backend
    this.serieService.guardar(serieActualizada).subscribe({
      next: (serieGuardada) => {
        this.serie = serieGuardada;
        alert('Temporada añadida correctamente');
        // Resetear formulario de temporada con el siguiente número y ocultarlo
        this.nuevaTemporada = {
          numeroTemporada: (this.serie.temporadas?.length || 0) + 1,
          numeroCapitulos: 1,
          anyo: new Date().getFullYear(),
          puntuacion: 0
        };
        this.mostrarFormTemporada = false;
      },
      error: (err) => {
        console.error('Error al añadir temporada:', err);
        alert('Error al guardar la temporada. Revisa la consola para más detalles.');
      }
    });
  }

  iniciarEdicion(temp: Temporada, index: number): void {
    this.indiceTemporadaEditando = index;
    this.temporadaEditando = { ...temp };
  }

  cancelarEdicion(): void {
    this.indiceTemporadaEditando = null;
    this.temporadaEditando = null;
  }

  guardarEdicionTemporada(): void {
    if (!this.temporadaEditando || this.indiceTemporadaEditando === null || !this.serie.temporadas) return;

    const temporadaActualizada: Temporada = {
      ...this.temporadaEditando,
      numeroTemporada: +this.temporadaEditando.numeroTemporada,
      numeroCapitulos: +this.temporadaEditando.numeroCapitulos,
      anyo: +this.temporadaEditando.anyo,
      puntuacion: +this.temporadaEditando.puntuacion
    };

    const nuevasTemporadas = this.serie.temporadas.map((t, idx) =>
      idx === this.indiceTemporadaEditando ? temporadaActualizada : t
    );

    const serieActualizada: Serie = {
      ...this.serie,
      temporadas: nuevasTemporadas
    };

    this.serieService.guardar(serieActualizada).subscribe({
      next: (serieGuardada) => {
        this.serie = serieGuardada;
        this.cancelarEdicion();
        alert('Temporada modificada correctamente');
      },
      error: (err) => {
        console.error('Error al modificar temporada:', err);
        alert('Error al guardar los cambios de la temporada');
      }
    });
  }

  eliminarTemporada(idTemporada?: number): void {
    if (!idTemporada) return;

    if (confirm('¿Estás seguro de que deseas eliminar esta temporada?')) {
      const serieActualizada: Serie = {
        ...this.serie,
        temporadas: (this.serie.temporadas || []).filter(t => t.id !== idTemporada)
      };

      this.serieService.guardar(serieActualizada).subscribe({
        next: (serieGuardada) => {
          this.serie = serieGuardada;
          this.nuevaTemporada.numeroTemporada = (this.serie.temporadas?.length || 0) + 1;
          alert('Temporada eliminada correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar temporada:', err);
          alert('Error al eliminar la temporada');
        }
      });
    }
  }

  eliminarSerie(): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta serie?')) {
      if (this.serie.id) {
        this.serieService.eliminar(this.serie.id).subscribe({
          next: () => this.router.navigate(['/']),
          error: (err) => console.error('Error al eliminar serie:', err)
        });
      }
    }
  }

}
