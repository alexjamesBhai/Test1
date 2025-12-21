import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ApiService } from '../../../../core/services/api.service';
import { Product, Category, SaleItem } from '../../../../core/models/organization.model';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-pos-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-screen flex gap-4 bg-slate-50 p-4 overflow-hidden">
      <!-- Left: Product Browser -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow p-4 mb-4">
          <h1 class="text-2xl font-bold text-slate-900 mb-4">Point of Sale</h1>

          <!-- Search and Filters -->
          <div class="space-y-4">
            <input
              type="text"
              placeholder="🔍 Search by product name or barcode..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange()"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <!-- Category Filter -->
            <div class="flex gap-2 overflow-x-auto pb-2">
              <button
                (click)="selectedCategory = null"
                [class.bg-blue-600]="selectedCategory === null"
                [class.text-white]="selectedCategory === null"
                [class.bg-slate-200]="selectedCategory !== null"
                [class.text-slate-700]="selectedCategory !== null"
                class="px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition"
              >
                All Products
              </button>
              <button
                *ngFor="let category of categories"
                (click)="selectedCategory = category.id"
                [class.bg-blue-600]="selectedCategory === category.id"
                [class.text-white]="selectedCategory === category.id"
                [class.bg-slate-200]="selectedCategory !== category.id"
                [class.text-slate-700]="selectedCategory !== category.id"
                class="px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition"
              >
                {{ category.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="flex-1 overflow-y-auto">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              *ngFor="let product of filteredProducts"
              (click)="addToCart(product)"
              class="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg hover:scale-105 transition transform"
            >
              <div class="bg-slate-100 rounded-lg h-40 mb-3 flex items-center justify-center text-4xl">
                📦
              </div>
              <h3 class="font-semibold text-slate-900 text-sm truncate">{{ product.name }}</h3>
              <p class="text-xs text-slate-600">SKU: {{ product.sku }}</p>
              <p class="text-blue-600 font-bold mt-2">{{ product.price | currency }}</p>
              <p [class]="product.stock > 0 ? 'text-green-600' : 'text-red-600'" class="text-xs font-semibold">
                {{ product.stock > 0 ? product.stock + ' in stock' : 'Out of stock' }}
              </p>
            </div>
          </div>

          <div *ngIf="filteredProducts.length === 0" class="text-center py-12 text-slate-600">
            <p class="text-lg">No products found</p>
          </div>
        </div>
      </div>

      <!-- Right: Cart -->
      <div class="w-80 flex flex-col bg-white rounded-lg shadow overflow-hidden">
        <!-- Cart Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <h2 class="text-xl font-bold">🛒 Cart</h2>
          <p class="text-sm text-blue-100" *ngIf="cartItems.length > 0">{{ cartItems.length }} item(s)</p>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div *ngIf="cartItems.length === 0" class="text-center text-slate-600 py-8">
            Cart is empty
          </div>

          <div *ngFor="let item of cartItems; let i = index" class="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <p class="font-semibold text-slate-900 text-sm">{{ item.productName }}</p>
                <p class="text-xs text-slate-600">{{ item.price | currency }} each</p>
              </div>
              <button
                (click)="removeFromCart(i)"
                class="text-red-600 hover:text-red-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button
                (click)="decreaseQuantity(i)"
                class="px-2 py-1 bg-slate-300 hover:bg-slate-400 rounded text-sm font-bold"
              >
                −
              </button>
              <input
                type="number"
                [(ngModel)]="item.quantity"
                (ngModelChange)="calculateTotals()"
                class="w-12 text-center border border-slate-300 rounded py-1 text-sm"
                min="1"
              />
              <button
                (click)="increaseQuantity(i)"
                class="px-2 py-1 bg-slate-300 hover:bg-slate-400 rounded text-sm font-bold"
              >
                +
              </button>
            </div>

            <div class="mt-2 pt-2 border-t border-slate-200 flex justify-between">
              <span class="text-xs text-slate-600">Subtotal:</span>
              <span class="font-semibold text-slate-900">{{ item.price * item.quantity | currency }}</span>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="border-t border-slate-200 p-4 space-y-3">
          <!-- Discount -->
          <div class="flex gap-2">
            <input
              type="number"
              [(ngModel)]="discount"
              (ngModelChange)="calculateTotals()"
              placeholder="Discount %"
              class="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
            />
            <div class="text-right">
              <p class="text-xs text-slate-600">Discount</p>
              <p class="font-bold text-slate-900">-{{ discountAmount | currency }}</p>
            </div>
          </div>

          <!-- Tax -->
          <div class="flex gap-2">
            <input
              type="number"
              [(ngModel)]="taxRate"
              (ngModelChange)="calculateTotals()"
              placeholder="Tax %"
              class="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
            />
            <div class="text-right">
              <p class="text-xs text-slate-600">Tax</p>
              <p class="font-bold text-slate-900">+{{ taxAmount | currency }}</p>
            </div>
          </div>

          <!-- Totals -->
          <div class="bg-slate-50 rounded-lg p-3 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">Subtotal:</span>
              <span class="font-semibold text-slate-900">{{ subtotal | currency }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold border-t pt-2">
              <span class="text-slate-900">Total:</span>
              <span class="text-blue-600">{{ total | currency }}</span>
            </div>
          </div>

          <!-- Payment Method -->
          <select
            [(ngModel)]="paymentMethod"
            class="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CASH">💵 Cash</option>
            <option value="CARD">💳 Card</option>
            <option value="CHECK">✓ Check</option>
            <option value="DIGITAL_WALLET">📱 Digital Wallet</option>
          </select>

          <!-- Action Buttons -->
          <button
            (click)="completeSale()"
            [disabled]="cartItems.length === 0"
            class="w-full px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-slate-400 text-white rounded-lg font-bold transition"
          >
            ✓ Complete Sale
          </button>

          <button
            (click)="clearCart()"
            [disabled]="cartItems.length === 0"
            class="w-full px-4 py-2 bg-slate-300 hover:bg-slate-400 disabled:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
          >
            Clear Cart
          </button>

          <button
            (click)="showReceipt = !showReceipt"
            class="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition"
          >
            🧾 Receipt
          </button>
        </div>
      </div>

      <!-- Receipt Modal -->
      <div *ngIf="showReceipt" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 max-h-screen overflow-y-auto">
          <div class="text-center mb-6 pb-4 border-b-2 border-slate-200">
            <h3 class="text-2xl font-bold text-slate-900">Receipt</h3>
            <p class="text-sm text-slate-600">{{ getCurrentDate() }}</p>
          </div>

          <div class="space-y-4 mb-6">
            <div *ngFor="let item of cartItems" class="flex justify-between text-sm">
              <span class="text-slate-700">{{ item.productName }}</span>
              <span class="font-semibold text-slate-900">{{ item.price * item.quantity | currency }}</span>
            </div>
          </div>

          <div class="border-t-2 border-slate-200 pt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">Subtotal:</span>
              <span>{{ subtotal | currency }}</span>
            </div>
            <div class="flex justify-between text-sm" *ngIf="discountAmount > 0">
              <span class="text-slate-600">Discount:</span>
              <span class="text-red-600">-{{ discountAmount | currency }}</span>
            </div>
            <div class="flex justify-between text-sm" *ngIf="taxAmount > 0">
              <span class="text-slate-600">Tax:</span>
              <span class="text-slate-900">{{ taxAmount | currency }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span class="text-blue-600">{{ total | currency }}</span>
            </div>
            <div class="flex justify-between text-sm mt-4">
              <span class="text-slate-600">Payment Method:</span>
              <span class="font-semibold text-slate-900">{{ paymentMethod }}</span>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t-2 border-slate-200 text-center text-xs text-slate-600">
            <p>Thank you for your purchase!</p>
            <p>Keep your receipt for warranty & returns</p>
          </div>

          <button
            (click)="showReceipt = false"
            class="w-full mt-6 px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded-lg font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }
  `]
})
export class PosDashboardComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  cartItems: SaleItem[] = [];
  currentUser: User | null = null;

  // Filters
  searchQuery = '';
  selectedCategory: string | null = null;

  // Cart values
  discount = 0;
  taxRate = 0;
  paymentMethod = 'CASH';
  showReceipt = false;

  // Calculated values
  subtotal = 0;
  discountAmount = 0;
  taxAmount = 0;
  total = 0;

  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            p.sku.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            (p.barcode?.toLowerCase().includes(this.searchQuery.toLowerCase()) || false);
      const matchesCategory = !this.selectedCategory || p.categoryId === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

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
        this.products = products.filter(p => p.isActive && p.stock > 0);
      }
    });
  }

  private loadCategories(): void {
    if (!this.currentUser?.organizationId) return;

    this.apiService.getCategories(this.currentUser.organizationId).subscribe({
      next: (categories) => {
        this.categories = categories.filter(c => c.isActive);
      }
    });
  }

  onSearchChange(): void {
    // Filtered products are computed dynamically
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.productId === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++;
      }
    } else {
      this.cartItems.push({
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        discount: 0
      });
    }

    this.calculateTotals();
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.calculateTotals();
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    this.calculateTotals();
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
    } else {
      this.removeFromCart(index);
    }
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.discountAmount = (this.subtotal * this.discount) / 100;
    const afterDiscount = this.subtotal - this.discountAmount;
    this.taxAmount = (afterDiscount * this.taxRate) / 100;
    this.total = afterDiscount + this.taxAmount;
  }

  clearCart(): void {
    this.cartItems = [];
    this.discount = 0;
    this.taxRate = 0;
    this.calculateTotals();
  }

  completeSale(): void {
    if (this.cartItems.length === 0 || !this.currentUser?.organizationId) return;

    const sale: Partial<any> = {
      items: this.cartItems,
      subtotal: this.subtotal,
      tax: this.taxAmount,
      discount: this.discountAmount,
      total: this.total,
      paymentMethod: this.paymentMethod as 'CASH' | 'CARD' | 'CHECK' | 'DIGITAL_WALLET',
      status: 'COMPLETED'
    };

    this.apiService.createSale(this.currentUser.organizationId, sale).subscribe({
      next: () => {
        // Show success message
        alert('Sale completed successfully!');
        this.clearCart();
        this.showReceipt = false;
      },
      error: () => {
        alert('Error completing sale');
      }
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
