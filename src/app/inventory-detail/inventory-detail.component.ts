import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../services/items.service';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { MenuComponent } from '../shared/menu/menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.css'],
  standalone: true,
  imports: [MenuComponent, CommonModule]
})
export class InventoryDetailComponent implements OnInit {
  items: any;
  inventory: any;

  constructor(
      private itemsService: ItemsService,
      private authStateService: AuthStateService,
      private router: Router,
    ) {}

  ngOnInit() {
    this.inventory = history.state.inventory;
    if (!this.inventory) {
      console.error('No inventory data found in state');
    }

    const userData = this.authStateService.getUserData();
    if (userData) {
      this.itemsService.getItems(userData.account.id_account, userData.role.id_role,this.inventory.id_inventory).subscribe(
        data => {
          this.items = data;
        },
        error => {
          console.error('Error fetching inventories', error);
        }
      );
    } else {
      console.error('No user data found');
    }
  }
}