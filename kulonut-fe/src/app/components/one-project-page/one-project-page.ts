import { Component, ElementRef, inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopBarComponent } from '../top-bar-component/top-bar-component';
import DataService from '../../services/data.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AsyncPipe } from '@angular/common';
import { Observable, Subject, map } from 'rxjs';
import Designer from '../../interfaces/designer.interface';
import Geodesy from '../../interfaces/geodesy.interface';
import Client from '../../interfaces/client.interface';
import { MatButtonModule } from '@angular/material/button';
import { MapComponent } from '../map-component/map-component';
import DisplayShape from '../../interfaces/displayshape.interface';
import { Project } from '../../interfaces/project.interface';

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
  private cdr = inject(ChangeDetectorRef)
  @ViewChild("TXTUploader") txtUploader!: ElementRef<HTMLInputElement>
  protected uploadedFile!: string[]

  protected projectTypes!: string[]
  protected project_form!: FormGroup;
  private projectLoaded$ = new Subject<Project>

  protected designers!: Observable<Designer[]>
  protected generalDesigners!: Observable<Designer[]>
  protected geodesies!: Observable<Geodesy[]>
  protected clients!: Observable<Client[]>

  private selectedShapes!: DisplayShape[]
  protected polygonsCount = 0

  protected selectFields!:{control: string, items$: Observable<any>}[]
  protected dateFields = [
    { title: "Tervkiadás dátuma", control: "plan_issue_date", mandatory: true },
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
    const isDisabled = this.mode === "show";
    if(this.mode != "new"){
      this.projectId = Number(this.route.snapshot.paramMap.get('id')!)
      this.ds.GetProjectById(this.projectId).subscribe({
        next: (resp)=>{
          this.projectLoaded$.next(resp.data)     
        },
        error: (e)=>{
          console.log(e.message);
          //router navigate
        }
      })
    }
    this.project_form = this.fb.group({
      project_name: [{ value: "", disabled: isDisabled }, Validators.required],
      designer: [{ value: null, disabled: isDisabled }],
      generalDesigner: [{ value: null, disabled: isDisabled }, Validators.required],
      geodesy: [{ value: null, disabled: isDisabled }],
      client: [{ value: null, disabled: isDisabled }, Validators.required],
      other_work_parts: [{ value: "", disabled: isDisabled }],
      folder_number: [{ value: "", disabled: isDisabled }],
      work_number: [{ value: "", disabled: isDisabled }, Validators.required],
      plan_issue_date: [{ value: this.ds.GetToday(), disabled: isDisabled }, Validators.required],
      utility_statement_issue_date: [{ value: null, disabled: isDisabled }],
      road_construction_permit_date: [{ value: null, disabled: isDisabled }],
      water_rights_permit_date: [{ value: null, disabled: isDisabled }],
      road_construction_plan: [{ value: false, disabled: isDisabled }],
      water_network_plan: [{ value: false, disabled: isDisabled }],
      sewage_plan: [{ value: false, disabled: isDisabled }],
      stormwater_drainage_plan: [{ value: false, disabled: isDisabled }],
      public_lighting_plan: [{ value: false, disabled: isDisabled }],
      notes: [{ value: "", disabled: isDisabled }],
      min_role_level: [1]
    });
    this.projectTypes = this.ds.GetProjectTypes()
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
    this.projectLoaded$.subscribe(project=>{      
      this.project_form.patchValue({
        project_name: project.project_name,
        designer: project.designer,
        generalDesigner: project.general_designer,
        geodesy: project.geodesy,
        client: project.client,
        other_work_parts: project.other_work_parts,
        folder_number: project.folder_number,
        work_number: project.work_number,
        plan_issue_date: project.plan_issue_date,
        utility_statement_issue_date: project.utility_statement_issue_date,
        road_construction_permit_date: project.road_construction_permit_date,
        water_rights_permit_date: project.water_rights_permit_date,
        road_construction_plan: project.road_construction_plan,
        water_network_plan: project.water_network_plan,
        sewage_plan: project.sewage_plan,
        stormwater_drainage_plan: project.stormwater_drainage_plan,
        public_lighting_plan: project.public_lighting_plan,
        notes: project.notes,
        min_role_level: 1
      })
    })
  }

  trackByFn(item: any) {
		return item.id;
	}

  SubmitProjectData(){
    if(this.mode == "show") return
    if(this.mode == "edit"){

    }
    else if(this.mode == "new"){

    }
    console.log(this.project_form.value);
    console.log(this.selectedShapes);
  }

  onSaved(shapes:any){
    this.selectedShapes = shapes
    this.polygonsCount = this.selectedShapes.filter(x=>x.isConnectedToCurrentProject).length
  }

  async uploadFile(){
    const fileInput = this.txtUploader.nativeElement
    if (fileInput.files && fileInput.files[0]){
      const file = fileInput.files[0]
      const reader = new FileReader();
      reader.addEventListener("load", ()=>{
        const text = reader.result as string;
        this.uploadedFile = [...text.split(/\r?\n/)]
        this.cdr.detectChanges()
      })
      if (file) {
        reader.readAsText(file);
        fileInput.value = ''
      }
    }
  }
}
