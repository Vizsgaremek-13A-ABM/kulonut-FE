import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import AuthService from '../../services/auth.service';

@Component({
  selector: 'app-top-bar-component',
  imports: [RouterLink],
  templateUrl: './top-bar-component.html',
  styleUrls: [
    '../../app.scss',
    './top-bar-component.scss'
  ],
})
export class TopBarComponent {
  private authService = inject(AuthService)
  private router = inject(Router)
  Logout(){
    this.authService.Logout()
    this.router.navigate(['/'])
  }
}
