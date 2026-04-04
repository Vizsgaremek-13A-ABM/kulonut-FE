import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { environment } from "../../environments/enviromnent";
import User from "../interfaces/user.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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

  private auth_token: string | undefined;
  private user: User | undefined;

  private readonly TOKEN_KEY = "kulonut:auth_token";
  private readonly USER_KEY = "kulonut:user";

  constructor() {
    this.LoadFromStorage();
  }

  public get Headers() {
    if (!this.auth_token) return undefined;

    return new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.auth_token}`,
    });
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
      .post<any>(`${this.API_URL}/auth/logout`, {}, { headers: this.Headers })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (e) => console.log(e),
      });
    this.ClearAuthState();
  }

  public SetToken(token: string, remember: boolean) {
    this.auth_token = token;
    this.ClearStoredToken();
    this.SelectStorage(remember).setItem(this.TOKEN_KEY, token);
  }

  public GetUser() {
    return this.user;
  }

  public SetUser(user: User, remember: boolean) {
    this.user = user;
    this.ClearStoredUser();
    this.SelectStorage(remember).setItem(this.USER_KEY, JSON.stringify(user));
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
    this.auth_token = undefined;
    this.user = undefined;
    this.ClearStoredToken();
    this.ClearStoredUser();
  }

  private LoadFromStorage() {
    const token =
      localStorage.getItem(this.TOKEN_KEY) ??
      sessionStorage.getItem(this.TOKEN_KEY);

    const userJson =
      localStorage.getItem(this.USER_KEY) ??
      sessionStorage.getItem(this.USER_KEY);

    if (token) {
      this.auth_token = token;
    }

    if (userJson) {
      try {
        this.user = JSON.parse(userJson) as User;
      } catch {
        this.user = undefined;
      }
    }
  }
}