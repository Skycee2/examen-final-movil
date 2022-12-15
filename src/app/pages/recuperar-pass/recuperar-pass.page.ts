import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-recuperar-pass',
  templateUrl: './recuperar-pass.page.html',
  styleUrls: ['./recuperar-pass.page.scss'],
})
export class RecuperarPassPage implements OnInit {

  //Variables para trabajar los datos
  usuarios: any[] = [];
  correo: string;

  //Variables para trabajar el storage
  /* KEY_USUARIOS = 'usuarios'; */

  constructor(private toastController: ToastController, private router:Router,/* private usuarioService: UsuarioService */) { }

   ngOnInit() {
    /* this.usuarios = await this.usuarioService.getUsuarios(this.KEY_USUARIOS); */
  }

/* async recuperarContra(){
  var validarCorreo = await this.usuarioService.validarCorreorpw(this.correo)
    if (validarCorreo != undefined) {
      if (validarCorreo.correo == this.correo) {
        alert('Se envió un correo electrónico de recuperación');
      }
    }else{
      this.tstError();
    }
}

  async tstError() {
    const toast = await this.toastController.create({
      message: 'Correo no registrado',
      duration: 3000
    });
    toast.present();
  } */
}
