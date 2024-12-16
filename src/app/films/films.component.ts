import { Component, inject, OnInit, signal } from '@angular/core';
import { SwapiService } from '../services/swapi.service';
import { SwapiFilms } from '../models/SwapiFilms';
import { SwapiFilm } from '../models/SwapiFilm';
import { FilmComponent } from '../film/film.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [FilmComponent, RouterModule],
  templateUrl: './films.component.html',
  styleUrl: './films.component.css'
})
export class FilmsComponent implements OnInit {

  private  swapiService = inject(SwapiService);

  films = signal<SwapiFilm[]>([]);
  
  selectedFilm= signal<number | null>(null);

  ngOnInit(): void {
    this.swapiService.getFilms()
    .subscribe((films: SwapiFilms) => {
      this.films.set(films.results);
    });
  }
  onClickDetails(film: SwapiFilm): void {
    this.selectedFilm.set(film.episode_id);
  }
  

}
