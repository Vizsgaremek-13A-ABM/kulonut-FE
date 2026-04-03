import { Component, inject, OnInit } from '@angular/core';
import { TopBarComponent } from '../top-bar-component/top-bar-component';
import { MatButtonModule } from '@angular/material/button';
import { FiltersComponent } from "../filters-component/filters-component";
import DataService from '../../services/data.service';
import { Project } from '../../interfaces/project.interface';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-projects-page',
  imports: [TopBarComponent, MatButtonModule, FiltersComponent, DatePipe, RouterLink],
  templateUrl: './all-projects-page.html',
  styleUrls: [
    '../../app.scss',
    './all-projects-page.scss'
  ],
})
export class AllProjectsPage implements OnInit {
  private ds = inject(DataService)
  
  protected projects!: Project[]
  protected displayProjects!: Project[]

  ngOnInit(): void {
    this.ds.GetProjects()
      .subscribe({
        next: (response)=>{
          this.projects = response
          this.displayProjects = response
        }
      })
  }

// Admin - minden joga van
// Adatfelvevo - adatot tud felvenni, lat mindent
// Es meg 3 olyan szint akik csak latnak

// Hat ezek alapjan projekt szintnek 3 kell
// egy amit mindenki lat (marmint aki be van jelentkezve), egy amihez kell legalabb 2-es jog, és egy amihez 3as jog kell
// és az admin + adatfelvevonek ez alapján nagyobb mint 3as joga van

  BackToTopCommand(){
    window.scrollTo(0,0)
  }

  DeleteProjectCommand(id: number, name: string){
    this.ds.DeleteProject(id).subscribe({
      next: async () => {
        await Swal.fire({
          title: "Sikeres törlés!",
          text: `"${name}" projekt sikeresen törölve!`,
          theme: "material-ui-dark",
          icon: "success"
        })
        location.reload()
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
    this.displayProjects = this.projects.filter(x => {
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
}
