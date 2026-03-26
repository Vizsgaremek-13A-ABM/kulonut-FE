import { AfterViewInit, Component, effect, ElementRef, inject, Input, OnInit, signal, SimpleChanges, ViewChild, WritableSignal } from '@angular/core';
import DataService from '../../services/data.service';
import { Store } from '@ngrx/store';
import { selectPolygons } from '../../ngrx/selectors';
import { Subject } from 'rxjs';
import Polygon from '../../interfaces/polygon.interface';
import DisplayShape from '../../interfaces/displayshape.interface';
import { PolygonActions } from '../../ngrx/actions';
import * as L from 'leaflet';
import 'leaflet-draw';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import 'leaflet-control-geocoder';

@Component({
  selector: 'app-map-component',
  imports: [LeafletModule],
  templateUrl: './map-component.html',
  styleUrl: './map-component.scss',
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('map') map!:ElementRef
  private ds = inject(DataService)
  @Input() readonly = true

  protected unsaved = signal<boolean|null>(null)

  private readonly store = inject(Store);
  protected projects = this.store.selectSignal(selectPolygons);
  private polygonsLoaded$ = new Subject<Polygon[]>
  protected shapes:DisplayShape[] = [];  
  protected leafletMap!:L.Map

  constructor(){
    effect(() => {
      if (this.unsaved() !== null) {
        this.map.nativeElement.style.setProperty('height', '97%', 'important');
      }
    });
  }

  ngOnInit(): void {
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
        minZoom: 8,
        center: [47.12, 19.42],
        zoom: 8
      });
      const mapLayers = this.ds.GetMapLayers()
      mapLayers[0].addTo(this.leafletMap);

      const baseMaps = {
        "Street": mapLayers[0],
        "Satellite": mapLayers[1],
      };
      L.control.layers(baseMaps).addTo(this.leafletMap);
      
      this.shapes = this.ds.ConvertPolygonToGeoJson(polygons)
      const drawnItems = new L.FeatureGroup();
      this.leafletMap.addLayer(drawnItems);

      const layer = L.geoJSON(this.shapes.map(x=>x.shape))
      
      const colors = this.ds.GetRandomColors()
      let i = 0;
      layer.eachLayer((l) => {        
        (l as any).setStyle({
          color: colors[this.shapes[i].project_ids[0] % colors.length],
        });
        this.shapes[i].leaflet_id = (l as any)._leaflet_id
        drawnItems.addLayer(l);
        i++;
      });

      const geocoder = (L.Control as any).Geocoder.nominatim({
        geocodingQueryParams: {
          countrycodes: 'hu',
          limit: 10
      }});

      (L.Control as any).geocoder({
        defaultMarkGeocode: false,
        geocoder: geocoder
      }).on('markgeocode', (e: any) => {
        const center = e.geocode.center; 
        this.leafletMap.setView([center.lat, center.lng], 12);
      }).addTo(this.leafletMap);
      
      if(!this.readonly){
        const drawControl = new L.Control.Draw({
          edit: {
            featureGroup: drawnItems,
            // remove: false
          },
          draw: {
            polygon: {},
            polyline: false,
            circle: false,
            rectangle: false,
            marker: false,
            circlemarker: false
          }
        });
        this.leafletMap.addControl(drawControl);
        // CRUD OPERATIONS ON SHAPES
        this.leafletMap.on('draw:created', (event: L.LeafletEvent) => {
          console.log(event.layer);
          
          // const layer = event.layer;
          // layer.setStyle({
          //   color: 'red',
          // });
          // drawnItems.addLayer(layer);
          // this.shapes.push({id: (layer as any)._leaflet_id, shape: layer.toGeoJSON()})
          // this.unsaved = true
        });

        // this.leafletMap.on('draw:edited', (event: any) => {
        //   event.layers.eachLayer((l: any)=>{
        //     let shape = this.shapes.find(x=>x.id == l._leaflet_id)!
        //     shape.shape = l.toGeoJSON()
        //   })
        //   this.unsaved = true
        // });

        //  this.leafletMap.on('draw:deleted', (event: any) => {
        //   event.layers.eachLayer((l: any)=>{
        //     this.shapes = this.shapes.filter(x=>x.id != l._leaflet_id)!
        //   })
        //   this.unsaved = true
        // });
      }
    })
  }
}
