import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field-component',
  imports: [ReactiveFormsModule],
  templateUrl: './form-field-component.html',
  styleUrls: [
    '../../app.scss',
    './form-field-component.scss'
  ],})
export class FormFieldComponent {
  @Input() form!: FormGroup
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() controlName!: string;
  @Input() required = false
}
