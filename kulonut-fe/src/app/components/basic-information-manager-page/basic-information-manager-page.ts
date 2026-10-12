import { Component, inject, OnInit } from '@angular/core';
import { TopBarComponent } from '../top-bar-component/top-bar-component';
import BasicInfoService from '../../services/basic_info.service';
import Swal from 'sweetalert2';
import Client from '../../interfaces/client.interface';
import Designer from '../../interfaces/designer.interface';
import Geodesy from '../../interfaces/geodesy.interface';
import GeneralDesigner from '../../interfaces/generaldesigner.interface';
import { MatButtonModule } from '@angular/material/button';


interface ConcatBasicInfoData{
  clients: {data: Client[]},
  designers: {data: Designer[]},
  general_designers: {data: GeneralDesigner[]},
  geodesies: {data: Geodesy[]}
};

@Component({
  selector: 'app-basic-information-manager-page',
  imports: [TopBarComponent, MatButtonModule],
  templateUrl: './basic-information-manager-page.html',
  styleUrls: [
    '../../app.scss',
    './basic-information-manager-page.scss'
  ],
})
export class BasicInformationManagerPage implements OnInit {
  protected readonly infoTypes: {[key: string]: string} = {
    "Megrendelők": "clients",
    "Tervezők": "designers",
    "Generáltervezők": "general_designers",
    "Geodéziák": "geodesies",}
  protected readonly keys = Object.keys(this.infoTypes)
  private basicInfoService = inject(BasicInfoService)
  protected infoData!: any

  ngOnInit(): void {
    this.basicInfoService.GetAllBasicInfos().subscribe({
      next: (data) => {
        this.infoData = data as ConcatBasicInfoData
      },
      error: () => {
        Swal.fire({
          title: "Hiba történt az adatok betöltése során",
          theme: "material-ui-dark",
          icon: "error"
        })
        
      }
    })
  }

  public toggleTable(e: Event, id: string) {
    const table = document.querySelector(`#table-${id}`) as HTMLDivElement
    table.classList.toggle('open');
    (e.target as HTMLButtonElement).textContent = (e.target as HTMLButtonElement).textContent == "🠹" ? "🠻" : "🠹"
  }
}
