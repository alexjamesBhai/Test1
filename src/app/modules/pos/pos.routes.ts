import { Routes } from '@angular/router';
import { salespersonGuard } from '../../core/guards/salesperson.guard';
import { PosDashboardComponent } from './pages/dashboard/dashboard.component';

export const POS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [salespersonGuard],
    children: [
      { path: 'dashboard', component: PosDashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
