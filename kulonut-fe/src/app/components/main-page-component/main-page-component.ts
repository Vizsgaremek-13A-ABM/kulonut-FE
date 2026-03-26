import { Component, inject, OnInit, } from '@angular/core';
import { TopBarComponent } from "../top-bar-component/top-bar-component";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { Store } from '@ngrx/store';
import { selectProjects } from '../../ngrx/selectors';
import { ProjectActions } from '../../ngrx/actions';
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
  private readonly store = inject(Store);
  protected projects = this.store.selectSignal(selectProjects);

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
  }
}
