import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-email-verified-page',
  imports: [],
  templateUrl: './email-verified-page.html',
  styleUrls: [
    '../../app.scss',
    './email-verified-page.scss'
  ],
})
export class EmailVerifiedPage implements OnInit {
  private readonly router = inject(Router)
  ngOnInit(): void {
    // Swal.fire({
    //   title: "Sikeres e-mail hitelesítés!",
    //   theme: "material-ui-dark",
    //   icon: "success"
    // })
    // this.router.navigate(['/main'])
    
  }
}
