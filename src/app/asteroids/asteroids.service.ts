import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AsteroidsPage } from './model/asteroid-page.model';

@Injectable({
  providedIn: 'root'
})
export class AsteroidsService {

  constructor(private http: HttpClient) { }

  getAll(page: number, size: number): Observable<AsteroidsPage> {
    return this.http.get<AsteroidsPage>(`${environment.baseUrl}/browse?api_key=${environment.apiKey}&size=${size}&page=${page}`);
  }
}
