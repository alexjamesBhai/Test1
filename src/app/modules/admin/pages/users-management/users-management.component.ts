import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';
import { Organization } from '../../../../core/models/organization.model';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-3xl font-bold text-slate-900">User Management</h1>
        <p class="text-slate-600 mt-2">Manage all users across organizations</p>
      </div>

      <!-- Filters -->
      <div class="flex gap-4 bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search users by name or email..."
          class="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="OWNER">Business Owner</option>
          <option value="MANAGER">Manager</option>
          <option value="SALESPERSON">Sales Person</option>
        </select>
        <select class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Role</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr *ngFor="let user of users" class="hover:bg-slate-50 transition">
              <td class="px-6 py-4 text-sm text-slate-900 font-semibold">{{ user.name }}</td>
              <td class="px-6 py-4 text-sm text-slate-600">{{ user.email }}</td>
              <td class="px-6 py-4 text-sm">
                <span [ngSwitch]="user.role" class="px-3 py-1 rounded-full text-xs font-semibold"
                  [class]="getRoleClass(user.role)">
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <span [class]="user.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'"
                  class="px-3 py-1 rounded-full text-xs font-semibold">
                  {{ user.isActive ? '✅ Active' : '⏸ Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm flex gap-2">
                <button class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-semibold">
                  Edit
                </button>
                <button class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-semibold">
                  Deactivate
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="users.length === 0" class="text-center py-8 text-slate-600">
          No users found
        </div>
      </div>
    </div>
  `,
  styles: [`
    table tbody tr:last-child {
      border-bottom: none;
    }
  `]
})
export class UsersManagementComponent implements OnInit {
  users: User[] = [];
  isLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // In a real app, fetch all users from all organizations
    // For now, this is a placeholder
  }

  getRoleLabel(role: string): string {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'System Admin',
      'OWNER': 'Business Owner',
      'MANAGER': 'Manager',
      'SALESPERSON': 'Sales Person'
    };
    return roleMap[role] || role;
  }

  getRoleClass(role: string): string {
    const classMap: { [key: string]: string } = {
      'ADMIN': 'bg-red-100 text-red-700',
      'OWNER': 'bg-blue-100 text-blue-700',
      'MANAGER': 'bg-purple-100 text-purple-700',
      'SALESPERSON': 'bg-green-100 text-green-700'
    };
    return classMap[role] || '';
  }
}
