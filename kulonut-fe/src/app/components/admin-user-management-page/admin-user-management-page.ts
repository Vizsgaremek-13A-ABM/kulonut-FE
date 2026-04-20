import { Component, inject, OnInit } from '@angular/core';
import { TopBarComponent } from "../top-bar-component/top-bar-component";
import DataService from '../../services/data.service';
import User from '../../interfaces/user.interface';
import { forkJoin } from 'rxjs';
import Role from '../../interfaces/role.interface';
import { MatButtonModule } from "@angular/material/button";
import AuthService from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-user-management-page',
  imports: [TopBarComponent, MatButtonModule, FormsModule],
  templateUrl: './admin-user-management-page.html',
  styleUrls: [
    '../../app.scss',
    './admin-user-management-page.scss'
  ],
})
export class AdminUserManagementPage implements OnInit {
  private ds = inject(DataService)
  private authservice = inject(AuthService)
  protected users!:User[]
  protected displayUsers!:User[]
  protected roles!:Role[]
  protected filterValue!: string

  ngOnInit(): void {
    forkJoin({
      users: this.ds.GetAllUsers(),
      roles: this.ds.GetAllRoles()
    }).subscribe({
      next: ({users, roles}) => {
        this.users = users.data.filter(x => x.id != this.authservice.GetUser()?.id),
        this.displayUsers = this.users
        this.roles = roles.data
      }
    })
  }

  BackToTopCommand(){
    window.scrollTo(0,0)
  }

  FilterCommand(){
    this.displayUsers = this.users.filter(x => {
      return x.name.toLowerCase().includes(this.filterValue.toLowerCase())
    })
  }

  SaveRoleCommand(user: User, e:any){
    this.ds.UpdateUserRole(user.id, e?.target.value).subscribe({
      next: () => {
        Swal.fire({
          title: `${user.name} rangja sikeresen megváltoztatva!`,
          theme: "material-ui-dark",
          icon: "success"
        })
      }
    })
  }

  DeleteUserCommand(user: User){
    Swal.fire({
      title: "Biztosan törli a felhasználót?",
      text: `${user.name} nevű felhasználó véglegesen törlődni fog!`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'Igen',
      cancelButtonText: 'Nem',
      theme: 'material-ui-dark'
    }).then((result) => {
      if (!result.isConfirmed) {
        return
      }
      this.ds.DeleteUser(user.id).subscribe({
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
}
