# POSify - Multi-Tenant POS System

A production-ready, scalable, multi-tenant Point of Sale (POS) system built with Angular 20, TailwindCSS 3, and modern architecture patterns.

## 🎯 Overview

POSify is a complete POS solution designed for SaaS providers to manage multiple businesses/organizations with different user roles, strict access controls, and comprehensive business management features.

### Key Features

✅ **Multi-Tenant Architecture** - Complete data isolation per organization
✅ **Role-Based Access Control** - 4 distinct user roles with specific permissions
✅ **JWT Authentication** - Secure token-based authentication
✅ **Lazy-Loaded Modules** - Optimized performance with code splitting
✅ **POS Dashboard** - Fast, responsive POS interface optimized for touch and keyboard
✅ **Product Management** - Complete product catalog with categories and stock tracking
✅ **User Management** - Comprehensive user administration per organization
✅ **Receipt Generation** - Beautiful, printable receipts
✅ **Mobile Responsive** - Works seamlessly on desktop, tablet, and mobile

---

## 👥 User Roles & Permissions

### 1. **Admin (System Owner)**
The highest level with full system access.

**Permissions:**
- Access all organizations
- Create, edit, activate/deactivate organizations
- View and manage all users across all organizations
- Create users and assign roles
- Reset user passwords
- View system analytics and reports

**Routes:** `/admin/*`

### 2. **Business Owner (Organization Owner)**
Manages a single organization and its team.

**Permissions:**
- Access only their organization
- Edit organization details (name, logo, business info)
- Add and manage team members (create, deactivate, change passwords)
- Assign MANAGER and SALESPERSON roles
- View organization dashboard and reports
- Change their own password

**Routes:** `/owner/*`

### 3. **Manager**
Manages products and inventory within an organization.

**Permissions:**
- Manage product catalog
- Create and manage product categories
- Update product prices and stock levels
- View inventory reports
- ❌ No access to POS selling screen
- ❌ No access to organization settings
- ❌ No access to user management

**Routes:** `/manager/*`

### 4. **SalesPerson**
POS-only user for sales transactions.

**Permissions:**
- Create sales through POS
- Search and filter products
- Apply discounts and taxes
- Generate receipts
- View transaction history
- ❌ Auto-redirected to POS after login
- ❌ No access to dashboard or settings

**Routes:** `/pos/*`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                    # Core module (singleton services)
│   │   ├── models/              # Data models
│   │   │   ├── user.model.ts
│   │   │   └── organization.model.ts
│   │   ├── services/            # Core services
│   │   │   ├── auth.service.ts
│   │   │   └── api.service.ts
│   │   ├── guards/              # Route guards
│   │   │   ├── auth.guard.ts
│   │   │   ├── admin.guard.ts
│   │   │   ├── owner.guard.ts
│   │   │   ├── manager.guard.ts
│   │   │   └── salesperson.guard.ts
│   │   ├── interceptors/        # HTTP interceptors
│   │   │   └── auth.interceptor.ts
│   │   └── environments/        # Environment configs
│   │
│   ├── shared/                  # Shared module
│   │   ├── components/          # Reusable components
│   │   │   ├── header/
│   │   │   └── sidebar/
│   │   └── layouts/             # Layout components
│   │       └── main-layout.component.ts
│   │
│   ├── modules/                 # Feature modules (lazy-loaded)
│   │   ├── admin/               # Admin dashboard
│   │   │   ├── admin.routes.ts
│   │   │   └── pages/
│   │   │       ├── dashboard/
│   │   │       ├── organizations-grid/
│   │   │       └── users-management/
│   │   │
│   │   ├── owner/               # Business owner dashboard
│   │   │   ├── owner.routes.ts
│   │   │   └── pages/
│   │   │       ├── dashboard/
│   │   │       ├── settings/
│   │   │       └── users/
│   │   │
│   │   ├── manager/             # Product management
│   │   │   ├── manager.routes.ts
│   │   │   └── pages/
│   │   │       ├── products/
│   │   │       └── categories/
│   │   │
│   │   └── pos/                 # POS interface
│   │       ├── pos.routes.ts
│   │       └── pages/
│   │           └── dashboard/   # Full POS interface
│   │
│   ├── pages/                   # Public pages
│   │   ├── login/
│   │   └── access-denied/
│   │
│   ├── app.ts                   # Root component
│   ├── app.routes.ts            # Root routing
│   ├── app.config.ts            # App configuration
│   └── environments/            # Environment configs
│
├── styles.css                   # Global styles
├── tailwind.config.js           # Tailwind configuration
└── index.html                   # HTML entry point
```

---

## 🔐 Authentication Flow

### Login Process
1. User navigates to `/login`
2. Enters email and password
3. AuthService sends credentials to backend API
4. Backend returns JWT token + user data
5. Token stored in localStorage
6. User redirected based on role:
   - **ADMIN** → `/admin/dashboard`
   - **OWNER** → `/owner/dashboard`
   - **MANAGER** → `/manager/products`
   - **SALESPERSON** → `/pos/dashboard` (auto-redirect)

### Token Management
- JWT token stored in `localStorage` as `auth_token`
- User data cached as `auth_user`
- HTTP interceptor automatically adds token to all requests
- Token refresh on 401 errors (auto-retry)
- Logout clears all auth data

### Route Protection
- `authGuard` - Checks if user is authenticated
- `adminGuard` - Checks if user role is ADMIN
- `ownerGuard` - Checks if user role is OWNER with organization
- `managerGuard` - Checks if user is MANAGER or OWNER
- `salespersonGuard` - Checks if user is SALESPERSON

---

## 🏗️ Architecture Patterns

### 1. **Standalone Components**
All components use Angular's modern standalone pattern with self-contained imports.

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `...`
})
export class ExampleComponent { }
```

