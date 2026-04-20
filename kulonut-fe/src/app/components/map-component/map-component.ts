import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import DataService from '../../services/data.service';
import { Subject } from 'rxjs';
import Polygon from '../../interfaces/polygon.interface';
import DisplayShape from '../../interfaces/displayshape.interface';
import * as L from 'leaflet';
import 'leaflet-draw';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import 'leaflet-control-geocoder';
import Swal from 'sweetalert2';
import proj4 from 'proj4';
import { GeoJsonObject } from 'geojson';

@Component({
  selector: 'app-map-component',
  imports: [LeafletModule],
  templateUrl: './map-component.html',
  styleUrl: './map-component.scss',
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') map!:ElementRef
  private ds = inject(DataService)
  @Input() readonly = true
  @Input() projectId!: number
  @Input() readonlyProjectIds!: number[]
  @Input() file!:string[]
  @Output() polygonClicked = new EventEmitter()
  @Output() saved = new EventEmitter()

  private blue = 'rgb(109, 165, 242)'
  private orange = 'rgb(230, 123, 17)'

  private polygonsLoaded$ = new Subject<Polygon[]>
  protected shapes:DisplayShape[] = [];  
  protected leafletMap!:L.Map
  private drawnItems!: L.FeatureGroup

  private isDeleting = false

  ngOnInit(): void {
    this.ds
      .GetPolygons()
      .subscribe((polygons) => {
        this.polygonsLoaded$.next(polygons);
    });
    proj4.defs("EPSG:23700",
      "+proj=somerc +lat_0=47.14439372222222 +lon_0=19.04857177777778 " +
      "+k=0.99993 +x_0=650000 +y_0=200000 +ellps=GRS67 " +
      "+towgs84=52.17,-71.82,-14.9,0,0,0,0 +units=m +no_defs"
    );
  }
  
  ngAfterViewInit(): void {
    this.polygonsLoaded$.subscribe(polygons => {
      let centerCoords = [47.683, 17.66]
      if (this.projectId){
        let coords = polygons.find(x =>
          x.projects.some(project => project.project_id == this.projectId)
        )?.coordinates[0];
        if(coords?.latitude && coords.longitude)
          centerCoords = [coords?.latitude!, coords?.longitude!]
      }

      this.leafletMap = L.map(this.map.nativeElement, {
        maxZoom: 18,
        minZoom: 8,
        center: centerCoords as L.LatLngExpression,
        zoom: 12
      });
      const mapLayers = this.ds.GetMapLayers()
      mapLayers[0].addTo(this.leafletMap);

      const baseMaps = {
        "Street": mapLayers[0],
        "Satellite": mapLayers[1],
      };
      L.control.layers(baseMaps).addTo(this.leafletMap);
      
      this.shapes = this.ds.ConvertPolygonToGeoJson(polygons)
      
      if(this.readonly){
        this.shapes = this.shapes.filter(x => {
          return x.project_ids.some(y => this.readonlyProjectIds.includes(y))
        })
      }

      this.drawnItems = new L.FeatureGroup();
      this.leafletMap.addLayer(this.drawnItems);

      const layer = L.geoJSON(this.shapes.map(x=>x.shape))
      
      let i = 0;
      layer.eachLayer((l) => {
        (l as any).setStyle({
          color: this.orange,
        });
        this.shapes[i].leaflet_id = (l as any)._leaflet_id
        this.drawnItems.addLayer(l);
        if(this.shapes[i].project_ids.includes(this.projectId)){
          this.shapes[i].partOfCurrentProjectDefault = true;
          this.shapes[i].partOfCurrentProject = true;
          (l as any).setStyle({
            color: this.blue,
          });
        }
        i++;
        
        if (!this.readonly){
          l.on('click', (e)=>{
            if (this.isDeleting) return
            const shape = this.shapes.find(x=>x.leaflet_id == e.sourceTarget._leaflet_id)!
            
            if (!shape.partOfCurrentProject){
              (l as any).setStyle({
                color: this.blue,
              })
              shape.partOfCurrentProject = true
              if (!shape.project_ids.includes(this.projectId)){
                shape.project_ids.push(this.projectId)
              }
              this.EmitSave()
              L.popup()
                .setLatLng(e.latlng)
                .setContent(`${shape.polygon_name} sikeresen hozzárendelve a projekthez`)
                .openOn(this.leafletMap);              
            }
            else{
              (l as any).setStyle({
                color: this.orange,
              })
              shape.partOfCurrentProject = false
              shape.project_ids = shape.project_ids.filter(x => x != this.projectId)
              this.EmitSave()
              L.popup()
                .setLatLng(e.latlng)
                .setContent(`${shape.polygon_name} sikeresen eltávolítva a projektből`)
                .openOn(this.leafletMap);
            }
          })
        }
        else{
          layer.on('mouseover', (e)=>{          
            const shape = this.shapes.find(x=>x.leaflet_id == e.sourceTarget._leaflet_id)!
            L.popup()
              .setLatLng(e.latlng)
              .setContent(shape.polygon_name)
              .openOn(this.leafletMap);
          });
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
            featureGroup: this.drawnItems,
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
            color: this.blue,
            opacity: 1
          });
          this.drawnItems.addLayer(layer);
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
                {
                  leaflet_id: (layer as any)._leaflet_id, 
                  shape: layer.toGeoJSON(),
                  polygon_name: result.value, 
                  status: "new",
                  partOfCurrentProject: true, 
                  partOfCurrentProjectDefault: false, 
                  project_ids: [this.projectId]
                } as DisplayShape
              this.shapes.push(dsh)
              this.EmitSave()
            } else if (result.isDismissed) {
                this.drawnItems.removeLayer(layer);
            }
          });
        });

        this.leafletMap.on('draw:edited', (event: any) => {
          event.layers.eachLayer((l: any)=>{
            let shape = this.shapes.find(x=>x.leaflet_id == l._leaflet_id)!
            shape.shape = l.toGeoJSON()
            if (shape.status != "new")
              shape.status = "modified"
          })
          this.EmitSave()          
        });

        this.leafletMap.on('draw:deletestart', () => {
          this.isDeleting = true;
        });

        this.leafletMap.on('draw:deletestop', () => {
          this.isDeleting = false;
        });

        this.leafletMap.on('draw:deleted', (event: any) => {
          event.layers.eachLayer((l: any)=>{
            let shape = this.shapes.find(x=>x.leaflet_id == l._leaflet_id)!
            if(shape.status == "new"){
              this.shapes = this.shapes.filter(x=>x.leaflet_id != l._leaflet_id)!
            }
            else{
              shape.partOfCurrentProject = false
              shape.status = 'deleted'
            }
          })
          this.EmitSave()
        });
      }
      this.EmitSave()
    })
  }
  isWorthyToEmit(x: DisplayShape){
    return x.status != "unchanged" || (x.partOfCurrentProject != x.partOfCurrentProjectDefault)
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['file'] && changes['file'].currentValue){
      let coordPairs = []
      for (let pair of changes['file'].currentValue){
        if (pair != ""){
          const wgs84 = proj4("EPSG:23700", "WGS84", pair.split(' ').map((x:string)=>Number(x)));
          coordPairs.push(wgs84.reverse())
        }
      }      
      const layer = L.polygon(coordPairs)
      layer.setStyle({
        color: this.blue,
        opacity: 1
      });

      layer.addTo(this.drawnItems)      
      this.leafletMap.setView(coordPairs[0], 15)
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
          this.shapes.push({
            leaflet_id: (layer as any)._leaflet_id,
            shape: layer.toGeoJSON() as GeoJsonObject,
            project_ids: this.projectId ? [this.projectId] : [],
            polygon_name: result.value, 
            status: "new",
            partOfCurrentProject: true,
            partOfCurrentProjectDefault: false,
          } as DisplayShape)
        } else if (result.isDismissed) {
            this.drawnItems.removeLayer(layer);
        }
      });
      this.EmitSave()
    }
    else if (changes["readonlyProjectIds"] && !changes['readonlyProjectIds'].firstChange){
      if (this.readonly && this.drawnItems){
        this.drawnItems.clearLayers()
        this.shapes.filter(x => {
          return x.project_ids.some(y => this.readonlyProjectIds.includes(y))
        }).forEach(x => {
          let layer = L.geoJSON(x.shape)
          layer.setStyle({
            color: this.blue,
          })
          layer.on('mouseover', (e)=>{          
            L.popup()
              .setLatLng(e.latlng)
              .setContent(x.polygon_name)
              .openOn(this.leafletMap);
          });
          layer.on('click', ()=>{
            this.polygonClicked.emit(x)
          })
          this.drawnItems.addLayer(layer)
        })
        
      }
    }
  }
  private EmitSave(){
    this.saved.emit({shapes: this.shapes.filter(x=>this.isWorthyToEmit(x)), count: this.shapes.filter(x=>x.partOfCurrentProject).length})
  }
  ShowInfo(){
    Swal.fire({
      width: "700px",
      html:`
      <h3 style="color:white;">Útmutató</h3>
      <h5 style="color:white;">Új alakzat</h5>
      <p style="text-align:justify;">
        Új alakzat felvétele az ötszög gombbal lehetséges, vagy TXT fájl útján. Mindkét esetben egy felugró ablakban el kell nevezni az alakzatot.
        TXT esetén a 'Feltöltés' gomb véglegesít, az ötszög esetén az alakzat bezárása, vagy a szürke 'Finish' gomb
      </p>
      <h5 style="color:white;">Kiválasztás</h5>
      <p style="text-align:justify;">
        Alakzatra kattintva hozzáadhatjuk/elvehetjük azt az adott projektből. A kék alakzatok tartoznak az adott projekthez, a narancssárgák nem.
      </p>
      <h5 style="color:white;">Szerkesztés és törlés</h5>
      <p style="text-align:justify;">
        Szerkesztés és törlés esetén a módosítások csak a 'Save' gomb megnyomása után lépnek életbe.
        A Cancel gombbal visszavonhatja a legutóbbi módosításokat.
      </p>
      <h5 style="color:white;">Térkép</h5>
      <p style="text-align:justify;">
        A jobb felső sarokban található ikonnal válthatunk utcai és műholdas nézet között.
        A nagyítóra kattintva helynévre kereshetünk, Enter nyomása után a térkép az adott helyre ugrik
      </p>
      <h5 style="color:white;">Fontos</h5>
      <p style="text-align:justify;">
        A projekt változtatásait a kék "Rögzít", vagy "Mentés" gombbal mentheti el.
        Amennyiben egy projektnek csak a területeiben végez változtatást, azok is csak a kék "Rögzít", vagy "Mentés" gomb kattintása után kerülnek mentésre!
      </p>
      `,
      theme: 'material-ui-dark'
    })
  }
  ngOnDestroy(): void {
    if(this.leafletMap)
      this.leafletMap.remove()
  }
}
