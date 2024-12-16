import { SwapiFilm } from "./SwapiFilm";

export interface SwapiFilms {
    count: number;
    next: string;
    previous: string;
    results: SwapiFilm[];
}