import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { environment } from "../../environments/enviromnent";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Designer from "../interfaces/designer.interface";
import {Project} from "../interfaces/project.interface";
import Polygon from "../interfaces/polygon.interface";
import { Observable, map } from "rxjs";
import { tileLayer } from "leaflet";
import DisplayShape from "../interfaces/displayshape.interface";
import * as geojson from 'geojson';

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

    public GetProjects(): Observable<Array<Project>> {
        return this.http.get<{data: Project[];}>(`${this.API_URL}/projects`)
        .pipe(map((x) => x.data || []));
    }

    public GetPolygons(): Observable<Array<Polygon>> {
        return this.http.get<{data: Polygon[];}>(`${this.API_URL}/polygons`)
        .pipe(map((x) => x.data || []));
    }

    public GetToday(){
        return (new Date()).toISOString().split('T')[0]
    }

    public GetRandomColors(){
        return ["red", "blue", "green", 
            "crimson", "blueviolet", 
            "magenta", "orange", "gold", 
            "springgreen", "salmon", 
            "coral", "firebrick", "orchid",
            "seagreen", "indigo"]
        .map(x => {return {x, sort: Math.random()}})
        .sort((a, b) => a.sort - b.sort)
        .map(({ x }) => x)
    }

    public GetMapLayers() {
        const streetLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
        })
        const satelliteLayer = tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, USDA, USGS, and the GIS User Community'
        })
        return [streetLayer, satelliteLayer]
    }

    public ConvertPolygonToGeoJson(polygons: Polygon[]) {
        return polygons.map(x => {
            return {
                polygon_id: x.polygon_id,
                project_ids: x.projects.map(x=>x.project_id),
                shape: {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                    x.coordinates.map(x => [x.longitude, x.latitude])
                    ]
                },
                properties: {
                    name: x.name
                }
                } as geojson.GeoJsonObject
            } as DisplayShape
        })
    }
}