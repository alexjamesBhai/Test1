import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-access-denied",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center p-4"
    >
      <div class="text-center text-white">
        <h1 class="text-6xl font-bold mb-4">🚫</h1>
        <h2 class="text-4xl font-bold mb-4">Access Denied</h2>
        <p class="text-xl text-red-100 mb-8">
          You don't have permission to access this page.
        </p>
        <a
          routerLink="/"
          class="px-8 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-red-50 transition inline-block"
        >
          Go Back Home
        </a>
      </div>
    </div>
  `,
})
export class AccessDeniedComponent {}
