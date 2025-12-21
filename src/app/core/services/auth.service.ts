import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { User, LoginRequest, AuthResponse } from "../models/user.model";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly TOKEN_KEY = "auth_token";
  private readonly USER_KEY = "auth_user";
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getUserFromStorage(),
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setUser(response.user);
          this.currentUserSubject.next(response.user);
        }),
        catchError((error) => {
          console.error("Login failed:", error);
          return throwError(
            () => new Error(error.error?.message || "Login failed"),
          );
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private loadUserFromStorage(): void {
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, {})
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setUser(response.user);
          this.currentUserSubject.next(response.user);
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        }),
      );
  }
}
