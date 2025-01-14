import { Component, OnInit, TemplateRef } from '@angular/core';
import { ItemsService } from '../services/items.service';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { MenuComponent } from '../shared/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ChartConfiguration, ChartType, ChartData, registerables, Chart, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

// Registrar los controladores de gráficos
Chart.register(...registerables);

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.css'],
  standalone: true,
  imports: [MenuComponent, CommonModule, FormsModule, BaseChartDirective], // Agregar FormsModule a los imports
  providers: [BsModalService]
})
export class InventoryDetailComponent implements OnInit {
  items: any[] = [];
  inventory: any;
  modalRef?: BsModalRef;
  newItem: any = { name: '', quantity: 0, price: 0 };

  public polarAreaChartLabels: string[] = [];
  public polarAreaChartData: ChartData<'polarArea'> = {
    labels: this.polarAreaChartLabels,
    datasets: [
      { data: [], label: 'Quantity' }
    ]
  };
  public polarAreaLegend = true;
  public polarAreaChartType: ChartType = 'polarArea';
  public polarAreaChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  constructor(
    private itemsService: ItemsService,
    private authStateService: AuthStateService,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.inventory = history.state.inventory;
    if (!this.inventory) {
      console.error('No inventory data found in state');
    } else {
      const userData = this.authStateService.getUserData();
      if (userData) {
        this.itemsService.getItems(userData.account.id_account, userData.role.id_role, this.inventory.id_inventory).subscribe(
          data => {
            this.items = data;
            this.updateChartData();
          },
          error => {
            console.error('Error fetching items', error);
          }
        );
      }
    }
  }

  updateChartData() {
    this.polarAreaChartLabels = this.items.map((item: any) => item.name);
    this.polarAreaChartData.datasets[0].data = this.items.map((item: any) => item.quantity);
  }

  openAddItemModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  addItem() {
    const userData = this.authStateService.getUserData();
    if (userData) {
      this.itemsService.addItem(userData.account.id_account, userData.role.id_role, this.inventory.id_inventory, [this.newItem]).subscribe({
        next: data => {
          this.items.push(data);
          this.updateChartData();
          this.newItem = { name: '', quantity: 0, price: 0 };
          this.modalRef?.hide();
        },
        error: error => {
          console.error('Error adding item', error);
        }
      });
    }
  }

  // events
  public chartClicked({ event, active }: { event: ChartEvent; active: object[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent; active: object[] }): void {
    console.log(event, active);
  }
}