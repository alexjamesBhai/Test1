export interface Organization {
  id: string;
  name: string;
  businessType: string;
  ownerEmail: string;
  isActive: boolean;
  createdAt: Date;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  price: number;
  costPrice: number;
  stock: number;
  image?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Sale {
  id: string;
  organizationId: string;
  salePersonId: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "CASH" | "CARD" | "CHECK" | "DIGITAL_WALLET";
  status: "COMPLETED" | "PENDING" | "CANCELLED";
  notes?: string;
  createdAt: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
}
