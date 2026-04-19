import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  private route = inject(ActivatedRoute)
  ngOnInit(): void {
    const status = this.route.snapshot.queryParamMap.get('status') ?? '';
    if (status != 'error'){
      Swal.fire({
        title: "Sikeres e-mail hitelesítés!",
        theme: "material-ui-dark",
        icon: "success"
      })
      this.router.navigate(['/main'])
    }
    else{
      Swal.fire({
        title: "Hiba történt",
        text: "Előfordulhat, hogy az e-mail címe már hitelesítve van",
        theme: "material-ui-dark",
        icon: "info"
      })
    }
  }
}
