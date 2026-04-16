import { Component, inject, OnInit } from '@angular/core';
import { TopBarComponent } from '../top-bar-component/top-bar-component';
import { MatButtonModule } from '@angular/material/button';
import { FiltersComponent } from "../filters-component/filters-component";
import DataService from '../../services/data.service';
import { Project } from '../../interfaces/project.interface';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import User from '../../interfaces/user.interface';
import AuthService from '../../services/auth.service';

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
  private authService = inject(AuthService)
  
  protected projects!: Project[]
  protected displayProjects!: Project[]

  protected user!: User

  ngOnInit(): void {
    this.user = this.authService.GetUser()!
    this.ds.GetProjects()
      .subscribe({
        next: (response)=>{
          this.projects = response.filter(x => x.min_role_level <= this.authService.GetUser()?.role.level!)
          this.displayProjects = response.filter(x => x.min_role_level <= this.authService.GetUser()?.role.level!)
        }
      })
  }

  BackToTopCommand(){
    window.scrollTo(0,0)
  }

  DeleteProjectCommand(id: number, name: string){
    Swal.fire({
      title: "Biztosan törli a projektet?",
      text: `${name} nevű projekt véglegesen törlődni fog!`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'Igen',
      cancelButtonText: 'Nem',
      theme: 'material-ui-dark'
    }).then((result) => {
      if (!result.isConfirmed) {
        return
      }
      this.ds.DeleteProject(id).subscribe({
        next: async () => {
          await Swal.fire({
            title: "Sikeres törlés!",
            theme: "material-ui-dark",
            icon: "success"
          })
          location.reload()
        }
      })
    })
  }

  FilterCommand(filterFn: Function){
    this.displayProjects = this.projects.filter(x => filterFn(x))
  }
}
