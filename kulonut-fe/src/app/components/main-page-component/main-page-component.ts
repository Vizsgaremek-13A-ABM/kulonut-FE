import { Component, inject, OnInit, } from '@angular/core';
import { TopBarComponent } from "../top-bar-component/top-bar-component";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import 'leaflet-control-geocoder';
import DataService from '../../services/data.service';
import { MapComponent } from '../map-component/map-component';
import { FiltersComponent } from "../filters-component/filters-component";
import { Project } from '../../interfaces/project.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main-page-component',
  imports: [TopBarComponent, NgSelectModule, FormsModule, MatButtonModule, MapComponent, FiltersComponent],
  templateUrl: './main-page-component.html',
  styleUrls: [
    '../../app.scss',
    './main-page-component.scss'
  ],
})
export class MainPageComponent implements OnInit {  
  private ds = inject(DataService)
  private projects!: Project[]
  private filteredProjects!: Project[]

  protected get FilteredProjectIds(){
    if (!this.projects) return []
    if (this.filteredProjects)
      return this.filteredProjects.map(x => x.id)
    else return this.projects.map(x => x.id)
  }

  ngOnInit(): void {
    this.ds.GetProjects().subscribe({
      next: (response) => {
        this.projects = response
        this.filteredProjects = response
      }
    })
  }

  FilterCommand(filters: any){    
    if (new Date(filters.startDate).getTime() > new Date(filters.endDate).getTime()){
      Swal.fire({
        title: "Kezdeti dátum nem lehet a végdátum után!",
        theme: "material-ui-dark",
        icon: "error"
      })
      return
    }
    this.filteredProjects = this.projects.filter(x => {
      return x.project_name.includes(filters.name) &&
      new Date(x.plan_issue_date).getTime() >= new Date(filters.startDate).getTime() &&
      new Date(x.plan_issue_date).getTime() <= new Date(filters.endDate).getTime() &&
      (filters.types.length == 0 ? true : (filters.types as string[]).some(y => {
        switch (y){
          case "Útépítési terv":
            return x.road_construction_plan
          case "Vízhálózati terv":
            return x.water_network_plan
          case "Közvilágítási terv":
            return x.public_lighting_plan
          case "Szennyvíz csatorna terv":
            return x.sewage_plan
          case "Csapadékvíz elvezetési terv":
            return x.stormwater_drainage_plan
          default:
            return false
        }
      }));
    })
  }

  polygonClicked(layer: any){
    console.log(layer);
  }
}
