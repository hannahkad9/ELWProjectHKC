import { Component, input } from '@angular/core';

@Component({
  selector: 'app-film',
  standalone: true,
  imports: [],
  templateUrl: './film.component.html',
  styleUrl: './film.component.css'
})
export class FilmComponent {

  title= input.required<string>();
  description= input.required<string>();
  releaseDate= input<string>();
}
