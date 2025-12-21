import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ApiService } from '../../../../core/services/api.service';
import { User } from '../../../../core/models/user.model';
import { Organization } from '../../../../core/models/organization.model';

@Component({
  selector: 'app-owner-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Organization Settings</h1>
        <p class="text-slate-600 mt-2">Manage your organization details and preferences</p>
      </div>

      <!-- Organization Settings Form -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Organization Details</h2>
        <form [formGroup]="orgForm" (ngSubmit)="saveOrgSettings()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Organization Name</label>
              <input
                type="text"
                formControlName="name"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Business Type</label>
              <input
                type="text"
                formControlName="businessType"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                formControlName="phone"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Address</label>
            <input
              type="text"
              formControlName="address"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            [disabled]="isSaving"
            class="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white rounded-lg font-semibold transition"
          >
            {{ isSaving ? '💾 Saving...' : '💾 Save Changes' }}
          </button>
        </form>
      </div>

      <!-- Change Password -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Change Password</h2>
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="space-y-4 max-w-md">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
            <input
              type="password"
              formControlName="currentPassword"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
            <input
              type="password"
              formControlName="newPassword"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
            <input
              type="password"
              formControlName="confirmPassword"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            [disabled]="passwordForm.invalid"
            class="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-400 text-white rounded-lg font-semibold transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  `
})
export class OwnerSettingsComponent implements OnInit {
  orgForm: FormGroup;
  passwordForm: FormGroup;
  isSaving = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.orgForm = this.fb.group({
      name: ['', Validators.required],
      businessType: [''],
      email: ['', Validators.email],
      phone: [''],
      address: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.organizationId) {
      this.loadOrganizationSettings();
    }
  }

  private loadOrganizationSettings(): void {
    if (!this.currentUser?.organizationId) return;

    this.apiService.getOrganization(this.currentUser.organizationId).subscribe({
      next: (org: Organization) => {
        this.orgForm.patchValue({
          name: org.name,
          businessType: org.businessType,
          email: org.email,
          phone: org.phone,
          address: org.address
        });
      }
    });
  }

  saveOrgSettings(): void {
    if (!this.currentUser?.organizationId || this.orgForm.invalid) return;

    this.isSaving = true;
    this.apiService.updateOrganization(this.currentUser.organizationId, this.orgForm.value).subscribe({
      next: () => {
        this.isSaving = false;
        // Show success toast
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    // Call password change API
  }
}
