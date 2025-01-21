import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importar HttpClientTestingModule
import { AuthService } from '../../services/auth.service'; // Importar AuthService
import { ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { of } from 'rxjs'; // Importar of para simular observables

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MenuComponent], // Agregar HttpClientTestingModule y MenuComponent a los imports
      providers: [
        AuthService,
        { provide: ActivatedRoute, useValue: { params: of({}) } } // Proveer ActivatedRoute con un valor simulado
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});