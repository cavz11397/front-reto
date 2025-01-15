import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthStateService } from './auth-state.service';
import { environment } from '../../environments/environment'; 


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient, private authStateService: AuthStateService) {}

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post<any>(`${this.apiUrl}login`, body).pipe(
      tap(response => {
        this.authStateService.setAuthData(response); // Guardar la respuesta globalmente
      })
    );
  }

  logout() {
    this.authStateService.clearAuthData(); // Limpiar los datos de autenticación
  }
}