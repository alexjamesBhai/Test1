import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../../../core/services/auth.service";
import { ApiService } from "../../../../core/services/api.service";
import { Product, Category } from "../../../../core/models/organization.model";
import { User } from "../../../../core/models/user.model";

@Component({
  selector: "app-products",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Products</h1>
          <p class="text-slate-600 mt-2">Manage your product catalog</p>
        </div>
        <button
          (click)="showAddProductForm = !showAddProductForm"
          class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
        >
          ➕ Add Product
        </button>
      </div>

      <!-- Add Product Form -->
      <div *ngIf="showAddProductForm" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Add New Product</h2>
        <form
          [formGroup]="productForm"
          (ngSubmit)="addProduct()"
          class="space-y-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Product Name</label
              >
              <input
                type="text"
                formControlName="name"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >SKU</label
              >
              <input
                type="text"
                formControlName="sku"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Category</label
              >
              <select
                formControlName="categoryId"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                <option *ngFor="let cat of categories" [value]="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Barcode</label
              >
              <input
                type="text"
                formControlName="barcode"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Selling Price</label
              >
              <input
                type="number"
                formControlName="price"
                step="0.01"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Cost Price</label
              >
              <input
                type="number"
                formControlName="costPrice"
                step="0.01"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Stock Quantity</label
              >
              <input
                type="number"
                formControlName="stock"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="flex gap-2">
            <button
              type="submit"
              [disabled]="productForm.invalid"
              class="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-slate-400 text-white rounded-lg font-semibold transition"
            >
              Create Product
            </button>
            <button
              type="button"
              (click)="showAddProductForm = false"
              class="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Filters -->
      <div class="flex gap-4 bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search products..."
          class="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option *ngFor="let cat of categories" [value]="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-slate-900"
              >
                Name
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-slate-900"
              >
                SKU
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-slate-900"
              >
                Price
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-slate-900"
              >
                Stock
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-slate-900"
              >
                Status
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold text-slate-900"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr
              *ngFor="let product of products"
              class="hover:bg-slate-50 transition"
            >
              <td class="px-6 py-4 text-sm text-slate-900 font-semibold">
                {{ product.name }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                {{ product.sku }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-900 font-semibold">
                {{ product.price | currency }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-900">
                <span
                  [class]="
                    product.stock > 10 ? 'text-green-600' : 'text-red-600'
                  "
                  class="font-semibold"
                >
                  {{ product.stock }} units
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <span
                  [class]="
                    product.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-700'
                  "
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {{ product.isActive ? "✅ Active" : "⏸ Inactive" }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm flex gap-2">
                <button
                  class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          *ngIf="products.length === 0"
          class="text-center py-8 text-slate-600"
        >
          No products found
        </div>
      </div>
    </div>
  `,
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  showAddProductForm = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
  ) {
    this.productForm = this.fb.group({
      name: ["", Validators.required],
      sku: ["", Validators.required],
      categoryId: ["", Validators.required],
      barcode: [""],
      price: ["", [Validators.required, Validators.min(0)]],
      costPrice: ["", [Validators.required, Validators.min(0)]],
      stock: ["", [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.organizationId) {
      this.loadProducts();
      this.loadCategories();
    }
  }

  private loadProducts(): void {
    if (!this.currentUser?.organizationId) return;

    this.apiService.getProducts(this.currentUser.organizationId).subscribe({
      next: (products) => {
        this.products = products;
      },
    });
  }

  private loadCategories(): void {
    if (!this.currentUser?.organizationId) return;

    this.apiService.getCategories(this.currentUser.organizationId).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
    });
  }

  addProduct(): void {
    if (!this.currentUser?.organizationId || this.productForm.invalid) return;

    this.apiService
      .createProduct(this.currentUser.organizationId, this.productForm.value)
      .subscribe({
        next: (newProduct) => {
          this.products.push(newProduct);
          this.productForm.reset();
          this.showAddProductForm = false;
        },
      });
  }
}
