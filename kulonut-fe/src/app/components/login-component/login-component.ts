import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { FormFieldComponent } from '../form-field-component/form-field-component';
import AuthService from '../../services/auth.service';
import Swal from 'sweetalert2';
import { PasswordEyeToggleComponent } from '../password-eye-toggle-component/password-eye-toggle-component';

@Component({
  selector: 'app-login-component',
  imports: [MatButtonModule, FormsModule, RouterLink, FormFieldComponent, ReactiveFormsModule, PasswordEyeToggleComponent],
  templateUrl: './login-component.html',
  styleUrls: [
    '../../app.scss',
    './login-component.scss'
  ],
})
export class LoginComponent implements OnInit {
  private router = inject(Router)
  private authService = inject(AuthService)
  private fb = inject(FormBuilder)
  protected form!: FormGroup
  protected passwordFieldType = 'password'

  ngOnInit(){
    if (this.authService.GetUser()){
      this.router.navigate(['/main'])
    }
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    })
  }
  sendLoginData(){
    const loginData = this.form.value
    this.authService.Login(loginData).subscribe({
      next: (response) => {        
        this.authService.SetToken(response.token, loginData.rememberMe)
        this.authService.SetUser(response.user, loginData.rememberMe)
        this.router.navigate(['/main'])
      },
      error: () => {
        Swal.fire({
          title: "Hibás e-mail cím vagy jelszó!",
          theme: "material-ui-dark",
          icon: "error"
        })
      }
    })
  }

  onPasswordVisibilityToggled(visible: boolean){
    this.passwordFieldType = visible ? 'text' : 'password'
  }
}
