import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';
import { Organization } from '../../../../core/models/organization.model';

@Component({
  selector: 'app-organizations-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Organizations</h1>
          <p class="text-slate-600 mt-2">Manage all business organizations</p>
        </div>
        <button class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition">
          ➕ New Organization
        </button>
      </div>

      <!-- Search and Filter -->
      <div class="flex gap-4 bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search organizations..."
          class="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex items-center justify-center py-12">
        <svg class="animate-spin h-12 w-12 text-blue-500" viewBox="0 0 50 50">
          <circle class="opacity-30" cx="25" cy="25" r="20" stroke="currentColor" stroke-width="5" fill="none" />
          <circle cx="25" cy="25" r="20" stroke="currentColor" stroke-width="5" fill="none" stroke-dasharray="100" stroke-dashoffset="75" />
        </svg>
      </div>

      <!-- Grid View -->
      <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let org of organizations" class="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-slate-200">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-bold text-slate-900">{{ org.name }}</h3>
              <p class="text-sm text-slate-600">{{ org.businessType }}</p>
            </div>
            <span
              [class]="org.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'"
              class="px-3 py-1 rounded-full text-xs font-semibold"
            >
              {{ org.isActive ? '✅ Active' : '⏸ Inactive' }}
            </span>
          </div>

          <div class="space-y-2 text-sm mb-4">
            <p class="text-slate-600"><strong>Owner:</strong> {{ org.ownerEmail }}</p>
            <p class="text-slate-600"><strong>Created:</strong> {{ org.createdAt | date: 'short' }}</p>
          </div>

          <div class="flex gap-2">
            <button class="flex-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold transition">
              👁️ View
            </button>
            <button class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition">
              ✏️ Edit
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && organizations.length === 0" class="text-center py-12 bg-white rounded-lg">
        <p class="text-slate-600 text-lg">No organizations found</p>
      </div>
    </div>
  `
})
export class OrganizationsGridComponent implements OnInit {
  organizations: Organization[] = [];
  isLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  private loadOrganizations(): void {
    this.isLoading = true;
    this.apiService.getAllOrganizations().subscribe({
      next: (organizations) => {
        this.organizations = organizations;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
