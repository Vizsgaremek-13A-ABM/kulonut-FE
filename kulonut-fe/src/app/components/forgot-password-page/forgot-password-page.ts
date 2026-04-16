import { Component, inject } from '@angular/core';
import { FormFieldComponent } from '../form-field-component/form-field-component';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password-page',
  imports: [FormFieldComponent, MatButtonModule],
  templateUrl: './forgot-password-page.html',
  styleUrls: [
    '../../app.scss',
    './forgot-password-page.scss'
  ],
})
export class ForgotPasswordPage {
  private fb = inject(FormBuilder)
  protected form!: FormGroup
  ngOnInit(){
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }
  send(){
    
  }
}
