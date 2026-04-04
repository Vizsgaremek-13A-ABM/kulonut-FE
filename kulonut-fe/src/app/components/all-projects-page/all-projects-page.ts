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

  FilterCommand(filterFn: Function){
    this.displayProjects = this.projects.filter(x => filterFn(x))
  }
}
