import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PeliculaService } from '../../services/pelicula.service';
import { Pelicula } from '../../models/pelicula.model';

@Component({
  selector: 'app-pelicula-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pelicula-detail.html',
  styleUrl: './pelicula-detail.css',
})
export class PeliculaDetail implements OnInit {

  private peliculaService = inject(PeliculaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  pelicula: Pelicula = {
    nombre: "",
    duracion: 0,
    puntuacion: 0,
    anyo: new Date().getFullYear()
  };

  //Este método es poco eficiente, revisar luego
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.peliculaService.obtenerTodas().subscribe({
        next: (peliculas) => {
          const encontrada = peliculas.find(p => p.id === id);
          if (encontrada) {
            this.pelicula = encontrada;
          }
        },
        error: (err) => console.error('Error al cargar la película:', err)
      });
    }
  }

  guardarCambios(): void {
    this.peliculaService.guardar(this.pelicula).subscribe({
      next: () => {
        alert('Película actualizada correctamente');
        this.router.navigate(['/']);
      },
      error: (err) => console.error('Error al actualizar la película:', err)
    });
  }

  eliminarPelicula(): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta película?')) {
      if (this.pelicula.id) {
        this.peliculaService.eliminar(this.pelicula.id).subscribe({
          next: () => this.router.navigate(['/']),
          error: (err) => console.error('Error al eliminar:', err)
        });
      }
    }
  }




}