### 2. **Lazy-Loaded Feature Modules**
Routes are lazy-loaded to reduce initial bundle size.

```typescript
{
  path: 'admin',
  component: MainLayoutComponent,
  loadChildren: () => import('./modules/admin/admin.routes')
}
```

### 3. **Service Injection**
Core services are provided at root level for singleton pattern.

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService { }
```

### 4. **Observable Patterns**
RxJS observables for state management and async operations.

```typescript
public currentUser$ = new BehaviorSubject<User | null>(null);
```

---

## 🎨 UI/UX Design

### Design System
- **Colors**: Blue (#3b82f6) primary, Purple (#a855f7) secondary
- **Typography**: Inter font, clear hierarchy
- **Spacing**: Consistent 4px/8px grid system
- **Shadows**: Subtle, depth-based shadows
- **Radius**: 8px standard border radius
- **Icons**: Emoji for quick recognition

### Responsive Layout
- **Desktop** (1024px+): Full sidebar, multi-column grids
- **Tablet** (768px-1023px): Optimized grid layouts
- **Mobile** (<768px): Single column, touch-friendly buttons

### Key Components
- **Header**: Brand, user profile, quick access
- **Sidebar**: Role-based navigation menu
- **Main Layout**: Content area with padding
- **Cards**: Information containers with hover effects
- **Tables**: Sortable, searchable data presentation
- **Forms**: Validation, error messages, accessibility

---

## 📱 POS Module Highlights

### Features
✨ **Product Search** - By name or barcode
✨ **Category Filter** - Quick product filtering
✨ **Shopping Cart** - Add/remove items, adjust quantities
✨ **Discount & Tax** - Flexible pricing adjustments
✨ **Payment Methods** - Cash, Card, Check, Digital Wallet
✨ **Receipt Generation** - Professional, printable receipts
✨ **Keyboard Shortcuts** - Optimized for fast input
✨ **Touch-Friendly** - Large buttons, responsive layout

### POS Interface Layout
```
┌─────────────────────────────────────────────────────────────┐
│                    HEADER (User, Time)                      │
├────────────────────────────────┬──────────────────────────┤
│      PRODUCT BROWSER           │        SHOPPING CART      │
│   - Search Bar                 │   - Cart Items            │
│   - Category Filter            │   - Quantity Controls     │
│   - Product Grid               │   - Discount Input        │
│     (Click to add)             │   - Tax Input             │
│                                │   - Total Display         │
│                                │   - Payment Method        │
│                                │   - Action Buttons        │
└────────────────────────────────┴──────────────────────────┘
```

---

## 🔌 API Integration

### Environment Configuration
```typescript
// src/app/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Key API Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token

#### Organizations
- `GET /organizations` - List all (admin only)
- `POST /organizations` - Create new
- `GET /organizations/:id` - Get details
- `PUT /organizations/:id` - Update
- `PATCH /organizations/:id/toggle` - Activate/deactivate

#### Users
- `GET /organizations/:id/users` - List users in org
- `POST /organizations/:id/users` - Create user
- `PUT /organizations/:id/users/:userId` - Update user
- `PATCH /organizations/:id/users/:userId/deactivate` - Deactivate
- `POST /organizations/:id/users/:userId/reset-password` - Reset password

#### Products
- `GET /organizations/:id/products` - List products
- `GET /organizations/:id/products/search?q=query` - Search
- `GET /organizations/:id/products/barcode/:barcode` - Get by barcode
- `POST /organizations/:id/products` - Create product
- `PUT /organizations/:id/products/:productId` - Update

#### Categories
- `GET /organizations/:id/categories` - List categories
- `POST /organizations/:id/categories` - Create category
- `PUT /organizations/:id/categories/:categoryId` - Update

#### Sales
- `GET /organizations/:id/sales` - List sales
- `POST /organizations/:id/sales` - Create sale
- `GET /organizations/:id/sales/:saleId` - Get receipt

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern browser with ES6+ support

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Demo Credentials
```
Admin:
  Email: admin@posify.com
  Password: admin123

Business Owner:
  Email: owner@posify.com
  Password: owner123

Manager:
  Email: manager@posify.com
  Password: manager123

Sales Person:
  Email: sales@posify.com
  Password: sales123
```

---

## 🔧 Development

### Adding New Feature Pages
1. Create component in appropriate module folder
2. Add route to module's routing file
3. Update sidebar navigation if needed

### Adding New API Endpoints
1. Add method to `ApiService`
2. Add model if needed to `core/models`
3. Use in components via DI

### Styling
- Use TailwindCSS utilities in templates
- Follow color scheme in theme
- Maintain responsive design patterns
- Test on mobile devices

---

## 📊 Key Technologies

- **Framework**: Angular 20
- **Language**: TypeScript 5.8
- **Styling**: TailwindCSS 3.4.11
- **HTTP Client**: Angular HttpClient
- **Forms**: Angular Reactive Forms
- **Routing**: Angular Router with lazy loading
- **State**: RxJS Observables + BehaviorSubject

---

## 🎯 Next Steps for Backend Integration

1. **Update Environment URLs**
   - Change `apiUrl` in environment files
   - Configure CORS if needed

2. **Implement Backend API**
   - Follow the endpoint specifications
   - Return responses in expected format
   - Implement JWT authentication

3. **Test Integration**
   - Test each module with real data
   - Verify role-based access control
   - Test error handling

4. **Deploy**
   - Build with `npm run build`
   - Deploy built files to hosting
   - Configure production API URLs

---

## 📝 License

This project is proprietary and confidential.

---

## 🤝 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ using Angular 20 & TailwindCSS**
