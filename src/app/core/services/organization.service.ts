import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import {
  Organization,
  OrganizationListItem,
  PaginatedResponse,
  ApiResponse,
} from "../models/organization.model";

@Injectable({
  providedIn: "root",
})
export class OrganizationService {
  private baseUrl = `${environment.apiUrl}/Organization`;

  constructor(private http: HttpClient) {}

  getOrganizations(
    pageNumber: number = 1,
    pageSize: number = 15,
  ): Observable<PaginatedResponse<OrganizationListItem>> {
    const params = new HttpParams()
      .set("pageNumber", pageNumber.toString())
      .set("pageSize", pageSize.toString());

    return this.http
      .get<ApiResponse<PaginatedResponse<OrganizationListItem>>>(
        `${this.baseUrl}/All`,
        { params },
      )
      .pipe(map((response) => response.data));
  }

  createOrganization(data: Organization): Observable<Organization> {
    return this.http
      .post<ApiResponse<Organization>>(`${this.baseUrl}/create`, data)
      .pipe(map((response) => response.data));
  }

  getOrganization(id: string): Observable<Organization> {
    return this.http
      .get<ApiResponse<Organization>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  updateOrganization(
    id: string,
    data: Partial<Organization>,
  ): Observable<Organization> {
    return this.http
      .put<ApiResponse<Organization>>(`${this.baseUrl}/${id}`, data)
      .pipe(map((response) => response.data));
  }

  deleteOrganization(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
