import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import AuthService from '../../services/auth.service';
import User from '../../interfaces/user.interface';
import { environment } from '../../../environments/enviromnent';

@Component({
  selector: 'app-top-bar-component',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-bar-component.html',
  styleUrls: [
    '../../app.scss',
    './top-bar-component.scss'
  ],
})
export class TopBarComponent implements OnInit {
  private authService = inject(AuthService)
  private router = inject(Router)
  protected activeRoute!: string
  protected user!: User
  protected storageUrl = environment.storageUrl
  ngOnInit(): void {
    this.activeRoute = this.router.url
    this.user = this.authService.GetUser()!
  }

  Logout(){
    this.authService.Logout()
    this.router.navigate(['/'])
  }
}
