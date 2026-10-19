import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { PeliculaDetail } from './components/pelicula-detail/pelicula-detail';
import { SerieDetail } from './components/serie-detail/serie-detail';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'pelicula/:id', component: PeliculaDetail },
    { path: 'serie/:id', component: SerieDetail },
    { path: '**', redirectTo: '' }
];;
