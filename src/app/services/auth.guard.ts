import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authStateService: AuthStateService, private router: Router) {}

  canActivate(): boolean {
    if (this.authStateService.getAuthData()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}