import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopBarComponent } from '../top-bar-component/top-bar-component';
import DataService from '../../services/data.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AsyncPipe } from '@angular/common';
import { forkJoin, Subject, concat, Observable, distinctUntilChanged, tap, switchMap, catchError, of, map } from 'rxjs';
import Designer from '../../interfaces/designer.interface';
import Geodesy from '../../interfaces/geodesy.interface';
import Client from '../../interfaces/client.interface';

@Component({
  selector: 'app-one-project-page',
  imports: [TopBarComponent, ReactiveFormsModule, FormsModule, NgSelectComponent, AsyncPipe],
  templateUrl: './one-project-page.html',
  styleUrls: [
    '../../app.scss',
    './one-project-page.scss'
  ],
})
export class OneProjectPageComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private mode!:string
  private projectId!:number
  private ds = inject(DataService)
  private fb = inject(FormBuilder);

  protected projectTypes!: string[]
  protected project_form!: FormGroup;

  protected designers!: Observable<Designer[]>
  protected generalDesigners!: Observable<Designer[]>
  protected geodesies!: Observable<Geodesy[]>
  protected clients!: Observable<Client[]>

	protected inputs = {
    designer: new Subject<string>()
  };
	protected loaders = {
    designer: false
  }

  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'];
    if(this.mode != "new")
      this.projectId = Number(this.route.snapshot.paramMap.get('id')!)
    this.projectTypes = this.ds.GetProjectTypes()
    this.project_form = this.fb.group({
      selected: [""]
    })
    this.designers = this.ds.GetDesigners().pipe(map(x => x.data))

// PROJECT POST REQUEST BODY
// {
//  
// }
  }

  trackByFn(item: any) {
		return item.id;
	}
  // private loadItemSource(typehead: Subject<string>, loader: boolean, dataServiceFunction: any){
  //   return concat(
  //     of([]),
  //     typehead.pipe(
  //       distinctUntilChanged(), 
  //       tap(() => (loader = true)), // indexre figyelni
  //       switchMap(() =>
  //         this.ds.GetDesigners().pipe(
  //         map(res => res.data),
  //         catchError(() => of([])), 
  //         tap(() => (loader = false)),
  //       ))
  //     )
  //   )
  // }
}
