import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { environment } from "../../environments/enviromnent";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Designer from "../interfaces/designer.interface";
import { firstValueFrom, take } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export default class DataService {
    private readonly http = inject(HttpClient);
    private destroyRef = inject(DestroyRef)
    public readonly API_URL = environment.apiUrl;
    public readonly STORAGE_URL = environment.storageUrl;

    private projectTypes = [
        "Útépítési terv",
        "Vízhálózati terv",
        "Közvilágítási terv",
        "Szennyvíz csatorna terv",
        "Csapadékvíz elvezetési terv"
    ]

    public GetProjectTypes() {
        return this.projectTypes
    }

    public GetDesigners() {
        return this.http.get<{data: Designer[]}>(`${this.API_URL}/designers`)
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public GetGeneralDesigners() {
        return this.http.get<{data: Designer[]}>(`${this.API_URL}/general-designers`)
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public GetGeodesies() {
        return this.http.get<{data: Designer[]}>(`${this.API_URL}/geodesies`)
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public GetClients() {
        return this.http.get<{data: Designer[]}>(`${this.API_URL}/clients`)
            .pipe(takeUntilDestroyed(this.destroyRef))
    }
}