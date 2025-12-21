import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../../core/services/auth.service";
import { ApiService } from "../../../../core/services/api.service";
import { User } from "../../../../core/models/user.model";

@Component({
  selector: "app-owner-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Business Dashboard</h1>
        <p class="text-slate-600 mt-2">Overview of your organization</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p class="text-slate-600 text-sm font-semibold">Total Sales</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">
            {{ stats.totalSales | currency }}
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p class="text-slate-600 text-sm font-semibold">Active Products</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">
            {{ stats.activeProducts }}
          </p>
        </div>

        <div
          class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500"
        >
          <p class="text-slate-600 text-sm font-semibold">Team Members</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">
            {{ stats.teamMembers }}
          </p>
        </div>

        <div
          class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500"
        >
          <p class="text-slate-600 text-sm font-semibold">Daily Revenue</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">
            {{ stats.dailyRevenue | currency }}
          </p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            class="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
          >
            📊 View Reports
          </button>
          <button
            class="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition"
          >
            👥 Manage Team
          </button>
          <button
            class="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
          >
            📦 View Products
          </button>
          <button
            class="px-4 py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      <!-- Recent Sales -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Recent Sales</h2>
        <p class="text-slate-600">
          Sales data will appear here once integrated with backend
        </p>
      </div>
    </div>
  `,
})
export class OwnerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats = {
    totalSales: 25000,
    activeProducts: 152,
    teamMembers: 8,
    dailyRevenue: 1250,
  };

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }
}
