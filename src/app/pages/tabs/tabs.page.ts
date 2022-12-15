import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TranslateService } from '@ngx-translate/core';

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  usuario: Usuario;
  idioma: string;
  profeTemp: Usuario;
  langs: string[] = [];

  constructor(private alertController: AlertController, private router: Router, private database: FirebaseService, private translateService: TranslateService /* private usuarioService: UsuarioService */) {
    this.langs = this.translateService.getLangs();
    this.obtenerUsuario();
  }

  ngOnInit() {
    this.obtenerUsuario();
    /*     this.usuario = this.router.getCurrentNavigation().extras.state.usuario;
        console.log(this.usuario); */
  }

  async obtenerUsuario() {
    await this.database.getAuthUser().then(
      (respuesta) => (
        this.database.getDocumento<Usuario>('usuarios', respuesta.uid).subscribe(
          (respuesta) => {
            this.usuario = respuesta
          }
        )
      )
    )
  }
//idioma
  changeLang(event) {
    this.translateService.use(event.detail.value);
  }






}
