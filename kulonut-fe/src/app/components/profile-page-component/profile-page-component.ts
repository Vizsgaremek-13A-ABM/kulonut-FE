import { Component } from '@angular/core';
import { TopBarComponent } from "../top-bar-component/top-bar-component";

@Component({
  selector: 'app-profile-page-component',
  imports: [TopBarComponent],
  templateUrl: './profile-page-component.html',
  styleUrls: [
    '../../app.scss',
    './profile-page-component.scss'
  ],
})
export class ProfilePageComponent {

}
