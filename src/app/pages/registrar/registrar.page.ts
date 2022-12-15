import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';

import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  //VAMOS A CREAR NUESTRO ALUMNO:
  usuario = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
    nom_completo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    correo: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]{1,4}.[A-Za-z]{1,20}@duocuc.cl|[A-Za-z]{1,4}.[A-Za-z]{1,20}@duoc.cl|[A-Za-z]{1,4}.[A-Za-z]{1,20}@profesor.duoc.cl')]),
    fecha_nac: new FormControl('', Validators.required),
    semestre: new FormControl('', [Validators.required, Validators.min(1), Validators.max(8)]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
    /* nro_cel: new FormControl('', [Validators.required, Validators.pattern('[0-9]{0,8}')]) */
  });

  //Variable para verificar pass
  verificar_password: string;

  //Variables para trabajar el storage
  /* usuarios: any[] = []; */
  /* KEY_USUARIOS = 'usuarios'; */

  constructor(private database: FirebaseService, private router: Router, private validacionesService: ValidacionesService, private alertController: AlertController) { }

  ngOnInit() {
  }

  registrar() {
    if (!this.validacionesService.validarRut(this.usuario.controls.rut.value)) {
      return this.presentAlert('Rut invalido!');
    }
    if (this.usuario.controls.contrasena.value != this.verificar_password) {

      return this.presentAlert('CONTRASEÑAS NO COINCIDEN!');
    }
    if (!this.validacionesService.calcEdadReturn(17, this.usuario.controls.fecha_nac.value)) {
      alert('Edad mínima 17 años.');
      return this.presentAlert('Debe ser mayor a 17 años!');
    }
    this.database.registrar(this.usuario.value.correo, this.usuario.value.contrasena).then(
      (res) => {
        const dominio = this.obtenerDominio(res.email);
        let setTipo = '';
        if (dominio === 'profesor.duoc.cl') {
          setTipo = 'profesor'
        } else if (dominio === 'duocuc.cl') {
          setTipo = 'alumno'
        } else {
          setTipo = 'administrador'
        }

        const usuarioTemp = {
          id: res.uid,
          correo: this.usuario.value.correo,
          nom_completo: this.usuario.value.nom_completo,
          rut: this.usuario.value.rut,
          fecha_nac: this.usuario.value.fecha_nac,
          semestre: this.usuario.value.semestre,
          tipo: setTipo
        }
        this.database.createDocumento(usuarioTemp, 'usuarios', res.uid).then(
          (res) => {
            this.usuario.reset();
            this.presentAlert('Resgistrado correctamente!')
            this.router.navigateByUrl('/login')
          }
        )
      },
    )

  }


  obtenerDominio(correo: string) {
    const index = correo.lastIndexOf('@');
    return correo.slice(index + 1, correo.length)
  }

  async presentAlert(mensaje:string) {
    const alert = await this.alertController.create({
      header: mensaje,
      subHeader: '',
      buttons: ['OK'],
    });
    await alert.present();
  }

}

  //método que desencadena el formulario con el boton submit:
/*   async registrar(){
    //Verificar password
    if (this.usuario.controls.password.value != this.verificar_password) {
      alert('CONTRASEÑAS NO COINCIDEN!');
      return;
    }
    //Verificar rut
    if(!this.validacionesService.validarRut(this.usuario.controls.rut.value)){
      alert('Rut inválido.');
      return;
    }

    //Verificar edad
    if(!this.validacionesService.calcEdadReturn(17, this.usuario.controls.fecha_nac.value)){
      alert('Edad mínima 17 años.');
      return;
    }

    await this.usuarioService.addUsuario(this.KEY_USUARIOS, this.usuario.value);
    alert('Usuario registrado.');
    this.router.navigate(['/login']);
  } */


