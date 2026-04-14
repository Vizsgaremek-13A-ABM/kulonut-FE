import { Component, ElementRef, inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopBarComponent } from '../top-bar-component/top-bar-component';
import DataService from '../../services/data.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AsyncPipe } from '@angular/common';
import { Observable, Subject, firstValueFrom, map } from 'rxjs';
import Designer from '../../interfaces/designer.interface';
import Geodesy from '../../interfaces/geodesy.interface';
import Client from '../../interfaces/client.interface';
import { MatButtonModule } from '@angular/material/button';
import { MapComponent } from '../map-component/map-component';
import DisplayShape from '../../interfaces/displayshape.interface';
import { Project } from '../../interfaces/project.interface';
import AuthService from '../../services/auth.service';
import User from '../../interfaces/user.interface';
import Role from '../../interfaces/role.interface';
import Swal from 'sweetalert2';

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
  private authservice = inject(AuthService)
  private router = inject(Router)
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
  protected roles!: Role[]

  private selectedShapes!: DisplayShape[]
  protected polygonsCount = 0

  protected user!: User

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
    this.user = this.authservice.GetUser()!
    this.mode = this.route.snapshot.data['mode'];
    const isDisabled = this.mode === "show";
    if(this.mode != "new"){
      this.projectId = Number(this.route.snapshot.paramMap.get('id')!)
      this.ds.GetProjectById(this.projectId).subscribe({
        next: (resp)=>{
          this.projectLoaded$.next(resp.data)     
        },
        error: ()=>{
          Swal.fire({
            title: "Hiba történt a projekt betöltése során!",
            icon: "error",
            theme: "material-ui-dark"
          })
          this.router.navigate(['/projects'])
        }
      })
    }
    this.project_form = this.fb.group({
      project_name: [{ value: "", disabled: isDisabled }, Validators.required],
      designer_id: [{ value: null, disabled: isDisabled }],
      general_designer_id: [{ value: null, disabled: isDisabled }, Validators.required],
      geodesy_id: [{ value: null, disabled: isDisabled }],
      client_id: [{ value: null, disabled: isDisabled }, Validators.required],
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
      min_role_level: [{ value: 1, disabled: isDisabled }, Validators.required]
    });
    this.projectTypes = this.ds.GetProjectTypes()
    this.designers = this.ds.GetDesigners().pipe(map(x => x.data))
    this.generalDesigners = this.ds.GetGeneralDesigners().pipe(map(x => x.data))
    this.geodesies = this.ds.GetGeodesies().pipe(map(x => x.data))
    this.clients = this.ds.GetClients().pipe(map(x => x.data))
    this.ds.GetAllRoles().pipe(map(x => x.data)).subscribe({
      next: (resp) => {
        this.roles = resp.filter(x => this.user.role.level >= x.level).sort((x, y) => y.level - x.level)
      }
    })
    this.selectFields = [
      { control: 'designer_id', items$: this.designers },
      { control: 'general_designer_id', items$: this.generalDesigners },
      { control: 'geodesy_id', items$: this.geodesies },
      { control: 'client_id', items$: this.clients },
    ];
    this.projectLoaded$.subscribe(project=>{      
      this.project_form.patchValue({
        project_name: project.project_name,
        designer_id: project.designer,
        general_designer_id: project.general_designer,
        geodesy_id: project.geodesy,
        client_id: project.client,
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
        min_role_level: project.min_role_level
      })
    })
  }

  trackByFn(item: any) {
		return item.id;
	}

  SubmitProjectData(){
    if(this.mode == "show") return
    if (this.user.role.level < 50) return
    if(this.mode == "edit"){
      this.ds.UpdateProject(this.projectId, this.project_form.value).subscribe({
        next: () => {
          this.PolygonCRUDactions()
        },
        error: () => {
          Swal.fire({
            title: "Hiba történt a projekt mentése során!",
            text: "Előfordulhat, hogy szerverhiba, vagy hiányzó adat.",
            icon: "error",
            theme: "material-ui-dark"
          })
        }
      })
    }
    else if(this.mode == "new"){
      this.ds.CreateProject(this.project_form.value).subscribe({
        next: (resp:{id:number}) => {
          this.projectId = resp.id
          this.PolygonCRUDactions()
        },
        error: () => {
          Swal.fire({
            title: "Hiba történt a projekt létrehozása során!",
            text: "Előfordulhat, hogy szerverhiba, vagy hiányzó adat.",
            icon: "error",
            theme: "material-ui-dark"
          })
        }
      })
    }
  }

  onSaved(shapes:any){
    this.selectedShapes = shapes
    const nextCount = this.selectedShapes.filter(x => x.isConnectedToCurrentProject).length
    queueMicrotask(() => {
      this.polygonsCount = nextCount
    })
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
  navigateToEdit(){
    if (this.user.role.level < 50) return
    this.router.navigate([`/project/edit/${this.projectId}`])
  }
  async PolygonCRUDactions(){
    const deletedPolygons = this.selectedShapes.filter(x => x.isDeleted)
    if(deletedPolygons.length > 0)
      await firstValueFrom(this.ds.BulkDeletePolygons(deletedPolygons));
    const rest = this.selectedShapes.filter(x => !x.isDeleted)
    const newPolygons = rest.filter(x => x.isNew)
    if(newPolygons.length > 0)
      await firstValueFrom(this.ds.BulkCreatePolygons(newPolygons, this.projectId))

    
    //put
    const modifiedPolygonds = rest.filter(x => x.isModified)
    
    //put
    const addedToThisproject = rest.filter(x => x.isConnectedToCurrentProject)
    
  }
}
// 1 projekt letrehozas - kesz
// 2 projekt szerkesztés/törlés - kesz
// 3 projekt megtekintés, ha ez projektenkent valtozo akkor annak a megadasa hogy legyen pontosan
// 4 felhasznalo rang modositas - kesz

// 1: 50
// 2: 50
// 3: sztem ugy a legegyszerubb ha van egy dropdown ahol szint szerint mondjuk novekvo sorrendbe vannak a role-ok és akkor ott meg tudod adni hogy mi legyen a minimum rang ahhoz a projekthez
// 4: 99

// 3: es akkor csak a magáénal alacsonyabbat allithat be
// valahogy figyelmeztetni hogy save-re nem nyomott még rá
//torlesnel "sikeresen hozzaadva"