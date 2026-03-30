import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import DataService from '../../services/data.service';
import { Subject } from 'rxjs';
import Polygon from '../../interfaces/polygon.interface';
import DisplayShape from '../../interfaces/displayshape.interface';
import * as L from 'leaflet';
import 'leaflet-draw';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import 'leaflet-control-geocoder';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss'
import 'sweetalert2/themes/material-ui.css'

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
  @Input() projectId!: number
  @Output() saved = new EventEmitter()

  private polygonsLoaded$ = new Subject<Polygon[]>
  protected shapes:DisplayShape[] = [];  
  protected leafletMap!:L.Map

  ngOnInit(): void {
    this.ds
      .GetPolygons()
      .subscribe((polygons) => {
        this.polygonsLoaded$.next(polygons);
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
      
      let i = 0;
      layer.eachLayer((l) => {        
        (l as any).setStyle({
          color: 'rgb(230, 123, 17)',
        });
        this.shapes[i].leaflet_id = (l as any)._leaflet_id
        drawnItems.addLayer(l);
        i++;
        //mivan ha mar a projekt resze?
        
        if (!this.readonly){
          l.on('click', (e)=>{
            const shape = this.shapes.find(x=>x.leaflet_id == e.sourceTarget._leaflet_id)!
            if (!shape.isConnectedToNewProject){
              (l as any).setStyle({
                color: 'rgb(109, 165, 242)',
              })
              shape.isConnectedToNewProject = true
              this.saved.emit(this.shapes.filter(x=>this.isWorthyToEmit(x)))
              L.popup()
                .setLatLng(e.latlng)
                .setContent(`${shape.polygon_name} sikeresen hozzárendelve a projekthez`)
                .openOn(this.leafletMap);
            }
            else{
              (l as any).setStyle({
                color: 'rgb(230, 123, 17)',
              })
              shape.isConnectedToNewProject = false
              this.saved.emit(this.shapes.filter(x=>this.isWorthyToEmit(x)))
              L.popup()
                .setLatLng(e.latlng)
                .setContent(`${shape.polygon_name} sikeresen eltávolítva a projektből`)
                .openOn(this.leafletMap);
            }
          })
        }
        else{
          l.on('mouseover', (e)=>{          
            const shape = this.shapes.find(x=>x.leaflet_id == e.sourceTarget._leaflet_id)!
            L.popup()
              .setLatLng(e.latlng)
              .setContent(shape.polygon_name)
              .openOn(this.leafletMap);
          });
          l.on('click', (e)=>{
            console.log(e)
          })
        }
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

        this.leafletMap.on('draw:created', (event: L.LeafletEvent) => {          
          const layer = event.layer;
          layer.setStyle({
            color: 'rgb(109, 165, 242)',
          });
          drawnItems.addLayer(layer);
          Swal.fire({
            title: "Adjon nevet az alakzatnak:",
            input: "text",
            confirmButtonText: 'OK',
            theme: "material-ui-dark",
            inputValidator: (value) => {
              if (!value || value.trim() === '') {
                return 'Kérem adjon meg egy nem üres nevet';
              }
              return null;
            }
          }).then((result) => {
            if (result.isConfirmed) {
              let dsh = 
                {leaflet_id: (layer as any)._leaflet_id, shape: layer.toGeoJSON(), polygon_name: result.value, isNew: true, isModified: false, isDeleted: false, isConnectedToNewProject: true} as DisplayShape
              this.shapes.push(dsh)
              this.saved.emit(this.shapes.filter(x=>this.isWorthyToEmit(x)))
            }
          });
        });

        this.leafletMap.on('draw:edited', (event: any) => {
          event.layers.eachLayer((l: any)=>{
            let shape = this.shapes.find(x=>x.leaflet_id == l._leaflet_id)!
            shape.shape = l.toGeoJSON()
            shape.isModified = true
          })
          this.saved.emit(this.shapes.filter(x=>this.isWorthyToEmit(x)))
        });

         this.leafletMap.on('draw:deleted', (event: any) => {
          event.layers.eachLayer((l: any)=>{
            let shape = this.shapes.find(x=>x.leaflet_id == l._leaflet_id)!
            if(shape.isNew){
              this.shapes = this.shapes.filter(x=>x.leaflet_id != l._leaflet_id)!
            }
            else{
              shape.isDeleted = true
            }
          })
          this.saved.emit(this.shapes.filter(x=>x.isNew || x.isModified || x.isDeleted))
        });
      }
    })
  }
  isWorthyToEmit(x: DisplayShape){
    return x.isNew || x.isModified || x.isDeleted || x.isConnectedToNewProject
  }
}
