import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InventoryDetailComponent } from './inventory-detail/inventory-detail.component';
import { AuthGuard } from './services/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'items', component: InventoryDetailComponent, canActivate: [AuthGuard] }
];