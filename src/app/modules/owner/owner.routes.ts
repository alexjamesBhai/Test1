import { Routes } from '@angular/router';
import { ownerGuard } from '../../core/guards/owner.guard';
import { OwnerDashboardComponent } from './pages/dashboard/dashboard.component';
import { OwnerSettingsComponent } from './pages/settings/settings.component';
import { OwnerUsersComponent } from './pages/users/users.component';

export const OWNER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [ownerGuard],
    children: [
      { path: 'dashboard', component: OwnerDashboardComponent },
      { path: 'settings', component: OwnerSettingsComponent },
      { path: 'users', component: OwnerUsersComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
