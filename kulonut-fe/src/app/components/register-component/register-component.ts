import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { FormFieldComponent } from '../form-field-component/form-field-component';
import Swal from 'sweetalert2';
import AuthService from '../../services/auth.service';

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
  private authService = inject(AuthService)
  private router = inject(Router)
  protected form!: FormGroup

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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
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
        icon: "error"
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
      next: async (response) =>{
        await Swal.fire({
          title: "Sikeres regisztráció!",
          text: "Ne felejtse el hitelesíteni e-mail címét, amit az arra kiküldött linkkel tehet meg!",
          theme: 'material-ui-dark',
          icon: "success"
        })
        this.router.navigate(["/"])
        //email validate
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
            icon: "error"
          })
        }
      }
    })
  }

  private validatePassword(pwd: string){
    return pwd.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\.]).{8,}$/)
  }
}
