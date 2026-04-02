import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { environment } from "../../environments/enviromnent";
import User from "../interfaces/user.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

interface RegisterResponse{
  message: string
  errors: any
  user: User
}

@Injectable({
  providedIn: 'root'
})
export default class AuthService {
  private http = inject(HttpClient)
  private destroyRef = inject(DestroyRef)
  private readonly API_URL = environment.apiUrl;

  public RegisterAccount(registerData: {name: string, email: string, password: string, password_confirmation: string}){
    return this.http.post<RegisterResponse>(`${this.API_URL}/auth/register`, registerData)
      .pipe(takeUntilDestroyed(this.destroyRef))
  }

  public Login(){

  }

  public Logout(){

  }

  public GetToken(){

  }

  public SetToken(token: string){
    
  }

  public GetUser(){
      
  }
}