import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export default class BasicInfoService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private readonly API_URL = environment.apiUrl;

  public GetAllBasicInfos(){
    return forkJoin({
      clients: this.http.get<any>(`${this.API_URL}/clients`),
      designers: this.http.get<any>(`${this.API_URL}/designers`),
      general_designers: this.http.get<any>(`${this.API_URL}/general-designers`),
      geodesies: this.http.get<any>(`${this.API_URL}/geodesies`)
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
    );
  }

  public SaveData(type: string, id: number, data: string){
    return this.http.put<any>(`${this.API_URL}/${type}/${id}`, {name: data})
      .pipe(takeUntilDestroyed(this.destroyRef))
  }

  public DeleteData(type: string, id: number){
    return this.http.delete<any>(`${this.API_URL}/${type}/${id}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
  }
}