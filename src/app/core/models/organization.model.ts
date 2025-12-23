export interface Organization {
  id: string;
  name: string;
  businessType: number;
  businessTypeId?: number;
  nameEn?: string;
  nameAr?: string;
  description?: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
  whatsApp?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  googleMapLink?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  licenseStartDate?: string;
  licenseEndDate?: string;
  isTrial?: boolean;
  timezone?: string;
  currencyCode?: number;
  allowMultiBranch?: boolean;
  allowMultiUser?: boolean;
  defaultLanguage?: string;
  active?: boolean;
  isActive?: boolean;
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}

export interface OrganizationListItem {
  businessTypeId: number;
  nameEn?: string;
  nameAr?: string;
  id: string;
  name: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  ownerName?: string;
  ownerPhone?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
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
