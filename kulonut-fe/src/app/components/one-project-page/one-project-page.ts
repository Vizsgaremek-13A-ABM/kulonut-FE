import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopBarComponent } from '../top-bar-component/top-bar-component';
import DataService from '../../services/data.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-one-project-page',
  imports: [TopBarComponent, ReactiveFormsModule, FormsModule],
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

  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'];
    if(this.mode != "new")
      this.projectId = Number(this.route.snapshot.paramMap.get('id')!)
    this.projectTypes = this.ds.GetProjectTypes()
    this.project_form = this.fb.group({

    })
// PROJECT POST REQUEST BODY
// {
//  
// }
  }


}
