import { Component, OnInit, TemplateRef } from '@angular/core';
import { ItemsService } from '../services/items.service';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { MenuComponent } from '../shared/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ChartType, ChartData, registerables, Chart, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


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

  public polarAreaChartData: ChartData<'polarArea'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Quantity' }
    ]
  };
  public polarAreaLegend = true;
  public polarAreaChartType: ChartType = 'polarArea';

  constructor(
    private readonly itemsService: ItemsService,
    private readonly authStateService: AuthStateService,
    private readonly router: Router,
    private readonly modalService: BsModalService
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
    this.polarAreaChartData.labels = this.items.map((item: any) => item.name);
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

  deleteItem(id_item: string) {
    const userData = this.authStateService.getUserData();
    if (userData) {
      this.itemsService.deleteItem(userData.account.id_account, userData.role.id_role, id_item).subscribe({
        next: () => {
          this.items = this.items.filter(item => item.id_item !== id_item);
          this.updateChartData();
        },
        error: error => {
          console.error('Error deleting item', error);
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

  downloadPDF() {
    const DATA = document.getElementById('pdfContent');
    if (DATA) {
      html2canvas(DATA).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('inventory-details.pdf');
      });
    }
  }
}