import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { FormFieldComponent } from '../form-field-component/form-field-component';
import Swal from 'sweetalert2';
import AuthService from '../../services/auth.service';
import { PasswordEyeToggleComponent } from '../password-eye-toggle-component/password-eye-toggle-component';

@Component({
  selector: 'app-register-component',
  imports: [MatButtonModule, FormsModule, RouterLink, FormFieldComponent, ReactiveFormsModule, PasswordEyeToggleComponent],
  templateUrl: './register-component.html',
  styleUrls: [
    '../../app.scss',
    './register-component.scss'
  ],
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)
  protected form!: FormGroup
  protected passwordFieldType = 'password'

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    })
  }
  sendRegisterData(){
    const registerData = this.form.value
    const emailRegex = this.authService.EMAIL_REGEX
    if (registerData.name.length == 0){
      Swal.fire({
        title: "Felhasználónév megadása kötelező!",
        theme: 'material-ui-dark',
        icon: "error"
      })
      return
    }
    if (!registerData.email.match(emailRegex)){
      Swal.fire({
        title: "Hibás e-mail cím formátum!",
        theme: 'material-ui-dark',
        icon: "error"
      })
      return
    }
    if (!this.validatePassword(registerData.password)){
      Swal.fire({
        title: "A jelszó túl gyenge!",
        text: "Legalább egy kis- és nagybetűt, egy számot és egy speciális karaktert kell tartalmaznia, valamint minimum 8 karakter hosszú kell legyen.",
        theme: 'material-ui-dark',
        icon: "warning"
      })
      return
    }
    if (registerData.password != registerData.password_confirmation){
      Swal.fire({
        title: "A megadott jelszavak nem egyeznek!",
        theme: 'material-ui-dark',
        icon: "error"
      })
      return
    }
    this.authService.RegisterAccount(registerData).subscribe({
      next: (resp) =>{
        this.authService.SetToken(resp.token, false)
        void this.showRegistrationSuccessDialog()
      },
      error: (response) =>{
        const backendErrors = response?.error?.errors

        if (backendErrors?.email) {
          Swal.fire({
            title: "A megadott e-mail címmel már létezik felhasználó!",
            theme: 'material-ui-dark',
            icon: "error"
          })
        }
        else if (backendErrors?.password) {
          Swal.fire({
            title: "A jelszó túl gyenge!",
            text: "Legalább egy kis- és nagybetűt, egy számot és egy speciális karaktert kell tartalmaznia, valamint minimum 8 karakter hosszú kell legyen.",
            theme: 'material-ui-dark',
            icon: "warning"
          })
        }
      }
    })
  }

  private validatePassword(pwd: string){
    return pwd.match(this.authService.PASSWORD_REGEX)
  }

  onPasswordVisibilityToggled(visible: boolean){
    this.passwordFieldType = visible ? 'text' : 'password'
  }

  async showRegistrationSuccessDialog(){
    const result = await Swal.fire({
      title: "Sikeres regisztráció!",
      text: "Ne felejtse el hitelesíteni e-mail címét, amit az arra kiküldött linkkel tehet meg, valamint vegye fel a kapcsolatot az adminisztrátorral a megfelelő rangért!",
      theme: 'material-ui-dark',
      confirmButtonText: "Újraküldés",
      showCancelButton: true,
      cancelButtonText: "OK",
      icon: "success"
    })

    if (result.isConfirmed){
      this.authService.SendVerificationEmail().subscribe({
        next: async () => {
          await Swal.fire({
            title: "Új hitelesítő e-mail elküldve!",
            text: "Ellenőrizze a postaládáját, majd használja a legfrissebb linket.",
            theme: 'material-ui-dark',
            icon: "success"
          })
          await this.showRegistrationSuccessDialog()
        },
        error: async () => {
          await Swal.fire({
            title: "Nem sikerült újraküldeni az e-mailt.",
            text: "Próbálja meg később újra, vagy jelentkezzen be, ha a fiókja már aktív.",
            theme: 'material-ui-dark',
            icon: "error"
          })
          await this.showRegistrationSuccessDialog()
        }
      })
      return
    }
    this.authService.ClearStoredToken()
    this.router.navigate(["/"])
  }
}
