import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';
import { Organization } from '../../../../core/models/organization.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p class="text-slate-600 mt-2">Manage all organizations and users in the system</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p class="text-slate-600 text-sm font-semibold">Total Organizations</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{{ stats.totalOrganizations }}</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p class="text-slate-600 text-sm font-semibold">Active Organizations</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{{ stats.activeOrganizations }}</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p class="text-slate-600 text-sm font-semibold">Inactive Organizations</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{{ stats.inactiveOrganizations }}</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p class="text-slate-600 text-sm font-semibold">Total Users</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{{ stats.totalUsers }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button class="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition">
            ➕ Create Organization
          </button>
          <button class="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition">
            👥 Manage Users
          </button>
          <button class="px-4 py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-semibold transition">
            📊 View Reports
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-bold text-slate-900 mb-4">System Status</h2>
        <p class="text-slate-600">✅ All systems operational</p>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalOrganizations: 0,
    activeOrganizations: 0,
    inactiveOrganizations: 0,
    totalUsers: 0
  };

  isLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.apiService.getAllOrganizations().subscribe({
      next: (organizations: Organization[]) => {
        this.stats.totalOrganizations = organizations.length;
        this.stats.activeOrganizations = organizations.filter(o => o.isActive).length;
        this.stats.inactiveOrganizations = organizations.filter(o => !o.isActive).length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
