import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LocalService {
private httpClient = inject(HttpClient);
private baseUrl = 'https://localhost:3000/';

  constructor() { }

  

}
