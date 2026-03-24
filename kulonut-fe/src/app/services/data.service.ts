import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/enviromnent";

@Injectable({
  providedIn: 'root'
})
export default class DataService {
    private readonly http = inject(HttpClient);
    public readonly API_URL = environment.apiUrl;
    public readonly STORAGE_URL = environment.storageUrl;

    private projectTypes = [
        "Útépítési terv",
        "Vízhálózati terv",
        "Közvilágítási terv",
        "Szennyvíz csatorna terv",
        "Csapadékvíz elvezetési terv"
    ]

    public GetProjectTypes(){
        return this.projectTypes
    }
}