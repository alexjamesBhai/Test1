import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ApiService } from '../../../../core/services/api.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-owner-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Team Members</h1>
          <p class="text-slate-600 mt-2">Manage users in your organization</p>
        </div>
        <button
          (click)="showAddUserForm = !showAddUserForm"
          class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
        >
          ➕ Add User
        </button>
      </div>

      <!-- Add User Form -->
      <div *ngIf="showAddUserForm" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Add New User</h2>
        <form [formGroup]="addUserForm" (ngSubmit)="addUser()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                formControlName="name"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Role</label>
              <select
                formControlName="role"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a role</option>
                <option value="MANAGER">Manager</option>
                <option value="SALESPERSON">Sales Person</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                formControlName="password"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="flex gap-2">
            <button
              type="submit"
              [disabled]="addUserForm.invalid"
              class="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-slate-400 text-white rounded-lg font-semibold transition"
            >
              Create User
            </button>
            <button
              type="button"
              (click)="showAddUserForm = false"
              class="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
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
          No users in your organization
        </div>
      </div>
    </div>
  `
})
export class OwnerUsersComponent implements OnInit {
  users: User[] = [];
  addUserForm: FormGroup;
  showAddUserForm = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.organizationId) {
      this.loadUsers();
    }
  }

  private loadUsers(): void {
    if (!this.currentUser?.organizationId) return;

    this.apiService.getOrganizationUsers(this.currentUser.organizationId).subscribe({
      next: (users) => {
        this.users = users;
      }
    });
  }

  addUser(): void {
    if (!this.currentUser?.organizationId || this.addUserForm.invalid) return;

    this.apiService.createUser(this.currentUser.organizationId, this.addUserForm.value).subscribe({
      next: (newUser) => {
        this.users.push(newUser);
        this.addUserForm.reset();
        this.showAddUserForm = false;
      }
    });
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
