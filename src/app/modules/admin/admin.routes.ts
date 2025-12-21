import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';
import { AdminDashboardComponent } from './pages/dashboard/dashboard.component';
import { OrganizationsGridComponent } from './pages/organizations-grid/organizations-grid.component';
import { UsersManagementComponent } from './pages/users-management/users-management.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'organizations', component: OrganizationsGridComponent },
      { path: 'users', component: UsersManagementComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
