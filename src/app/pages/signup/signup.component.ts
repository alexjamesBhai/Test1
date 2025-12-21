import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              POSify
            </h1>
            <p class="text-slate-600 text-sm">Create Account</p>
          </div>

          <!-- Form -->
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- First Name -->
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label for="firstName" class="block text-sm font-semibold text-slate-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  formControlName="firstName"
                  placeholder="John"
                  class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                />
                <p *ngIf="firstName.invalid && firstName.touched" class="text-red-500 text-xs mt-1">
                  Required
                </p>
              </div>

              <!-- Last Name -->
              <div>
                <label for="lastName" class="block text-sm font-semibold text-slate-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  formControlName="lastName"
                  placeholder="Doe"
                  class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                />
                <p *ngIf="lastName.invalid && lastName.touched" class="text-red-500 text-xs mt-1">
                  Required
                </p>
              </div>
            </div>

            <!-- Email Input -->
            <div>
              <label for="email" class="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="you@example.com"
                class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p *ngIf="email.invalid && email.touched" class="text-red-500 text-xs mt-1">
                Please enter a valid email
              </p>
            </div>

            <!-- Phone Number -->
            <div>
              <label for="phoneNumber" class="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                formControlName="phoneNumber"
                placeholder="+1 234 567 8900"
                class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <!-- Date of Birth -->
            <div>
              <label for="dob" class="block text-sm font-semibold text-slate-700 mb-2">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                formControlName="dob"
                class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p *ngIf="dob.invalid && dob.touched" class="text-red-500 text-xs mt-1">
                Required
              </p>
            </div>

            <!-- Gender -->
            <div>
              <label for="gender" class="block text-sm font-semibold text-slate-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                formControlName="gender"
                class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select Gender</option>
                <option value="0">Male</option>
                <option value="1">Female</option>
                <option value="2">Other</option>
              </select>
              <p *ngIf="gender.invalid && gender.touched" class="text-red-500 text-xs mt-1">
                Required
              </p>
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p *ngIf="password.invalid && password.touched" class="text-red-500 text-xs mt-1">
                Password must be at least 6 characters
              </p>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="signupForm.invalid || isLoading"
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <span *ngIf="!isLoading">Create Account</span>
              <span *ngIf="isLoading" class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 50 50">
                  <circle class="opacity-30" cx="25" cy="25" r="20" stroke="currentColor" stroke-width="5" fill="none" />
                  <circle class="text-white" cx="25" cy="25" r="20" stroke="currentColor" stroke-width="5" fill="none" stroke-dasharray="100" stroke-dashoffset="75" />
                </svg>
                Creating...
              </span>
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <p class="text-slate-600 text-sm">
              Already have an account?
              <a routerLink="/login" class="text-blue-600 hover:text-blue-700 font-semibold">
                Sign In
              </a>
            </p>
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
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.signupForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: [""],
      dob: ["", Validators.required],
      gender: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  get firstName() {
    return this.signupForm.get("firstName")!;
  }

  get lastName() {
    return this.signupForm.get("lastName")!;
  }

  get email() {
    return this.signupForm.get("email")!;
  }

  get phoneNumber() {
    return this.signupForm.get("phoneNumber")!;
  }

  get dob() {
    return this.signupForm.get("dob")!;
  }

  get gender() {
    return this.signupForm.get("gender")!;
  }

  get password() {
    return this.signupForm.get("password")!;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = "";

    const formValue = this.signupForm.value;
    const signupData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      dob: new Date(formValue.dob).toISOString(),
      gender: parseInt(formValue.gender),
      password: formValue.password,
      roles: ["User"],
    };

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          alert(
            "Account created successfully! Please log in with your credentials.",
          );
          this.router.navigate(["/login"]);
        } else {
          this.errorMessage = response.message || "Signup failed";
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.message || "Signup failed. Please try again.";
      },
    });
  }
}
