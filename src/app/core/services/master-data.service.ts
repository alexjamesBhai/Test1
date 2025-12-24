import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";
import {
  Nationality,
  MasterCode,
  BusinessType,
  Currency,
} from "../models/master-data.model";

@Injectable({
  providedIn: "root",
})
export class MasterDataService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getNationalities(): Observable<Nationality[]> {
    const token = this.authService.getAccessToken();
    console.log("[MasterDataService] Fetching Nationalities. Token available:", !!token);
    return this.http.get<Nationality[]>(`${this.baseUrl}/Nationalities`).pipe(
      tap(() => console.log("[MasterDataService] Nationalities fetched successfully")),
      catchError((error) => {
        console.error("[MasterDataService] Error fetching Nationalities:", error);
        return throwError(() => error);
      }),
    );
  }

  getBusinessTypes(): Observable<BusinessType[]> {
    const token = this.authService.getAccessToken();
    console.log("[MasterDataService] Fetching BusinessTypes. Token available:", !!token);
    return this.http.get<BusinessType[]>(`${this.baseUrl}/MasterCodes?type=1`).pipe(
      tap(() => console.log("[MasterDataService] BusinessTypes fetched successfully")),
      catchError((error) => {
        console.error("[MasterDataService] Error fetching BusinessTypes:", error);
        return throwError(() => error);
      }),
    );
  }

  getCurrencies(): Observable<Currency[]> {
    const token = this.authService.getAccessToken();
    console.log("[MasterDataService] Fetching Currencies. Token available:", !!token);
    return this.http.get<Currency[]>(`${this.baseUrl}/MasterCodes?type=2`).pipe(
      tap(() => console.log("[MasterDataService] Currencies fetched successfully")),
      catchError((error) => {
        console.error("[MasterDataService] Error fetching Currencies:", error);
        return throwError(() => error);
      }),
    );
  }

  getAllMasterData(): Observable<{
    nationalities: Nationality[];
    businessTypes: BusinessType[];
    currencies: Currency[];
  }> {
    return forkJoin({
      nationalities: this.getNationalities(),
      businessTypes: this.getBusinessTypes(),
      currencies: this.getCurrencies(),
    });
  }
}
