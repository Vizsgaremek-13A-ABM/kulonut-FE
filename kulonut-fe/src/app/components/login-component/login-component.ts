import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';

interface LoginModel{
  username: string
  password: string
}

@Component({
  selector: 'app-login-component',
  imports: [MatButtonModule, FormsModule, RouterLink],
  templateUrl: './login-component.html',
  styleUrls: [
    '../../app.scss',
    './login-component.scss'
  ],
})
export class LoginComponent {
  protected loginModel: LoginModel = {username: "", password: ""}
  sendLoginData(){
    console.log(this.loginModel);
  }
}
