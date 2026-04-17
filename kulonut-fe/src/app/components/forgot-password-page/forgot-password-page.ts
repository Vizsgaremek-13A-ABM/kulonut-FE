import { Component, inject } from '@angular/core';
import { FormFieldComponent } from '../form-field-component/form-field-component';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import AuthService from '../../services/auth.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  imports: [FormFieldComponent, MatButtonModule, RouterLink, ReactiveFormsModule],
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
    if (!this.form.value.email || !this.form.value.email.match(this.authService.EMAIL_REGEX)){
      Swal.fire({
        title: "Hibás e-mail cím formátum",
        theme: "material-ui-dark",
        icon: "error"
      })
      return
    }

    this.authService.ForgotPassword(this.form.value.email).subscribe({
      next: () => {
        Swal.fire({
          title: "Nézze meg az e-mailjeit!",
          theme: "material-ui-dark",
          icon: 'success'
        })
      },
      error: (e) =>{       
        // ha nincs hitelesitve az emailcim?         
        if (e.error.errors.email){
          if (e.error.errors.email[0] == "passwords.user")
            Swal.fire({
              title: "Ellenőrizze az e-mail címet",
              theme: "material-ui-dark",
              icon: 'error'
            })
          else if (e.error.errors.email[0] == "passwords.throttled"){
            Swal.fire({
              title: "Túl sok kérést küldött a közelmúltban, próbálja újra kicsit később!",
              theme: "material-ui-dark",
              icon: 'error'
            })
          }
          return
        }
        Swal.fire({
          title: "Hiba történt, próbálja újra később",
          theme: "material-ui-dark",
          icon: "error"
        })
      }
    })
  }
}
