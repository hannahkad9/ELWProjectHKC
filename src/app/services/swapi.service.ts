import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Flag {
  id: number;
  name: string;
  country: string;
  flag: string;
}

@Injectable({
  providedIn: 'root',
})
export class FlagService {
  private apiUrl = 'http://localhost:3000/api/flags'; // Update to your backend URL

  constructor(private http: HttpClient) {}

  // Fetch all flags
  getFlags(): Observable<Flag[]> {
    return this.http.get<Flag[]>(this.apiUrl);
  }

  // Fetch flag by ID
  getFlagById(id: number): Observable<Flag> {
    return this.http.get<Flag>(`${this.apiUrl}/${id}`);
  }

  // Add a new flag (optional)
  addFlag(flag: Flag): Observable<Flag> {
    return this.http.post<Flag>(this.apiUrl, flag);
  }
}
