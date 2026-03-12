import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';

interface RegisterModel{
  username: string
  email: string
  password: string
  confirm_password: string
}

@Component({
  selector: 'app-register-component',
  imports: [MatButtonModule, FormsModule, RouterLink],
  templateUrl: './register-component.html',
  styleUrls: [
    '../../app.scss',
    './register-component.scss'
  ],
})
export class RegisterComponent {
  protected registerModel: RegisterModel = {username: "", email: "", password: "", confirm_password: ""}
  sendRegisterData(){
    
  }
}
