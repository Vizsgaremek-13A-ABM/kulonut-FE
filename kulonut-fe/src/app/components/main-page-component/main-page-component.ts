import { Component, inject, OnInit, } from '@angular/core';
import { TopBarComponent } from "../top-bar-component/top-bar-component";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import 'leaflet-control-geocoder';
import DataService from '../../services/data.service';
import { MapComponent } from '../map-component/map-component';

@Component({
  selector: 'app-main-page-component',
  imports: [TopBarComponent, NgSelectModule, FormsModule, MatButtonModule, MapComponent],
  templateUrl: './main-page-component.html',
  styleUrls: [
    '../../app.scss',
    './main-page-component.scss'
  ],
})
export class MainPageComponent implements OnInit {  
  private ds = inject(DataService)

  protected filters = {
    name: "",
    startDate: this.ds.GetToday(),
    endDate: this.ds.GetToday(),
    types: []
  }

  ngOnInit(): void {
  }
}
