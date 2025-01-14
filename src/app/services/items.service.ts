import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private apiUrl = 'http://127.0.0.1:8000/items/'; // Reemplaza con tu URL de API

  constructor(private http: HttpClient, private authStateService: AuthStateService) {}

  getItems(id_account: string, id_role: string, id_inventory : string): Observable<any> {
    const token = this.authStateService.getAuthData()?.token; // Obtener el token de autenticación
    let params = new HttpParams();
    params = params.append('account_id', id_account);
    params = params.append('id_role', id_role);
    params = params.append('id_inventory', id_inventory );

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.apiUrl}get_by_inventory`, { params, headers });
  }

  addItem(id_account: string, id_role: string, id_inventory: string, items: any[]): Observable<any> {
    const token = this.authStateService.getAuthData()?.token; // Obtener el token de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    let params = new HttpParams();
    params = params.append('account_id', id_account);
    params = params.append('id_role', id_role);

    const body = items.map(item => ({
      id_inventory: id_inventory,
      ...item
    }));

    return this.http.post<any>(`${this.apiUrl}massive`, body, {params, headers });
  }

}