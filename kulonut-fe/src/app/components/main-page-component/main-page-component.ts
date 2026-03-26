import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TopBarComponent } from "../top-bar-component/top-bar-component";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';
import {MatButtonModule} from '@angular/material/button';
import { tileLayer } from 'leaflet';
import { Store } from '@ngrx/store';
import { selectPolygons, selectProjects } from '../../ngrx/selectors';
import { PolygonActions, ProjectActions } from '../../ngrx/actions';
import DisplayShape from '../../interfaces/displayshape.interface';
import { Subject } from 'rxjs';
import Polygon from '../../interfaces/polygon.interface';
import * as geojson from 'geojson';
import 'leaflet-control-geocoder';
import DataService from '../../services/data.service';

@Component({
  selector: 'app-main-page-component',
  imports: [TopBarComponent, NgSelectModule, FormsModule, LeafletModule, MatButtonModule],
  templateUrl: './main-page-component.html',
  styleUrls: [
    '../../app.scss',
    './main-page-component.scss'
  ],
})
export class MainPageComponent implements OnInit, AfterViewInit {
  @ViewChild("map") map!:ElementRef
  protected leafletMap!:L.Map
  
  private ds = inject(DataService)
  private readonly store = inject(Store);
  protected projects = this.store.selectSignal(selectProjects);
  protected polygons = this.store.selectSignal(selectPolygons);

  protected shapes:DisplayShape[] = [];  

  private polygonsLoaded$ = new Subject<Polygon[]>

  protected filters = {
    name: "",
    startDate: this.ds.GetToday(),
    endDate: this.ds.GetToday(),
    types: []
  }

  ngOnInit(): void {
    this.ds
      .GetProjects()
      .subscribe((projects) =>
        this.store.dispatch(ProjectActions.getProjects({ projects }))
    );

    this.ds
      .GetPolygons()
      .subscribe((polygons) => {
        this.polygonsLoaded$.next(polygons);
        this.store.dispatch(PolygonActions.getPolygons({ polygons }))
    });
  }

  ngAfterViewInit(): void {
    this.polygonsLoaded$.subscribe(polygons => {
      this.leafletMap = L.map(this.map.nativeElement, {
        maxZoom: 18,
        minZoom: 13,
        center: [47.5, 19.04],
        zoom: 14
      });
      const streetLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      })
      const satelliteLayer = tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, USDA, USGS, and the GIS User Community'
      })
      streetLayer.addTo(this.leafletMap);

      const baseMaps = {
        "Street": streetLayer,
        "Satellite": satelliteLayer,
      };
      L.control.layers(baseMaps).addTo(this.leafletMap);

      this.shapes = polygons.map(x => {
        return {
          polygon_id: x.polygon_id,
          // project_id: 
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
      
      const drawnItems = new L.FeatureGroup();
      this.leafletMap.addLayer(drawnItems);

      const layer = L.geoJSON(this.shapes.map(x=>x.shape))
      
      const colors = this.ds.GetRandomColors()
      let i = 0;
      layer.eachLayer(function(l){        
        (l as any).setStyle({
          color: colors[i % colors.length],
        });        
        drawnItems.addLayer(l);
        i++;
      });

      const geocoder = (L.Control as any).Geocoder.nominatim({
        geocodingQueryParams: {
          countrycodes: 'hu',
          limit: 10
      }});

      const control = (L.Control as any).geocoder({
        defaultMarkGeocode: false,
        geocoder: geocoder
      }).on('markgeocode', (e: any) => {
        const center = e.geocode.center; 
        this.leafletMap.setView([center.lat, center.lng], 12);
      }).addTo(this.leafletMap);
    });
  }
}
