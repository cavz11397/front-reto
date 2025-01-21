import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryDetailComponent } from './inventory-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ItemsService } from '../services/items.service';
import { AuthStateService } from '../services/auth-state.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('InventoryDetailComponent', () => {
  let component: InventoryDetailComponent;
  let fixture: ComponentFixture<InventoryDetailComponent>;
  let itemsService: ItemsService;
  let authStateService: AuthStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        CommonModule,
        BaseChartDirective
      ],
      providers: [
        ItemsService,
        AuthStateService,
        BsModalService,
        BsModalRef,
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Simular history.state
    spyOnProperty(window, 'history', 'get').and.returnValue({
      state: { inventory: { id_inventory: '1', name: 'Test Inventory' } },
      length: 1,
      scrollRestoration: 'auto',
      back: () => {},
      forward: () => {},
      go: (delta?: number) => {},
      pushState: (data: any, title: string, url?: string | null) => {},
      replaceState: (data: any, title: string, url?: string | null) => {}
    });

    fixture = TestBed.createComponent(InventoryDetailComponent);
    component = fixture.componentInstance;
    itemsService = TestBed.inject(ItemsService);
    authStateService = TestBed.inject(AuthStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch items on init', () => {
    const dummyItems = [
      { id_item: '1', name: 'Item 1', quantity: 10, price: 100 },
      { id_item: '2', name: 'Item 2', quantity: 20, price: 200 }
    ];
    spyOn(authStateService, 'getUserData').and.returnValue({ account: { id_account: '1' }, role: { id_role: '1' } });
    spyOn(itemsService, 'getItems').and.returnValue(of(dummyItems));

    component.ngOnInit();

    expect(component.items.length).toBe(2);
    expect(component.items).toEqual(dummyItems);
  });

  it('should add an item', () => {
    const newItem = { id_item: '3', name: 'Item 3', quantity: 30, price: 300 };
    spyOn(authStateService, 'getUserData').and.returnValue({ account: { id_account: '1' }, role: { id_role: '1' } });
    spyOn(itemsService, 'addItem').and.returnValue(of(newItem));

    component.newItem = newItem;
    component.addItem();

    expect(component.items.length).toBe(1);
    expect(component.items[0]).toEqual(newItem);
  });

  it('should delete an item', () => {
    const dummyItems = [
      { id_item: '1', name: 'Item 1', quantity: 10, price: 100 },
      { id_item: '2', name: 'Item 2', quantity: 20, price: 200 }
    ];
    spyOn(authStateService, 'getUserData').and.returnValue({ account: { id_account: '1' }, role: { id_role: '1' } });
    spyOn(itemsService, 'deleteItem').and.returnValue(of({}));

    component.items = dummyItems;
    component.deleteItem('1');

    expect(component.items.length).toBe(1);
    expect(component.items[0].id_item).toBe('2');
  });

});