import { Component } from '@angular/core';
import { TopBarComponent } from "../top-bar-component/top-bar-component";

@Component({
  selector: 'app-main-page-component',
  imports: [TopBarComponent],
  templateUrl: './main-page-component.html',
  styleUrls: [
    '../../app.scss',
    './main-page-component.scss'
  ],
})
export class MainPageComponent {

}
