import { Component, inject } from '@angular/core';
import { FormFieldComponent } from '../form-field-component/form-field-component';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import AuthService from '../../services/auth.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  imports: [FormFieldComponent, MatButtonModule, RouterLink],
  templateUrl: './forgot-password-page.html',
  styleUrls: [
    '../../app.scss',
    './forgot-password-page.scss'
  ],
})
export class ForgotPasswordPage {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  protected form!: FormGroup

  ngOnInit(){
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  send(){
    if (!this.form.value.email.match(this.authService.EMAIL_REGEX)){
      Swal.fire({
        title: "Hibás e-mail cím formátum",
        theme: "material-ui-dark",
        icon: "error"
      })
      return
    }


  }
}
