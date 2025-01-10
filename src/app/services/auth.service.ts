import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/login'; // Reemplaza con tu URL de API

  constructor(private http: HttpClient, private authStateService: AuthStateService) {}

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post<any>(this.apiUrl, body).pipe(
      tap(response => {
        this.authStateService.setAuthData(response); // Guardar la respuesta globalmente
      })
    );
  }
}