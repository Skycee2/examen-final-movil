import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  //Variables para trabajar el storage

 /*  KEY_USUARIOS = 'usuarios'; */


  //variables:
  usuario = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]{1,4}.[A-Za-z]{1,20}@duocuc.cl|[A-Za-z]{1,4}.[A-Za-z]{1,20}@duoc.cl|[A-Za-z]{1,4}.[A-Za-z]{1,20}@profesor.duoc.cl')]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
  });

  loading:any;

  constructor(private cargandoPantalla: LoadingController, private database: FirebaseService , private alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }

    login() {
    this.showLoading('cargando...');
    this.database.login(this.usuario.value.correo, this.usuario.value.contrasena).then(
      (res) => {
        this.usuario.reset();
        this.cerrarCargando();
        this.router.navigateByUrl('/tabs')
        this.presentAlert('Ingresaste correctamente!')
      },(error)=>{
        this.cerrarCargando();
        this.presentAlert('Contraseña o usuario incorrecto!')

      }
    )

  }

  async presentAlert(mensaje:string) {
    const alert = await this.alertController.create({
      header: mensaje,
      message: '',
      buttons: ['OK'],
    });

    await alert.present();
  }
  async showLoading(mensaje:string) {
    this.loading = await this.cargandoPantalla.create({
      message: mensaje,
    });

    await  this.loading.present();
  }

  async cerrarCargando() {
    await this.loading.dismiss();
  }




}

  /*   async ngOnInit() {
      await this.cargarDatos();
  
      this.t_alumno=
      {
        rut: '22.222.222-2',
        nom_completo: 'Satan',
        correo: 'seb.montero@duocuc.cl',
        fecha_nac: '1990-03-24',
        semestre: '1',
        password: 'alumno123',
        tipo_usuario: 'alumno'
      },
  
      this.t_docente = {
        rut: '10.000.000-0',
        nom_completo: 'docente',
        correo: 'profesor@profesor.duoc.cl',
        fecha_nac: '1990-03-24',
        semestre: 'No posee',
        password: 'docente1',
        tipo_usuario: 'docente'      
      };
  
      this.t_admin = {
        rut: '11.111.111-1',
        nom_completo: 'sebastian',
        correo: 'administrador@duoc.cl',
        fecha_nac: '1990-03-24',
        semestre: 'No posee',
        password: 'admin123',
        tipo_usuario: 'administrador'   
      }
      await this.usuarioService.addUsuario(this.KEY_USUARIOS,this.t_admin);
      await this.usuarioService.addUsuario(this.KEY_USUARIOS,this.t_docente);
      await this.usuarioService.addUsuario(this.KEY_USUARIOS,this.t_alumno); */


  //Métodos para poder usar storage
  /* async cargarDatos(){
    this.usuarios = await this.usuarioService.getUsuarios(this.KEY_USUARIOS);
  } */

  //crear nuestro métodos:
  //método para ingresar a home, adaptado:
  /* async login(){
    //Obtener valores en variables por separado
    var validarCorreo = this.usuario.controls.correo.value;
    var validarPass = this.usuario.controls.password.value;
    var usuarioLogin : any;

    //Con el método loginUsuario del usuario.service, rescatamos al usuario
    var usuarioLogin = await this.usuarioService.loginUsuario( this.KEY_USUARIOS, validarCorreo, validarPass);
    //Verificamos si existe el usuario
    if (usuarioLogin != undefined) {
      //Diferencia con el método anterior: antes de redireccionar, preparamos los datos que enviaremos para validar
      var navigationExtras: NavigationExtras = {
        state:{
          usuario: usuarioLogin
        }
      };

      //Según el tipo de usuario, se redirige al home respectivo
      this.router.navigate(['/tabs'], navigationExtras);
      this.usuario.reset();

    }else{
      this.tostadaError();
    }
  } */



