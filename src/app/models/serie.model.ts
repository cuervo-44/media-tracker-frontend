import { Temporada } from "./temporada.model";

export interface Serie {
    id?: number;
    nombre: string;
    anyo: number;
    temporadas: Temporada[];
}