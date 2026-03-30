import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopBarComponent } from '../top-bar-component/top-bar-component';
import DataService from '../../services/data.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AsyncPipe } from '@angular/common';
import { Observable, map } from 'rxjs';
import Designer from '../../interfaces/designer.interface';
import Geodesy from '../../interfaces/geodesy.interface';
import Client from '../../interfaces/client.interface';
import { MatButtonModule } from '@angular/material/button';
import { MapComponent } from '../map-component/map-component';
import DisplayShape from '../../interfaces/displayshape.interface';

@Component({
  selector: 'app-one-project-page',
  imports: [TopBarComponent, ReactiveFormsModule, FormsModule, NgSelectComponent, AsyncPipe, MatButtonModule, MapComponent],
  templateUrl: './one-project-page.html',
  styleUrls: [
    '../../app.scss',
    './one-project-page.scss'
  ],
})
export class OneProjectPageComponent implements OnInit {
  private route = inject(ActivatedRoute)
  protected mode!:string
  protected projectId!:number
  private ds = inject(DataService)
  private fb = inject(FormBuilder);

  protected projectTypes!: string[]
  protected project_form!: FormGroup;

  protected designers!: Observable<Designer[]>
  protected generalDesigners!: Observable<Designer[]>
  protected geodesies!: Observable<Geodesy[]>
  protected clients!: Observable<Client[]>

  private selectedShapes!: DisplayShape[]

  protected selectFields!:{control: string, items$: Observable<any>}[]
  protected dateFields = [
    { title: "Tervkiadás dátuma", control: "plan_issue_date" },
    { title: "Közmű nyilatkozat kiadás dátuma", control: "utility_statement_issue_date" },
    { title: "Útépítési engedély kiadás dátuma", control: "road_construction_permit_date" },
    { title: "Vízjogi engedély kiadás dátuma", control: "water_rights_permit_date" }
  ];

  protected checkFields = [
    { title: "Útépítési terv", control: "road_construction_plan" },
    { title: "Vízhálózati terv", control: "water_network_plan" },
    { title: "Szennyvíz csatorna terv", control: "sewage_plan"  },
    { title: "Csapadékvíz elvezetési terv", control: "stormwater_drainage_plan"  },
    { title: "Közvilágítási terv", control: "public_lighting_plan"  }
  ]

  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'];
    if(this.mode != "new")
      this.projectId = Number(this.route.snapshot.paramMap.get('id')!)
    this.projectTypes = this.ds.GetProjectTypes()
    const isDisabled = this.mode === "show";
    this.project_form = this.fb.group({
      project_name: [{ value: "", disabled: isDisabled }, Validators.required],
      designer: [{ value: null, disabled: isDisabled }, Validators.required],
      generalDesigner: [{ value: null, disabled: isDisabled }, Validators.required],
      geodesy: [{ value: null, disabled: isDisabled }, Validators.required],
      client: [{ value: null, disabled: isDisabled }, Validators.required],
      other_work_parts: [{ value: "", disabled: isDisabled }, Validators.required],
      folder_number: [{ value: "", disabled: isDisabled }, Validators.required],
      work_number: [{ value: "", disabled: isDisabled }, Validators.required],
      plan_issue_date: [{ value: this.ds.GetToday(), disabled: isDisabled }, Validators.required],
      utility_statement_issue_date: [{ value: this.ds.GetToday(), disabled: isDisabled }, Validators.required],
      road_construction_permit_date: [{ value: this.ds.GetToday(), disabled: isDisabled }, Validators.required],
      water_rights_permit_date: [{ value: this.ds.GetToday(), disabled: isDisabled }, Validators.required],
      road_construction_plan: [{ value: false, disabled: isDisabled }],
      water_network_plan: [{ value: false, disabled: isDisabled }],
      sewage_plan: [{ value: false, disabled: isDisabled }],
      stormwater_drainage_plan: [{ value: false, disabled: isDisabled }],
      public_lighting_plan: [{ value: false, disabled: isDisabled }],
      notes: [{ value: "", disabled: isDisabled }]
    });
    this.designers = this.ds.GetDesigners().pipe(map(x => x.data))
    this.generalDesigners = this.ds.GetGeneralDesigners().pipe(map(x => x.data))
    this.geodesies = this.ds.GetGeodesies().pipe(map(x => x.data))
    this.clients = this.ds.GetClients().pipe(map(x => x.data))
    this.selectFields = [
      { control: 'designer', items$: this.designers },
      { control: 'generalDesigner', items$: this.generalDesigners },
      { control: 'geodesy', items$: this.geodesies },
      { control: 'client', items$: this.clients },
    ];
  }

  trackByFn(item: any) {
		return item.id;
	}

  SubmitProjectData(){
    console.log(this.project_form.value);
    console.log(this.selectedShapes);
  }

  onSaved(shapes:any){
    this.selectedShapes = shapes
  }
}
