import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MenuComponent implements OnInit {
  userData: any;

  constructor(private authService: AuthService, private authStateService: AuthStateService, private router: Router) {}

  ngOnInit() {
    this.userData = this.authStateService.getUserData();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}