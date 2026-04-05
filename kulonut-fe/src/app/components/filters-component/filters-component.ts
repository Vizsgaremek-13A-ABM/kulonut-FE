import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgSelectComponent } from '@ng-select/ng-select';
import DataService from '../../services/data.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Project } from '../../interfaces/project.interface';

@Component({
  selector: 'app-filters-component',
  imports: [NgSelectComponent, MatButtonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './filters-component.html',
  styleUrls: [
    '../../app.scss',
    './filters-component.scss'
  ],
})
export class FiltersComponent implements OnInit {
  @Output() apply = new EventEmitter()
  protected projectTypes!: string[]
  private ds = inject(DataService)
  protected form!: FormGroup
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.projectTypes = this.ds.GetProjectTypes()
    this.form = this.fb.group({
      name: [""],
      startDate: ["2000-01-01"],
      endDate: [this.ds.GetToday()],
      types: [[]]
    })
  }

  public ApplyCommand(){
    const filters = this.form.value
    if (new Date(filters.startDate).getTime() > new Date(filters.endDate).getTime()){
      Swal.fire({
        title: "Kezdeti dátum nem lehet a végdátum után!",
        theme: "material-ui-dark",
        icon: "error"
      })
      return
    }
    const filterFn = (x: Project) => {
      return x.project_name.toLowerCase().includes(filters.name.toLowerCase()) &&
      new Date(x.plan_issue_date).getTime() >= new Date(filters.startDate).getTime() &&
      new Date(x.plan_issue_date).getTime() <= new Date(filters.endDate).getTime() &&
      (filters.types.length == 0 ? true : (filters.types as string[]).some(y => {
        switch (y){
          case "Útépítési terv":
            return x.road_construction_plan
          case "Vízhálózati terv":
            return x.water_network_plan
          case "Közvilágítási terv":
            return x.public_lighting_plan
          case "Szennyvíz csatorna terv":
            return x.sewage_plan
          case "Csapadékvíz elvezetési terv":
            return x.stormwater_drainage_plan
          default:
            return false
        }
      }));
    }
    this.apply.emit(filterFn)
  }
}
