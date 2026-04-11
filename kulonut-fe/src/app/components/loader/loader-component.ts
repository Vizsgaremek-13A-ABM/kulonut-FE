import { Component, OnInit } from "@angular/core";
import { AsyncPipe, NgIf } from "@angular/common";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from "rxjs";
import { LoaderService } from "../../services/loading.service";

@Component({
  selector: 'app-loader-component',
  imports: [MatProgressSpinnerModule, NgIf, AsyncPipe],
  template: `
    <div *ngIf="loading$ | async" class="overlay">
        <mat-spinner></mat-spinner>
    </div>
  `,
  styles: `
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
  `,

})
export class LoaderComponent implements OnInit {
  loading$!: Observable<boolean>;
  constructor(private loaderService: LoaderService) {}
  ngOnInit(): void {
    this.loading$ = this.loaderService.loading$;
  }
}