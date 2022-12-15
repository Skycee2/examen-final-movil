import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { Clase, Usuario } from 'src/app/interfaces/models';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-clase',
  templateUrl: './clase.page.html',
  styleUrls: ['./clase.page.scss'],
})
export class ClasePage implements OnInit {
  usuario:Usuario;
  clase:Clase;
  title = 'app';
  errorCorrectionLevel =  NgxQrcodeErrorCorrectionLevels.QUARTILE;
  elementType = 'url';
  value = '';

  constructor(private database:FirebaseService, private ActRoute: ActivatedRoute) { }
  async ngOnInit() {
    this.getUsuario();
  }
  async ionViewWillEnter() {
    this.getUsuario();
  }

  async getUsuario() {
    await this.database.getAuthUser().then((res) =>
      this.database.getDocumento<Usuario>('usuarios', res.uid).subscribe((res) => {
        this.usuario = res;
        this.getClase();
      })
    );
  }

  
  getClase(){
    this.ActRoute.paramMap.subscribe((res)=>{
      this.value = res.get('id2')
      this.database.getDocumento<Clase>('clases',res.get('id2')).subscribe(
        (res)=>{
          this.clase = res;
        }
      )
    })

    
  }



}
