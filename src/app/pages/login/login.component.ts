import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { User } from "../../core/models/user.model";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-4"
    >
      <div class="w-full max-w-md">
        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1
              class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
            >
              POSify
            </h1>
            <p class="text-slate-600 text-sm">Multi-Tenant POS System</p>
          </div>

          <!-- Form -->
          <form
            [formGroup]="loginForm"
            (ngSubmit)="onSubmit()"
            class="space-y-5"
          >
            <!-- Email Input -->
            <div>
              <label
                for="email"
                class="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="you@example.com"
                class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p
                *ngIf="email.invalid && email.touched"
                class="text-red-500 text-xs mt-1"
              >
                Please enter a valid email
              </p>
            </div>

            <!-- Password Input -->
            <div>
              <label
                for="password"
                class="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p
                *ngIf="password.invalid && password.touched"
                class="text-red-500 text-xs mt-1"
              >
                Password is required
              </p>
            </div>

            <!-- Error Message -->
            <div
              *ngIf="errorMessage"
              class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <span *ngIf="!isLoading">Sign In</span>
              <span *ngIf="isLoading" class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 50 50">
                  <circle
                    class="opacity-30"
                    cx="25"
                    cy="25"
                    r="20"
                    stroke="currentColor"
                    stroke-width="5"
                    fill="none"
                  />
                  <circle
                    class="text-white"
                    cx="25"
                    cy="25"
                    r="20"
                    stroke="currentColor"
                    stroke-width="5"
                    fill="none"
                    stroke-dasharray="100"
                    stroke-dashoffset="75"
                  />
                </svg>
                Signing in...
              </span>
            </button>
          </form>

          <!-- Sign Up Link -->
          <div class="mt-6 text-center">
            <p class="text-slate-600 text-sm">
              Don't have an account?
              <a
                routerLink="/signup"
                class="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Create one here
              </a>
            </p>
          </div>

          <!-- Forgot Password Link -->
          <div class="text-center mt-2">
            <a href="#" class="text-slate-500 hover:text-slate-700 text-sm">
              Forgot password?
            </a>
          </div>
        </div>

        <!-- Footer -->
        <p class="text-center text-white text-xs mt-6">
          © 2024 POSify. All rights reserved.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background: linear-gradient(to bottom right, #3b82f6, #a855f7);
        min-height: 100vh;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // If already logged in, redirect based on role
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.redirectByRole(currentUser.role);
    }
  }

  get email() {
    return this.loginForm.get("email")!;
  }

  get password() {
    return this.loginForm.get("password")!;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = "";

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess && response.response?.accessToken?.token) {
          const token = response.response.accessToken.token;
          const role = this.extractRoleFromToken(token);
          this.redirectByRole(role);
        } else {
          this.errorMessage = response.message || "Login failed. Please try again.";
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || "Login failed. Please try again.";
      },
    });
  }

  private extractRoleFromToken(
    token: string,
  ): "ADMIN" | "OWNER" | "MANAGER" | "SALESPERSON" {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const roleStr =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      const roleMap: {
        [key: string]: "ADMIN" | "OWNER" | "MANAGER" | "SALESPERSON";
      } = {
        Admin: "ADMIN",
        Owner: "OWNER",
        Manager: "MANAGER",
        SalesPerson: "SALESPERSON",
      };

      return roleMap[roleStr] || "SALESPERSON";
    } catch (error) {
      console.error("Error extracting role from token:", error);
      return "SALESPERSON";
    }
  }

  private redirectByRole(role: "ADMIN" | "OWNER" | "MANAGER" | "SALESPERSON"): void {
    switch (role) {
      case "ADMIN":
        this.router.navigate(["/admin/dashboard"]);
        break;
      case "OWNER":
        this.router.navigate(["/owner/dashboard"]);
        break;
      case "MANAGER":
        this.router.navigate(["/manager/products"]);
        break;
      case "SALESPERSON":
        this.router.navigate(["/pos/dashboard"]);
        break;
      default:
        this.router.navigate(["/"]);
    }
  }
}
