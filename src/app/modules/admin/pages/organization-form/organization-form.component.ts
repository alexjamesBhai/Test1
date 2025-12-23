import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { OrganizationService } from "../../../../core/services/organization.service";
import { MasterDataService } from "../../../../core/services/master-data.service";
import { Organization } from "../../../../core/models/organization.model";
import {
  Nationality,
  BusinessType,
  Currency,
} from "../../../../core/models/master-data.model";

@Component({
  selector: "app-organization-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">
          {{ isEditMode ? "Edit Organization" : "Create Organization" }}
        </h1>
        <p class="text-slate-600 mt-2">
          {{
            isEditMode
              ? "Update organization details"
              : "Add a new business organization"
          }}
        </p>
      </div>

      <form
        [formGroup]="organizationForm"
        (ngSubmit)="onSubmit()"
        class="space-y-8"
      >
        <!-- Basic Information Section -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-6">
            Basic Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Organization Name -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Organization Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="name"
                placeholder="Enter organization name"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p
                *ngIf="name.invalid && name.touched"
                class="text-red-500 text-xs mt-1"
              >
                Organization name is required
              </p>
            </div>

            <!-- Business Type -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Business Type <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="businessType"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select business type</option>
                <option *ngFor="let type of businessTypes" [value]="type.id">
                  {{ type.name }}
                </option>
              </select>
              <p
                *ngIf="businessType.invalid && businessType.touched"
                class="text-red-500 text-xs mt-1"
              >
                Business type is required
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                formControlName="email"
                placeholder="info@organization.com"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p
                *ngIf="email.invalid && email.touched"
                class="text-red-500 text-xs mt-1"
              >
                Valid email is required
              </p>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Phone <span class="text-red-500">*</span>
              </label>
              <input
                type="tel"
                formControlName="phone"
                placeholder="+1234567890"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p
                *ngIf="phone.invalid && phone.touched"
                class="text-red-500 text-xs mt-1"
              >
                Phone is required
              </p>
            </div>

            <!-- WhatsApp -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                formControlName="whatsApp"
                placeholder="+1234567890"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Website -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Website
              </label>
              <input
                type="url"
                formControlName="website"
                placeholder="https://example.com"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Description -->
          <div class="mt-6">
            <label class="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              formControlName="description"
              placeholder="Enter organization description"
              rows="4"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <!-- Owner Information Section -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-6">
            Owner Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Owner Name -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Owner Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="ownerName"
                placeholder="Enter owner name"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p
                *ngIf="ownerName.invalid && ownerName.touched"
                class="text-red-500 text-xs mt-1"
              >
                Owner name is required
              </p>
            </div>

            <!-- Owner Email -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Owner Email <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                formControlName="ownerEmail"
                placeholder="owner@example.com"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p
                *ngIf="ownerEmail.invalid && ownerEmail.touched"
                class="text-red-500 text-xs mt-1"
              >
                Valid owner email is required
              </p>
            </div>

            <!-- Owner Phone -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Owner Phone <span class="text-red-500">*</span>
              </label>
              <input
                type="tel"
                formControlName="ownerPhone"
                placeholder="+1234567890"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p
                *ngIf="ownerPhone.invalid && ownerPhone.touched"
                class="text-red-500 text-xs mt-1"
              >
                Owner phone is required
              </p>
            </div>
          </div>
        </div>

        <!-- Address Information Section -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-6">
            Address Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Address Line 1 -->
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Address Line 1 <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="addressLine1"
                placeholder="Street address"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p
                *ngIf="addressLine1.invalid && addressLine1.touched"
                class="text-red-500 text-xs mt-1"
              >
                Address line 1 is required
              </p>
            </div>

            <!-- Address Line 2 -->
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                formControlName="addressLine2"
                placeholder="Apartment, suite, etc"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- City -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                City <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="city"
                placeholder="City"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p
                *ngIf="city.invalid && city.touched"
                class="text-red-500 text-xs mt-1"
              >
                City is required
              </p>
            </div>

            <!-- State -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                State/Province <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="state"
                placeholder="State"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p
                *ngIf="state.invalid && state.touched"
                class="text-red-500 text-xs mt-1"
              >
                State is required
              </p>
            </div>

            <!-- Country -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Country <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="country"
                placeholder="Country"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p
                *ngIf="country.invalid && country.touched"
                class="text-red-500 text-xs mt-1"
              >
                Country is required
              </p>
            </div>

            <!-- Postal Code -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Postal Code <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="postalCode"
                placeholder="12345"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p
                *ngIf="postalCode.invalid && postalCode.touched"
                class="text-red-500 text-xs mt-1"
              >
                Postal code is required
              </p>
            </div>
          </div>

          <!-- Google Map Link -->
          <div class="mt-6">
            <label class="block text-sm font-semibold text-slate-700 mb-2">
              Google Map Link
            </label>
            <input
              type="url"
              formControlName="googleMapLink"
              placeholder="https://maps.google.com/?q=..."
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- License & Settings Section -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-6">
            License & Settings
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- License Start Date -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                License Start Date <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                formControlName="licenseStartDate"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p
                *ngIf="licenseStartDate.invalid && licenseStartDate.touched"
                class="text-red-500 text-xs mt-1"
              >
                License start date is required
              </p>
            </div>

            <!-- License End Date -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                License End Date <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                formControlName="licenseEndDate"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p
                *ngIf="licenseEndDate.invalid && licenseEndDate.touched"
                class="text-red-500 text-xs mt-1"
              >
                License end date is required
              </p>
            </div>

            <!-- Timezone -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Timezone <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="timezone"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select timezone</option>
                <option value="UTC">UTC</option>
                <option value="Asia/Muscat">Asia/Muscat</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="Asia/Riyadh">Asia/Riyadh</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
              <p
                *ngIf="timezone.invalid && timezone.touched"
                class="text-red-500 text-xs mt-1"
              >
                Timezone is required
              </p>
            </div>

            <!-- Currency Code -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Currency Code <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="currencyCode"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select currency</option>
                <option [value]="1">USD</option>
                <option [value]="2">OMR</option>
                <option [value]="3">AED</option>
                <option [value]="4">SAR</option>
                <option [value]="5">EUR</option>
              </select>
              <p
                *ngIf="currencyCode.invalid && currencyCode.touched"
                class="text-red-500 text-xs mt-1"
              >
                Currency code is required
              </p>
            </div>

            <!-- Default Language -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Default Language <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="defaultLanguage"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select language</option>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
              <p
                *ngIf="defaultLanguage.invalid && defaultLanguage.touched"
                class="text-red-500 text-xs mt-1"
              >
                Default language is required
              </p>
            </div>

            <!-- Logo URL -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                formControlName="logoUrl"
                placeholder="https://cdn.example.com/logos/..."
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Checkboxes -->
          <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="allowMultiBranch"
                formControlName="allowMultiBranch"
                class="w-4 h-4 rounded border border-slate-300"
              />
              <label
                for="allowMultiBranch"
                class="text-sm text-slate-700 cursor-pointer"
              >
                Allow Multiple Branches
              </label>
            </div>

            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="allowMultiUser"
                formControlName="allowMultiUser"
                class="w-4 h-4 rounded border border-slate-300"
              />
              <label
                for="allowMultiUser"
                class="text-sm text-slate-700 cursor-pointer"
              >
                Allow Multiple Users
              </label>
            </div>

            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="isTrial"
                formControlName="isTrial"
                class="w-4 h-4 rounded border border-slate-300"
              />
              <label
                for="isTrial"
                class="text-sm text-slate-700 cursor-pointer"
              >
                Trial Account
              </label>
            </div>
          </div>

          <!-- Active Status -->
          <div class="mt-6 flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              formControlName="isActive"
              class="w-4 h-4 rounded border border-slate-300"
            />
            <label
              for="isActive"
              class="text-sm font-semibold text-slate-700 cursor-pointer"
            >
              Active
            </label>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-4 justify-end">
          <button
            type="button"
            routerLink="/admin/organizations"
            class="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="organizationForm.invalid || isSubmitting"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold transition"
          >
            {{
              isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update Organization"
                  : "Create Organization"
            }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class OrganizationFormComponent implements OnInit {
  organizationForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  isLoadingDropdowns = false;
  private organizationId?: string;

  businessTypes: BusinessType[] = [];
  currencies: Currency[] = [];
  nationalities: Nationality[] = [];

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private masterDataService: MasterDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.organizationForm = this.fb.group({
      name: ["", [Validators.required]],
      businessType: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      whatsApp: [""],
      website: [""],
      description: [""],
      ownerName: ["", [Validators.required]],
      ownerEmail: ["", [Validators.required, Validators.email]],
      ownerPhone: ["", [Validators.required]],
      addressLine1: ["", [Validators.required]],
      addressLine2: [""],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      country: ["", [Validators.required]],
      postalCode: ["", [Validators.required]],
      googleMapLink: [""],
      licenseStartDate: ["", [Validators.required]],
      licenseEndDate: ["", [Validators.required]],
      timezone: ["", [Validators.required]],
      currencyCode: ["", [Validators.required]],
      defaultLanguage: ["", [Validators.required]],
      logoUrl: [""],
      allowMultiBranch: [true],
      allowMultiUser: [true],
      isTrial: [false],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadMasterData();

    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.organizationId = params["id"];
        this.loadOrganization();
      }
    });
  }

  private loadMasterData(): void {
    this.isLoadingDropdowns = true;
    this.masterDataService.getAllMasterData().subscribe({
      next: (data) => {
        this.businessTypes = data.businessTypes;
        this.currencies = data.currencies;
        this.nationalities = data.nationalities;
        this.isLoadingDropdowns = false;
      },
      error: (error) => {
        console.error("Error loading master data:", error);
        this.isLoadingDropdowns = false;
      },
    });
  }

  private loadOrganization(): void {
    if (!this.organizationId) return;

    this.organizationService.getOrganization(this.organizationId).subscribe({
      next: (org) => {
        this.organizationForm.patchValue(org);
      },
      error: (error) => {
        console.error("Error loading organization:", error);
      },
    });
  }

  onSubmit(): void {
    if (this.organizationForm.invalid) return;

    this.isSubmitting = true;
    const formData = this.organizationForm.value;

    const request = this.isEditMode
      ? this.organizationService.updateOrganization(
          this.organizationId || "",
          formData,
        )
      : this.organizationService.createOrganization(formData);

    request.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(["/admin/organizations"]);
      },
      error: (error) => {
        console.error("Error saving organization:", error);
        this.isSubmitting = false;
      },
    });
  }

  get name() {
    return this.organizationForm.get("name")!;
  }
  get businessType() {
    return this.organizationForm.get("businessType")!;
  }
  get email() {
    return this.organizationForm.get("email")!;
  }
  get phone() {
    return this.organizationForm.get("phone")!;
  }
  get ownerName() {
    return this.organizationForm.get("ownerName")!;
  }
  get ownerEmail() {
    return this.organizationForm.get("ownerEmail")!;
  }
  get ownerPhone() {
    return this.organizationForm.get("ownerPhone")!;
  }
  get addressLine1() {
    return this.organizationForm.get("addressLine1")!;
  }
  get city() {
    return this.organizationForm.get("city")!;
  }
  get state() {
    return this.organizationForm.get("state")!;
  }
  get country() {
    return this.organizationForm.get("country")!;
  }
  get postalCode() {
    return this.organizationForm.get("postalCode")!;
  }
  get licenseStartDate() {
    return this.organizationForm.get("licenseStartDate")!;
  }
  get licenseEndDate() {
    return this.organizationForm.get("licenseEndDate")!;
  }
  get timezone() {
    return this.organizationForm.get("timezone")!;
  }
  get currencyCode() {
    return this.organizationForm.get("currencyCode")!;
  }
  get defaultLanguage() {
    return this.organizationForm.get("defaultLanguage")!;
  }
}
