import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 bg-slate-900 text-white h-screen fixed left-0 top-16 shadow-lg overflow-y-auto">
      <nav class="p-6">
        <div class="mb-8">
          <h2 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</h2>
          <ul class="space-y-1">
            <li *ngFor="let item of visibleNavItems">
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-blue-600"
                [routerLinkActiveOptions]="{ exact: false }"
                class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <span class="text-xl">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div class="p-6 border-t border-slate-700 mt-8">
        <button
          (click)="logout()"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-red-400 hover:text-red-300"
        >
          <span class="text-xl">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      --sidebar-width: 256px;
    }
  `]
})
export class SidebarComponent {
  @Input() currentUser: User | null = null;

  visibleNavItems: NavItem[] = [];

  private allNavItems: NavItem[] = [
    // Admin routes
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊', roles: ['ADMIN'] },
    { label: 'Organizations', path: '/admin/organizations', icon: '🏢', roles: ['ADMIN'] },
    { label: 'All Users', path: '/admin/users', icon: '👥', roles: ['ADMIN'] },

    // Owner/Business Owner routes
    { label: 'Dashboard', path: '/owner/dashboard', icon: '📊', roles: ['OWNER'] },
    { label: 'Organization Settings', path: '/owner/settings', icon: '⚙️', roles: ['OWNER'] },
    { label: 'Users', path: '/owner/users', icon: '👥', roles: ['OWNER'] },

    // Manager routes
    { label: 'Products', path: '/manager/products', icon: '📦', roles: ['MANAGER', 'OWNER'] },
    { label: 'Categories', path: '/manager/categories', icon: '📂', roles: ['MANAGER', 'OWNER'] },

    // Salesperson routes
    { label: 'POS', path: '/pos/dashboard', icon: '🛒', roles: ['SALESPERSON'] },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.filterNavItems();
  }

  ngOnInit(): void {
    this.filterNavItems();
  }

  private filterNavItems(): void {
    const userRole = this.currentUser?.role;
    this.visibleNavItems = this.allNavItems.filter(item => item.roles.includes(userRole || ''));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
