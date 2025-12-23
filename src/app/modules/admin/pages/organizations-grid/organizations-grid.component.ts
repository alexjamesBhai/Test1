import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { OrganizationService } from "../../../../core/services/organization.service";
import {
  OrganizationListItem,
  PaginatedResponse,
} from "../../../../core/models/organization.model";

@Component({
  selector: "app-organizations-grid",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Organizations</h1>
          <p class="text-slate-600 mt-2">Manage all business organizations</p>
        </div>
        <button
          (click)="openCreateForm()"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          ➕ New Organization
        </button>
      </div>

      <!-- Search -->
      <div class="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (keyup)="onSearchChange()"
          placeholder="Search by name, email, or owner..."
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex items-center justify-center py-12">
        <svg class="animate-spin h-12 w-12 text-blue-500" viewBox="0 0 50 50">
          <circle
            class="opacity-30"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            stroke-width="5"
            fill="none"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            stroke-width="5"
            fill="none"
            stroke-dasharray="100"
            stroke-dashoffset="75"
          />
        </svg>
      </div>

      <!-- Table View -->
      <div *ngIf="!isLoading && organizations.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-slate-100 border-b border-slate-300">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Organization Name</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Owner</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Phone</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900">Business Type</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr
              *ngFor="let org of filteredOrganizations"
              class="hover:bg-slate-50 transition"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    *ngIf="org.logoUrl"
                    [src]="org.logoUrl"
                    alt="{{ org.name }}"
                    class="w-10 h-10 rounded-lg object-cover"
                    onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Crect fill=%22%23e2e8f0%22 width=%2240%22 height=%2240%22/%3E%3Ctext x=%2220%22 y=%2224%22 font-size=%2214%22 fill=%22%239ca3af%22 text-anchor=%22middle%22%3E%3F%3C/text%3E%3C/svg%3E'"
                  />
                  <div
                    *ngIf="!org.logoUrl"
                    class="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600"
                  >
                    {{ org.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900">{{ org.name }}</p>
                    <p class="text-xs text-slate-500">{{ org.nameEn }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-700">
                {{ org.ownerName || "-" }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-700">
                {{ org.email || "-" }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-700">
                {{ org.phone || "-" }}
              </td>
              <td class="px-6 py-4 text-sm">
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {{ getBusinessTypeName(org.businessTypeId) }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    (click)="editOrganization(org.id)"
                    class="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded font-semibold transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    (click)="deleteOrganization(org.id)"
                    class="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded font-semibold transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div
        *ngIf="!isLoading && organizations.length === 0"
        class="text-center py-12 bg-white rounded-lg"
      >
        <p class="text-slate-600 text-lg">No organizations found</p>
      </div>

      <!-- Pagination -->
      <div
        *ngIf="!isLoading && totalPages > 1"
        class="flex items-center justify-between bg-white rounded-lg shadow p-4"
      >
        <div class="text-sm text-slate-600">
          Showing
          <span class="font-semibold">{{ (currentPage - 1) * pageSize + 1 }}</span>
          to
          <span class="font-semibold">{{
            Math.min(currentPage * pageSize, totalRecords)
          }}</span>
          of
          <span class="font-semibold">{{ totalRecords }}</span>
          organizations
        </div>

        <div class="flex items-center gap-2">
          <button
            (click)="previousPage()"
            [disabled]="currentPage === 1"
            class="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition"
          >
            ← Previous
          </button>

          <div class="flex gap-1">
            <button
              *ngFor="let page of getPageNumbers()"
              (click)="goToPage(page)"
              [class]="
                page === currentPage
                  ? 'px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold'
                  : 'px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-100'
              "
            >
              {{ page }}
            </button>
          </div>

          <button
            (click)="nextPage()"
            [disabled]="currentPage === totalPages"
            class="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition"
          >
            Next →
          </button>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm text-slate-600">Items per page:</label>
          <select
            [(ngModel)]="pageSize"
            (change)="onPageSizeChange()"
            class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option [value]="10">10</option>
            <option [value]="15">15</option>
            <option [value]="25">25</option>
            <option [value]="50">50</option>
          </select>
        </div>
      </div>
    </div>
  `,
})
export class OrganizationsGridComponent implements OnInit {
  organizations: OrganizationListItem[] = [];
  filteredOrganizations: OrganizationListItem[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 15;
  totalRecords = 0;
  totalPages = 1;
  searchQuery = "";
  private searchTimeout: any;

  readonly Math = Math;

  constructor(private organizationService: OrganizationService) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.isLoading = true;
    this.organizationService.getOrganizations(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<OrganizationListItem>) => {
        this.organizations = response.items;
        this.filteredOrganizations = response.items;
        this.totalRecords = response.totalRecords;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading organizations:", error);
        this.isLoading = false;
      },
    });
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.filterOrganizations();
    }, 300);
  }

  private filterOrganizations(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredOrganizations = this.organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(query) ||
        org.email?.toLowerCase().includes(query) ||
        org.ownerName?.toLowerCase().includes(query),
    );
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadOrganizations();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadOrganizations();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadOrganizations();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadOrganizations();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  openCreateForm(): void {
    this.router.navigate(["/admin/organizations/new"]);
  }

  editOrganization(id: string): void {
    this.router.navigate(["/admin/organizations", id, "edit"]);
  }

  private router = inject(Router);

  deleteOrganization(id: string): void {
    if (confirm("Are you sure you want to delete this organization?")) {
      this.organizationService.deleteOrganization(id).subscribe({
        next: () => {
          this.loadOrganizations();
        },
        error: (error) => {
          console.error("Error deleting organization:", error);
        },
      });
    }
  }

  getBusinessTypeName(businessTypeId?: number): string {
    const businessTypes: { [key: number]: string } = {
      1: "Restaurant",
      2: "Retail",
      3: "Pharmacy",
      4: "Supermarket",
      5: "Salon",
    };
    return businessTypes[businessTypeId || 1] || "Unknown";
  }
}
