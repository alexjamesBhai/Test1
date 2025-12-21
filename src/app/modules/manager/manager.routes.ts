import { Routes } from "@angular/router";
import { managerGuard } from "../../core/guards/manager.guard";
import { ProductsComponent } from "./pages/products/products.component";
import { CategoriesComponent } from "./pages/categories/categories.component";

export const MANAGER_ROUTES: Routes = [
  {
    path: "",
    canActivate: [managerGuard],
    children: [
      { path: "products", component: ProductsComponent },
      { path: "categories", component: CategoriesComponent },
      { path: "", redirectTo: "products", pathMatch: "full" },
    ],
  },
];
