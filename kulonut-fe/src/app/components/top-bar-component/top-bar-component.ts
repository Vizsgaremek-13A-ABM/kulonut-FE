import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

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

}
