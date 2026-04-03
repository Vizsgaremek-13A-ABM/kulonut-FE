import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgSelectComponent } from '@ng-select/ng-select';
import DataService from '../../services/data.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
      startDate: [this.ds.GetToday()],
      endDate: [this.ds.GetToday()],
      types: [[]]
    })
  }

  public ApplyCommand(){
    this.apply.emit(this.form.value)
  }
}
