import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import AuthService from '../../services/auth.service';
import { FormFieldComponent } from '../form-field-component/form-field-component';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password-page',
  imports: [FormFieldComponent, MatButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password-page.html',
  styleUrls: [
    '../../app.scss',
    './reset-password-page.scss'
  ]
})
export class ResetPasswordPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private fb = inject(FormBuilder)
  private router = inject(Router)

  protected email = '';
  protected token = '';
  protected form!: FormGroup
  protected ready = false;

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.ready = Boolean(this.email && this.token);

    if (!this.ready) {
      Swal.fire({
        title: 'A jelszó-visszaállító link hibás vagy lejárt.',
        theme: 'material-ui-dark',
        icon: 'error'
      });
    }

    this.form = this.fb.group({
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
    })
  }

  send(){
    if (!this.ready) return;

    const value = this.form.value
    if (!value.password || !value.password_confirmation) {
      Swal.fire({
        title: 'Töltse ki az összes mezőt',
        theme: 'material-ui-dark',
        icon: 'warning'
      });
      return;
    }
    if(!this.validatePassword(value.password)){
      Swal.fire({
        title: 'Az új jelszó túl gyenge!',
        text: "Legalább egy kis- és nagybetűt, egy számot és egy speciális karaktert kell tartalmaznia, valamint minimum 8 karakter hosszú kell legyen.",
        theme: 'material-ui-dark',
        icon: "warning"
      });
      return;
    }
    if(value.password != value.password_confirmation){
      Swal.fire({
        title: 'A jelszavak nem egyeznek!',
        theme: 'material-ui-dark',
        icon: "error"
      });
      return;
    }

    this.authService.ResetPassword({
      token: this.token,
      email: this.email,
      password: this.form.value.password,
      password_confirmation: this.form.value.password_confirmation,
    }).subscribe({
      next: async () => {
        await Swal.fire({
          title: "Sikeres jelszó visszaállítás!",
          text: "Jelentkezzen be fiókjába!",
          icon: "success",
          theme: "material-ui-dark"
        })
        this.router.navigate(['/'])
      },
      error: () => {
        Swal.fire({
          title: "Valami hiba történt.",
          icon: "error",
          theme: "material-ui-dark"
        })
      }
    })

  }
  
  private validatePassword(pwd: string){
    return pwd.match(this.authService.PASSWORD_REGEX)
  }
}
