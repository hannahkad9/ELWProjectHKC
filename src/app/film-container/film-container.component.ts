import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SwapiFilm } from '../models/SwapiFilm';
import { SwapiService } from '../services/swapi.service';
import { FilmComponent } from '../film/film.component';

@Component({
  selector: 'app-film-container',
  standalone: true,
  imports: [FilmComponent],
  templateUrl: './film-container.component.html',
  styleUrl: './film-container.component.css'
})
export class FilmContainerComponent implements OnInit {

  route: ActivatedRoute = inject(ActivatedRoute);
  swapiService = inject(SwapiService);

  film= signal<SwapiFilm | null>(null);

  ngOnInit(): void {
    const filmId = this.route.snapshot.params['id'];
    this.swapiService.getFilm(filmId).subscribe((film: SwapiFilm) => {
      this.film.set(film);
    });
  }

}
