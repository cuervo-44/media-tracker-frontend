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
    if (this.serie.id) {
      // Llamamos al servicio para añadir la temporada asociada a esta serie
      this.serieService.agregarTemporada(this.serie.id, this.nuevaTemporada).subscribe({
        next: (serieActualizada) => {
          this.serie = serieActualizada; // Actualizamos la vista con la nueva lista de temporadas
          alert('Temporada añadida correctamente');
          // Resetear formulario de temporada y ocultarlo
          this.nuevaTemporada = {
            numeroTemporada: (this.serie.temporadas?.length || 0) + 1,
            numeroCapitulos: 1,
            anyo: new Date().getFullYear(),
            puntuacion: 0
          };
          this.mostrarFormTemporada = false;
        },
        error: (err) => console.error('Error al añadir temporada:', err)
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
