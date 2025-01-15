import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private apiUrl = environment.apiUrl; // Reemplaza con tu URL de API

  constructor(private http: HttpClient, private authStateService: AuthStateService) {}

  getItems(id_account: string, id_role: string, id_inventory : string): Observable<any> {
    const token = this.authStateService.getAuthData()?.token; // Obtener el token de autenticación
    let params = new HttpParams();
    params = params.append('account_id', id_account);
    params = params.append('id_role', id_role);
    params = params.append('id_inventory', id_inventory );

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.apiUrl}items/get_by_inventory`, { params, headers });
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

    return this.http.post<any>(`${this.apiUrl}items/massive`, body, {params, headers });
  }

  deleteItem(id_account: string, id_role: string, id_item: string): Observable<any> {
    const token = this.authStateService.getAuthData()?.token; // Obtener el token de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    let params = new HttpParams();
    params = params.append('account_id', id_account);
    params = params.append('id_role', id_role);
    params = params.append('item_id', id_item);

    return this.http.delete<any>(`${this.apiUrl}items/delete`, { params, headers });
  }

}