import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import User from "../interfaces/user.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";

interface RegisterResponse {
  message: string;
  errors: any;
  user: User;
}

interface LoginResponse {
  message: string;
  errors: any;
  token: string;
  token_type: string;
  user: User;
}

@Injectable({
  providedIn: "root",
})
export default class AuthService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private readonly API_URL = environment.apiUrl;
  private router = inject(Router)

  private user: User | undefined;

  private readonly TOKEN_KEY = "kulonut:auth_token";
  private readonly USER_KEY = "kulonut:user";

  public readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\.]).{8,}$/
  public readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  constructor() {
    this.LoadFromStorage();
  }

  public RegisterAccount(registerData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return this.http
      .post<RegisterResponse>(`${this.API_URL}/auth/register`, registerData)
      .pipe(takeUntilDestroyed(this.destroyRef));
  }

  public Login(loginData: { email: string; password: string }) {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/auth/login`, loginData)
      .pipe(takeUntilDestroyed(this.destroyRef));
  }

  public Logout() {
    this.http
      .post<any>(`${this.API_URL}/auth/logout`, {})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.ClearAuthState();
          this.router.navigate(['/'])
        },
        error: (e) => console.log(e),
      });
  }

  public SetToken(token: string, remember?: boolean) {
    const shouldRemember = this.ResolveRememberPreference(remember);
    this.ClearStoredToken();
    this.SelectStorage(shouldRemember).setItem(this.TOKEN_KEY, token);
  }

  public GetUser() {
    return this.user;
  }

  public SetUser(user: User, remember?: boolean) {
    this.user = user;
    const shouldRemember = this.ResolveRememberPreference(remember);
    this.ClearStoredUser();
    this.SelectStorage(shouldRemember).setItem(this.USER_KEY, JSON.stringify(user));
  }

  private ResolveRememberPreference(remember?: boolean) {
    if (remember !== undefined) {
      return remember;
    }

    return (
      localStorage.getItem(this.TOKEN_KEY) !== null ||
      localStorage.getItem(this.USER_KEY) !== null
    );
  }

  private SelectStorage(remember: boolean) {
    return remember ? localStorage : sessionStorage;
  }

  private ClearStoredToken() {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  private ClearStoredUser() {
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  private ClearAuthState() {
    this.user = undefined;
    this.ClearStoredToken();
    this.ClearStoredUser();
  }

  private LoadFromStorage() {
    const userJson =
      localStorage.getItem(this.USER_KEY) ??
      sessionStorage.getItem(this.USER_KEY);

    if (userJson) {
      try {
        this.user = JSON.parse(userJson) as User;
      } catch {
        this.user = undefined;
      }
    }
  }

  public ForgotPassword(email: string){
    return this.http.post<any>(`${this.API_URL}/auth/forgot-password`, {email: email})
      .pipe(takeUntilDestroyed(this.destroyRef));
  }

  public ResetPassword(passwordData: Object){
    return this.http.post<any>(`${this.API_URL}/auth/reset-password`, passwordData)
      .pipe(takeUntilDestroyed(this.destroyRef));
  }
}