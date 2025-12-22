import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { User, LoginRequest, AuthResponse } from "../models/user.model";
import { environment } from "../../environments/environment";

export interface TokenResponse {
  token: string;
  expiryTokenDate: string;
}

export interface TokensData {
  accessToken?: TokenResponse;
  refreshToken?: TokenResponse;
}

export interface LoginResponseData {
  token: null;
  isTwoFactorEnable: boolean;
  response?: TokensData;
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  response?: LoginResponseData;
  status?: number;
}

interface AuthApiResponse extends LoginResponse {}

interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: number;
  phoneNumber: string;
  roles: string[];
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = "access_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";
  private readonly USER_KEY = "auth_user";
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getUserFromStorage(),
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  signup(signupData: SignupRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/Authentication`, signupData)
      .pipe(
        catchError((error) => {
          console.error("Signup failed:", error);
          return throwError(
            () => new Error(error.error?.message || "Signup failed"),
          );
        }),
      );
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/Authentication/login`, {
        username: credentials.email,
        password: credentials.password,
      })
      .pipe(
        tap((response) => {
          if (response.isSuccess && response.response?.response?.accessToken?.token) {
            const accessToken = response.response.response.accessToken.token;
            const refreshToken = response.response.response.refreshToken?.token;

            this.setAccessToken(accessToken);
            if (refreshToken) {
              this.setRefreshToken(refreshToken);
            }

            const user = this.extractUserFromToken(accessToken);
            if (user) {
              this.setUser(user);
              this.currentUserSubject.next(user);
            }
          }
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
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
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

  refreshAccessToken(): Observable<LoginResponse> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      this.logout();
      return throwError(() => new Error("No tokens available"));
    }

    return this.http
      .post<LoginResponse>(
        `${environment.apiUrl}/Authentication/Refresh-Token`,
        {
          accessToken: { token: accessToken },
          refreshToken: { token: refreshToken },
        },
      )
      .pipe(
        tap((response) => {
          if (response.isSuccess && response.response?.response?.accessToken?.token) {
            const newAccessToken = response.response.response.accessToken.token;
            const newRefreshToken = response.response.response.refreshToken?.token;

            this.setAccessToken(newAccessToken);
            if (newRefreshToken) {
              this.setRefreshToken(newRefreshToken);
            }

            const user = this.extractUserFromToken(newAccessToken);
            if (user) {
              this.setUser(user);
              this.currentUserSubject.next(user);
            }
          }
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        }),
      );
  }

  changePassword(
    userName: string,
    newPassword: string,
  ): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${environment.apiUrl}/Authentication/ChangePassword`,
        { userName, password: newPassword },
      )
      .pipe(
        catchError((error) => {
          console.error("Change password failed:", error);
          return throwError(
            () => new Error(error.error?.message || "Change password failed"),
          );
        }),
      );
  }

  private extractUserFromToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const email =
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const userId =
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      const role =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (email && userId) {
        const user: User = {
          id: userId,
          email,
          name: email.split("@")[0],
          role: this.mapRole(role),
          isActive: true,
          createdAt: new Date(),
        };
        return user;
      }
    } catch (error) {
      console.error("Error extracting user from token:", error);
    }
    return null;
  }

  private mapRole(
    roleStr: string,
  ): "ADMIN" | "OWNER" | "MANAGER" | "SALESPERSON" {
    const roleMap: {
      [key: string]: "ADMIN" | "OWNER" | "MANAGER" | "SALESPERSON";
    } = {
      Admin: "ADMIN",
      Owner: "OWNER",
      Manager: "MANAGER",
      SalesPerson: "SALESPERSON",
    };
    return roleMap[roleStr] || "SALESPERSON";
  }
}
