import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ApiService } from '../../../../core/services/api.service';
import { Category } from '../../../../core/models/organization.model';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Categories</h1>
          <p class="text-slate-600 mt-2">Organize your products into categories</p>
        </div>
        <button
          (click)="showAddCategoryForm = !showAddCategoryForm"
          class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
        >
          ➕ Add Category
        </button>
      </div>

      <!-- Add Category Form -->
      <div *ngIf="showAddCategoryForm" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Add New Category</h2>
        <form [formGroup]="categoryForm" (ngSubmit)="addCategory()" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Category Name</label>
            <input
              type="text"
              formControlName="name"
              placeholder="e.g., Electronics, Clothing, Food"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              formControlName="description"
              placeholder="Optional description for this category"
              rows="3"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="flex gap-2">
            <button
              type="submit"
              [disabled]="categoryForm.invalid"
              class="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-slate-400 text-white rounded-lg font-semibold transition"
            >
              Create Category
            </button>
            <button
              type="button"
              (click)="showAddCategoryForm = false"
              class="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let category of categories" class="bg-white rounded-lg shadow p-6 border border-slate-200 hover:shadow-lg transition">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-bold text-slate-900">{{ category.name }}</h3>
              <p class="text-sm text-slate-600 mt-2">{{ category.description || 'No description' }}</p>
            </div>
            <span
              [class]="category.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'"
              class="px-3 py-1 rounded-full text-xs font-semibold ml-2"
            >
              {{ category.isActive ? '✅' : '⏸' }}
            </span>
          </div>

          <p class="text-xs text-slate-500 mb-4">
            Created: {{ category.createdAt | date: 'short' }}
          </p>

          <div class="flex gap-2">
            <button class="flex-1 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold transition text-sm">
              ✏️ Edit
            </button>
            <button class="flex-1 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold transition text-sm">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="categories.length === 0" class="text-center py-12 bg-white rounded-lg">
        <p class="text-slate-600 text-lg">No categories yet</p>
        <p class="text-slate-500 text-sm mt-2">Create your first category to get started</p>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  showAddCategoryForm = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.organizationId) {
      this.loadCategories();
    }
  }

  private loadCategories(): void {
    if (!this.currentUser?.organizationId) return;

    this.apiService.getCategories(this.currentUser.organizationId).subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  addCategory(): void {
    if (!this.currentUser?.organizationId || this.categoryForm.invalid) return;

    this.apiService.createCategory(this.currentUser.organizationId, this.categoryForm.value).subscribe({
      next: (newCategory) => {
        this.categories.push(newCategory);
        this.categoryForm.reset();
        this.showAddCategoryForm = false;
      }
    });
  }
}
