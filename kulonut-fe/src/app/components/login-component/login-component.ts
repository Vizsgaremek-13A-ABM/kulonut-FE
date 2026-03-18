import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { FormFieldComponent } from '../form-field-component/form-field-component';

@Component({
  selector: 'app-login-component',
  imports: [MatButtonModule, FormsModule, RouterLink, FormFieldComponent, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrls: [
    '../../app.scss',
    './login-component.scss'
  ],
})
export class LoginComponent implements OnInit {
  private router = inject(Router)
  private fb = inject(FormBuilder)
  protected form!: FormGroup
  ngOnInit(){
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  sendLoginData(){
    console.log(this.form.value);
    this.router.navigate(['profile']) // ideiglenes
  }
}
