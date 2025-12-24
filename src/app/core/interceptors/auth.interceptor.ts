import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, filter, take, switchMap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getAccessToken();

    // Only skip token for login endpoint - add token to ALL other requests
    const isLoginEndpoint = request.url.includes("/Authentication/login");

    if (!isLoginEndpoint && token) {
      request = this.addToken(request, token);
    } else if (!isLoginEndpoint && !token) {
      console.warn(
        "[Auth Interceptor] No token available for request:",
        request.url,
      );
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.error(
            "[Auth Interceptor] 401 Unauthorized for:",
            request.url,
          );
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    const bearerToken = `Bearer ${token}`;
    const modifiedRequest = request.clone({
      setHeaders: {
        Authorization: bearerToken,
      },
    });
    console.log("[Auth Interceptor] Adding Bearer token to request:", {
      url: request.url,
      tokenLength: token.length,
      bearerTokenPreview: bearerToken.substring(0, 20) + "...",
    });
    return modifiedRequest;
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshAccessToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          const newToken = response.response?.response?.accessToken?.token;
          if (newToken) {
            this.refreshTokenSubject.next(newToken);
            return next.handle(this.addToken(request, newToken));
          }
          return throwError(() => new Error("Token refresh failed"));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        }),
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(request, token!));
        }),
      );
    }
  }
}
