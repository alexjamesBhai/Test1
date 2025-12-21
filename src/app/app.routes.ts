import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { AccessDeniedComponent } from "./pages/access-denied/access-denied.component";
import { authGuard } from "./core/guards/auth.guard";
import { MainLayoutComponent } from "./shared/layouts/main-layout.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "access-denied", component: AccessDeniedComponent },

  {
    path: "admin",
    component: MainLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import("./modules/admin/admin.routes").then((m) => m.ADMIN_ROUTES),
  },

  {
    path: "owner",
    component: MainLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import("./modules/owner/owner.routes").then((m) => m.OWNER_ROUTES),
  },

  {
    path: "manager",
    component: MainLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () =>
      import("./modules/manager/manager.routes").then((m) => m.MANAGER_ROUTES),
  },

  {
    path: "pos",
    canActivate: [authGuard],
    loadChildren: () =>
      import("./modules/pos/pos.routes").then((m) => m.POS_ROUTES),
  },

  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "**", redirectTo: "/login" },
];
