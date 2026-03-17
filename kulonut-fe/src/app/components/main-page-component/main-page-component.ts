import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TopBarComponent } from "../top-bar-component/top-bar-component";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';
import {MatButtonModule} from '@angular/material/button';
import { tileLayer, latLng, marker } from 'leaflet';

@Component({
  selector: 'app-main-page-component',
  imports: [TopBarComponent, NgSelectModule, FormsModule, LeafletModule, MatButtonModule],
  templateUrl: './main-page-component.html',
  styleUrls: [
    '../../app.scss',
    './main-page-component.scss'
  ],
})
export class MainPageComponent implements AfterViewInit {
  @ViewChild("map") map!:ElementRef

  ngAfterViewInit(): void {
    const map = L.map(this.map.nativeElement, {
      maxZoom: 18,
      minZoom: 15,
      center: [47.68, 17.63],
      zoom: 15
    });
    const streetLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    })
    const satelliteLayer = tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, USDA, USGS, and the GIS User Community'
    })
    streetLayer.addTo(map);

    const baseMaps = {
      "Street": streetLayer,
      "Satellite": satelliteLayer,
    };
    L.control.layers(baseMaps,).addTo(map);
  }
}
