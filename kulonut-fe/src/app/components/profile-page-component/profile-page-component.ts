import { Component, ElementRef, inject, KeyValueDiffers, OnInit, ViewChild } from '@angular/core';
import { TopBarComponent } from "../top-bar-component/top-bar-component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../form-field-component/form-field-component';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/enviromnent';

@Component({
  selector: 'app-profile-page-component',
  imports: [TopBarComponent, ReactiveFormsModule, FormFieldComponent, MatButtonModule],
  templateUrl: './profile-page-component.html',
  styleUrls: [
    '../../app.scss',
    './profile-page-component.scss'
  ],
})
export class ProfilePageComponent implements OnInit {
  protected user_data_form!: FormGroup;
  protected password_form!: FormGroup;
  private fb = inject(FormBuilder);

  @ViewChild('oldpassword') oldPasswordBox!: ElementRef;
  @ViewChild('newpassword') newPasswordBox!: ElementRef;
  @ViewChild('confpassword') confPasswordBox!: ElementRef;
  @ViewChild('eye_img') eyeImage!: ElementRef;
  get passwordBoxes(): ElementRef[] {
    return [this.oldPasswordBox, this.newPasswordBox, this.confPasswordBox];
  }
  private passwordsVisible = false

  ngOnInit(): void {
    this.user_data_form = this.fb.group({
      username: ['kiss_pista', Validators.required],
      display_name: ['Kiss Pista'],
      email: ['', [Validators.required, Validators.email]],
    })
    this.password_form = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      conf_password: ['', Validators.required]
    })
  }
  sendPasswordUpdateData() {
    console.log(this.password_form.value);
  }
  sendUserUpdateData() {
    console.log(this.user_data_form.value);
  }
  togglePasswordsVisible(){
    if(this.passwordsVisible){
      this.passwordsVisible = false
      for(let item of this.passwordBoxes){
        (item as any).type = "password"
      }
      (this.eyeImage.nativeElement as HTMLImageElement).src = `${environment.imageUrl}/assets/unseen.png`
      
    } else{
      this.passwordsVisible = true
      for(let item of this.passwordBoxes){
        (item as any).type = "text"
      }
      (this.eyeImage.nativeElement as HTMLImageElement).src = `${environment.imageUrl}/assets/seen.png`
    }
  }
}
