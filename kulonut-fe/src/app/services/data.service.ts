import { HttpClient, HttpParams } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Designer from "../interfaces/designer.interface";
import {Project} from "../interfaces/project.interface";
import Polygon from "../interfaces/polygon.interface";
import { Observable, map } from "rxjs";
import { polygon, tileLayer } from "leaflet";
import DisplayShape from "../interfaces/displayshape.interface";
import * as geojson from 'geojson';
import User from "../interfaces/user.interface";
import Role from "../interfaces/role.interface";

@Injectable({
  providedIn: 'root'
})
export default class DataService {
    private readonly http = inject(HttpClient);
    private destroyRef = inject(DestroyRef)
    private readonly API_URL = environment.apiUrl;
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
                project_ids: x.projects.map(y=>y.project_id),
                polygon_name: x.polygon_name,
                isNew: false,
                isModified: false,
                isDeleted: false,
                partOfCurrentProject: false,
                partOfCurrentProjectDefault: false,
                shape: {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                    x.coordinates.map(x => [x.longitude, x.latitude])
                    ]
                },
                properties: {
                    name: x.polygon_name
                }
                } as geojson.GeoJsonObject
            } as DisplayShape
        })
    }

    private ConvertDisplayShapeToPolygon(shapes: DisplayShape[], project_id: number){         
        return shapes.map(x => {
            return {
                ...(x.polygon_id !== undefined && { polygon_id: x.polygon_id }),
                ...((project_id !== undefined && x.partOfCurrentProject != x.partOfCurrentProjectDefault) && { project_id }),
                polygon_name: x.polygon_name,
                coordinates: (x.shape as any).geometry.coordinates[0].map((y:number[]) => {
                    return {
                        latitude: y[1],
                        longitude: y[0]
                    }
                })
            } as Omit<Polygon, "polygon_id" | "projects">;
        })
    }

    public GetProjectById(id: number){
        return this.http.get<{data: Project;}>(`${this.API_URL}/projects/${id}`)
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public CreateProject(project: Project){
        return this.http.post<{id: number}>(`${this.API_URL}/projects`, project)
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public UpdateProject(id: number, project: Project){
        return this.http.put<{data: Project;}>(`${this.API_URL}/projects/${id}`, project)
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public DeleteProject(id: number){
        return this.http.delete<any>(`${this.API_URL}/projects/${id}`)
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public GetAllUsers(){
        return this.http.get<{data: User[]}>(`${this.API_URL}/users`)
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public GetAllRoles(){
        return this.http.get<{data: Role[]}>(`${this.API_URL}/roles`)
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public UpdateUserRole(userId: number, roleId: number){
        return this.http.put<any>(`${this.API_URL}/users/${userId}`, { role_id: roleId })
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public UpdateUserPersonal(userId: number, data: Object){
        return this.http.put<any>(`${this.API_URL}/users/${userId}`, data)
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public UpdateUserProfilePicture(userId: number, profile_icon: any){   
        if (!profile_icon) return
        return this.http.post<any>(`${this.API_URL}/users/${userId}/profile-icon`, profile_icon)
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public UpdatePassword(data: Object){
        return this.http.post<any>(`${this.API_URL}/auth/update-password`, data)
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public BulkCreatePolygons(displayShapes: DisplayShape[], project_id: number){        
        return this.http.post<any>(`${this.API_URL}/polygons/bulk`, 
            {polygons: this.ConvertDisplayShapeToPolygon(displayShapes, project_id)})
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public BulkUpdatePolygons(displayShapes: DisplayShape[], project_id: number){             
        return this.http.put<any>(`${this.API_URL}/polygons/bulk`, 
            {polygons: this.ConvertDisplayShapeToPolygon(displayShapes, project_id)})
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public BulkDeletePolygons(displayShapes: DisplayShape[]){
        let params = new HttpParams();
        displayShapes.forEach(x => {
            params = params.append('polygon_ids[]', x.polygon_id!);
        });
        return this.http.delete<any>(`${this.API_URL}/polygons/bulk`, {params})
            .pipe(takeUntilDestroyed(this.destroyRef))
    }

    public BulkUnlinkPolygons(displayShapes: DisplayShape[], project_id: number){
        return this.http.delete<any>(`${this.API_URL}/polygons/projects/bulk`, {body: {
            links: displayShapes.map(x =>{
                return {
                    polygon_id: x.polygon_id,
                    project_id: project_id
                }
            })
        }}).pipe(takeUntilDestroyed(this.destroyRef))
    }
}