import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemsService } from './items.service';
import { environment } from '../../environments/environment';

describe('ItemsService', () => {
  let service: ItemsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemsService]
    });
    service = TestBed.inject(ItemsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch items', () => {
    const dummyItems = [
      { id_item: '1', name: 'Item 1', quantity: 10, price: 100 },
      { id_item: '2', name: 'Item 2', quantity: 20, price: 200 }
    ];

    service.getItems('1', '1', '1').subscribe(items => {
      expect(items.length).toBe(2);
      expect(items).toEqual(dummyItems);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}items/get_by_inventory?account_id=1&id_role=1&id_inventory=1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyItems);
  });

  it('should add an item', () => {
    const newItem = { id_item: '3', name: 'Item 3', quantity: 30, price: 300 };

    service.addItem('1', '1', '1', [newItem]).subscribe(item => {
      expect(item).toEqual(newItem);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}items/massive?account_id=1&id_role=1`);
    expect(req.request.method).toBe('POST');
    req.flush(newItem);
  });

  it('should delete an item', () => {
    service.deleteItem('1', '1', '1').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}items/delete?account_id=1&id_role=1&item_id=1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});