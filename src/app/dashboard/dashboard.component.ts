import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { AuthStateService } from '../services/auth-state.service';
import { MenuComponent } from '../shared/menu/menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [MenuComponent, CommonModule]
})
export class DashboardComponent implements OnInit {
  inventories: any[] = [];

  constructor(
    private inventoryService: InventoryService,
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  ngOnInit() {
    const userData = this.authStateService.getUserData();
    if (userData) {
      this.inventoryService.getInventories(userData.account.id_account, userData.role.id_role).subscribe(
        data => {
          this.inventories = data;
        },
        error => {
          console.error('Error fetching inventories', error);
        }
      );
    } else {
      console.error('No user data found');
    }
  }

  viewInventory(inventory: any) {
    this.router.navigate(['/items'], { state: { inventory } });
  }
}