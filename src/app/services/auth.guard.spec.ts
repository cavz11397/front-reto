import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthStateService } from './auth-state.service';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authStateService: AuthStateService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        {
          provide: AuthStateService,
          useValue: {
            getAuthData: jasmine.createSpy('getAuthData').and.returnValue(true)
          }
        }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    authStateService = TestBed.inject(AuthStateService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow the authenticated user to access app', () => {
    (authStateService.getAuthData as jasmine.Spy).and.returnValue(true);
    expect(authGuard.canActivate()).toBeTrue();
  });

  it('should not allow the unauthenticated user to access app', () => {
    (authStateService.getAuthData as jasmine.Spy).and.returnValue(false);
    spyOn(router, 'navigate');
    expect(authGuard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});