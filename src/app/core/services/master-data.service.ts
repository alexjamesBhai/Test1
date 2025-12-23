import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin } from "rxjs";
import { environment } from "../../environments/environment";
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

  constructor(private http: HttpClient) {}

  getNationalities(): Observable<Nationality[]> {
    return this.http.get<Nationality[]>(`${this.baseUrl}/Nationalities`);
  }

  getBusinessTypes(): Observable<BusinessType[]> {
    return this.http.get<BusinessType[]>(`${this.baseUrl}/MasterCodes?type=1`);
  }

  getCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.baseUrl}/MasterCodes?type=2`);
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
