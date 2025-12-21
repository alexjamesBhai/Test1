import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { User } from "../../../core/models/user.model";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 shadow-sm z-50"
    >
      <div class="h-full px-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span
            class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            POSify
          </span>
          <span
            class="text-slate-400 text-sm font-medium"
            *ngIf="currentUser?.organizationId"
          >
            {{ organizationName }}
          </span>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200"
          >
            <span
              class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold"
            >
              {{ getUserInitial() }}
            </span>
            <div>
              <p class="text-sm font-semibold text-slate-900">
                {{ currentUser?.name }}
              </p>
              <p class="text-xs text-slate-500">{{ getRoleLabel() }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  @Input() currentUser: User | null = null;
  @Input() organizationName: string = "";

  getUserInitial(): string {
    return this.currentUser?.name?.charAt(0).toUpperCase() || "U";
  }

  getRoleLabel(): string {
    const roleMap: { [key: string]: string } = {
      ADMIN: "System Admin",
      OWNER: "Business Owner",
      MANAGER: "Manager",
      SALESPERSON: "Sales Person",
    };
    return roleMap[this.currentUser?.role || ""] || "User";
  }
}
