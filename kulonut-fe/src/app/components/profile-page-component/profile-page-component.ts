import { ChangeDetectorRef, Component, ElementRef, inject, KeyValueDiffers, OnInit, ViewChild } from '@angular/core';
import { TopBarComponent } from "../top-bar-component/top-bar-component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../form-field-component/form-field-component';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/enviromnent';
import AuthService from '../../services/auth.service';
import User from '../../interfaces/user.interface';
import { forkJoin, of } from 'rxjs';
import DataService from '../../services/data.service';
import Swal from 'sweetalert2';

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
  private authService = inject(AuthService)
  private ds = inject(DataService)
  private cdr = inject(ChangeDetectorRef)
  protected user!: User
  private formdata!:FormData

  @ViewChild('oldpassword') oldPasswordBox!: ElementRef;
  @ViewChild('newpassword') newPasswordBox!: ElementRef;
  @ViewChild('confpassword') confPasswordBox!: ElementRef;
  @ViewChild('eye_img') eyeImage!: ElementRef;

  @ViewChild('pfpUploader') fileInput!: ElementRef<HTMLInputElement>;

  get passwordBoxes(): ElementRef[] {
    return [this.oldPasswordBox, this.newPasswordBox, this.confPasswordBox];
  }
  private passwordsVisible = false

  ngOnInit(): void {
    this.user = this.authService.GetUser()!
    this.user_data_form = this.fb.group({
      name: [this.user.name, Validators.required],
      display_name: [this.user.display_name],
      email: [this.user.email, [Validators.required, Validators.email]],
    })
    this.password_form = this.fb.group({
      current_password: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
    })
  }
  sendPasswordUpdateData() {
    const passwordData = this.password_form.value
    const passwordRegex = this.authService.PASSWORD_REGEX
    if (!passwordData.password.match(passwordRegex)){
      Swal.fire({
        title: "Az új jelszó túl gyenge",
        text: "Legalább egy kis- és nagybetűt, egy számot és egy speciális karaktert kell tartalmaznia, valamint minimum 8 karakter hosszú kell legyen.",
        theme: 'material-ui-dark',
        icon: "error"
      })
      return
    }
    else if (passwordData.password != passwordData.password_confirmation){
      Swal.fire({
        title: "Az új jelszavak nem egyeznek!",
        theme: 'material-ui-dark',
        icon: "error"
      })
      return
    }
    this.ds.UpdatePassword(passwordData).subscribe({
      next: async () => {
        await Swal.fire({
          title: "Sikeres jelszó módosítás, kérem jelentkezzen be újra!",
          icon: "success",
          theme: "material-ui"
        })
        this.authService.Logout()
        location.reload()
      },
      error: (response) => {
        const backendErrors = response?.error?.errors
        
        if (backendErrors.password){
          Swal.fire({
            title: "Az új jelszó nem lehet a régi jelszó",
            theme: 'material-ui-dark',
            icon: "error"
          })
        }
        else if(backendErrors.current_password){
          Swal.fire({
            title: "Helytelen jelszó",
            theme: 'material-ui-dark',
            icon: "error"
          })
        }
      }
    })
  }

  sendUserUpdateData() {
    const userData = this.user_data_form.value
    const emailRegex = this.authService.EMAIL_REGEX
    if (!userData.email.match(emailRegex)){
      Swal.fire({
        title: "Hibás e-mail cím formátum!",
        theme: 'material-ui-dark',
        icon: "error"
      })
      return
    }
    forkJoin({
      newUserData: this.ds.UpdateUserPersonal(this.user.id, userData),
      profileIcon: this.ds.UpdateUserProfilePicture(this.user.id, this.formdata) ?? of(null)
    }).subscribe({
      next: ({newUserData, profileIcon}) => {
        this.user = newUserData.data
        if (profileIcon && profileIcon.data)
          this.user.avatar = profileIcon.data.avatar;
        this.authService.SetUser(this.user)
        location.reload()
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
      }
    })
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

  UploadPfpCommand(){    
    this.fileInput.nativeElement.click()
  }

  onFileSelected(e:any){
    const fileInp = this.fileInput.nativeElement
    if (fileInp.files && fileInp.files[0]){
      const file = fileInp.files[0]
      this.formdata = new FormData()
      this.formdata.append('profile_icon', file)

      const reader = new FileReader();
      reader.onload = () => {
        (document.querySelector("#profile-picture") as HTMLImageElement).src = reader.result as string;
        this.cdr.detectChanges()
      };
      reader.readAsDataURL(file);
    }
  }

  ImageError(e: any){
    e.target.src = "/assets/default_avatar.png"
  }
}
