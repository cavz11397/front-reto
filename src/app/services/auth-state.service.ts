import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private authData: any = null;

  setAuthData(data: any) {
    this.authData = data;
  }

  getAuthData() {
    return this.authData;
  }

  clearAuthData() {
    this.authData = null;
  }

  getUserData() {
    return this.authData ? this.authData : null;
  }
}