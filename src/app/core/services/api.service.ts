import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Organization, Product, Category, Sale } from '../models/organization.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Organizations
  getAllOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.baseUrl}/organizations`);
  }

  getOrganization(id: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.baseUrl}/organizations/${id}`);
  }

  createOrganization(data: Partial<Organization>): Observable<Organization> {
    return this.http.post<Organization>(`${this.baseUrl}/organizations`, data);
  }

  updateOrganization(id: string, data: Partial<Organization>): Observable<Organization> {
    return this.http.put<Organization>(`${this.baseUrl}/organizations/${id}`, data);
  }

  toggleOrganization(id: string, isActive: boolean): Observable<Organization> {
    return this.http.patch<Organization>(`${this.baseUrl}/organizations/${id}/toggle`, { isActive });
  }

  // Users
  getOrganizationUsers(organizationId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/organizations/${organizationId}/users`);
  }

  createUser(organizationId: string, data: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/organizations/${organizationId}/users`, data);
  }

  updateUser(organizationId: string, userId: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/organizations/${organizationId}/users/${userId}`, data);
  }

  deactivateUser(organizationId: string, userId: string): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/organizations/${organizationId}/users/${userId}/deactivate`, {});
  }

  resetUserPassword(organizationId: string, userId: string, newPassword: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}/organizations/${organizationId}/users/${userId}/reset-password`, { newPassword });
  }

  // Products
  getProducts(organizationId: string, categoryId?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }
    return this.http.get<Product[]>(`${this.baseUrl}/organizations/${organizationId}/products`, { params });
  }

  searchProducts(organizationId: string, query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/organizations/${organizationId}/products/search?q=${query}`);
  }

  getProductByBarcode(organizationId: string, barcode: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/organizations/${organizationId}/products/barcode/${barcode}`);
  }

  createProduct(organizationId: string, data: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/organizations/${organizationId}/products`, data);
  }

  updateProduct(organizationId: string, productId: string, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/organizations/${organizationId}/products/${productId}`, data);
  }

  // Categories
  getCategories(organizationId: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/organizations/${organizationId}/categories`);
  }

  createCategory(organizationId: string, data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/organizations/${organizationId}/categories`, data);
  }

  updateCategory(organizationId: string, categoryId: string, data: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/organizations/${organizationId}/categories/${categoryId}`, data);
  }

  // Sales
  getSales(organizationId: string): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.baseUrl}/organizations/${organizationId}/sales`);
  }

  createSale(organizationId: string, data: Partial<Sale>): Observable<Sale> {
    return this.http.post<Sale>(`${this.baseUrl}/organizations/${organizationId}/sales`, data);
  }

  getSaleReceipt(organizationId: string, saleId: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.baseUrl}/organizations/${organizationId}/sales/${saleId}`);
  }
}
