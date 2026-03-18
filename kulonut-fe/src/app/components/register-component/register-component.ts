import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FormFieldComponent } from '../form-field-component/form-field-component';

@Component({
  selector: 'app-register-component',
  imports: [MatButtonModule, FormsModule, RouterLink, FormFieldComponent, ReactiveFormsModule],
  templateUrl: './register-component.html',
  styleUrls: [
    '../../app.scss',
    './register-component.scss'
  ],
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder)
  protected form!: FormGroup
  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      conf_password: ['', Validators.required],
    })
  }
  sendRegisterData(){
    console.log(this.form.value);
  }
}
