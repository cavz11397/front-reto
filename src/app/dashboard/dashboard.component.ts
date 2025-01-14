import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { AuthStateService } from '../services/auth-state.service';
import { MenuComponent } from '../shared/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [MenuComponent, CommonModule, FormsModule],
  providers: [BsModalService],
})
export class DashboardComponent implements OnInit {
  inventories: any[] = [];
  modalRef?: BsModalRef;
  newInventory: any = { name: '', description: '' };

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly authStateService: AuthStateService,
    private readonly router: Router,
    private readonly modalService: BsModalService
  ) {}

  ngOnInit() {
    const userData = this.authStateService.getUserData();
    if (userData) {
      this.inventoryService
        .getInventories(userData.account.id_account, userData.role.id_role)
        .subscribe({
          next: (data) => {
            this.inventories = data;
          },
          error: (error) => {
            console.error('Error fetching inventories', error);
          }
        });
    } else {
      console.error('No user data found');
    }
  }

  viewInventory(inventory: any) {
    this.router.navigate(['/items'], { state: { inventory } });
  }

  openAddInventoryModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  addInventory() {
    const userData = this.authStateService.getUserData();
    if (userData) {
      this.inventoryService
        .addInventory(userData.account.id_account, userData.role.id_role, [
          this.newInventory,
        ])
        .subscribe({
          next: (data) => {
            this.inventories.push(data);
            this.newInventory = { name: '', description: '' };
            this.modalRef?.hide();
          },
          error: (error) => {
            console.error('Error adding inventory', error);
          }
        });
    }
  }
}
