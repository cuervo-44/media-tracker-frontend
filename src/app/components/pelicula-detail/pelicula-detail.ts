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

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.peliculaService.obtenerPorId(+idParam).subscribe({
        next: (pelicula) => this.pelicula = pelicula,
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
