import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './components/loader/loader-component';
import AuthService from './services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private readonly authService: AuthService) {
    if (authService.GetUser()){
      this.authService.GetMe().subscribe({
        next: (response) => {
          this.authService.SetUser(response.data)
        },
        error: async (err) => {
          if (err.status === 401 || err.status === 403) {
            await Swal.fire({
              title: "Lejárt a munkamenet!",
              text: "Jelentkezzen be újra",
              icon: "warning",
              theme: "material-ui-dark"
            })
            authService.Logout()
          }
          else console.log(err)
        }
      });
    }
    
  }

}
