import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Address } from 'cluster';
import { FirebaseApp } from '@angular/fire/app';
import { ValidacionesService } from 'src/app/services/validaciones.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
/* import { GooglePlaceDirective } from 'ngx-google-places-autocomplete'; */

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  //Tipos de usuario
/*   tipoUsuario: any[] = [{
    t_usuario: 'alumno'
  },
  {
    t_usuario: 'profesor'
  },
  {
    t_usuario: 'administrador'
  }]; */

  //VAMOS A CREAR EL GRUPO DEL FORMULARIO:
  usuario = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
    nom_completo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    correo: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]{1,4}.[A-Za-z]{1,20}@duocuc.cl|[A-Za-z]{1,4}.[A-Za-z]{1,20}@duoc.cl|[A-Za-z]{1,4}.[A-Za-z]{1,20}@profesor.duoc.cl')]),
    fecha_nac: new FormControl('', Validators.required),
    semestre: new FormControl('', [Validators.required, Validators.min(1), Validators.max(8)]),
    contrasena: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),

    /* nro_cel: new FormControl('', [Validators.required, Validators.pattern('[0-9]{0,8}')]) */
  });

  //Variable para validar
  verificar_password: string;
  buscarUsu: any = '';
  buscarCorreo: any = '';
  //Variables para trabajar el storage
  usuarios: any[] = [];
  // updateId: any = '';
  v_agregar: boolean = false; 

  constructor(
    private validacionesService: ValidacionesService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private database: FirebaseService,
    private router: Router) { }

  ngOnInit() {
     this.cargarDatos(); 
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
        }
        else if(dominio === 'duocuc.cl') {
          setTipo = 'alumno'
        }
        else {
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



   //Métodos para poder usar storage
  cargarDatos() {
    this.database.getDatosFire('usuarios').subscribe(
      datosfb => {
        this.usuarios = [];
        for (let usuario of datosfb) {
          // console.log(usuario.payload.doc.data());
          let usu = usuario.payload.doc.data();
          usu['id'] = usuario.payload.doc.id;
          this.usuarios.push(usu);
        }
      }
    );
  }

  /*  

  //método del formulario
  async registrar() {

    //Verificar contrasena
    if (this.usuario.controls.contrasena.value != this.verificar_password) {
      return this.presentAlert('CONTRASEÑAS NO COINCIDEN!');
    }

    //Verificar rut
    if (!this.validacionesService.validarRut(this.usuario.controls.rut.value)) {
      return this.presentAlert('RUT INVALIDO, VUELVA A INTENTAR')
    }

    //Verificar edad
    if (!this.validacionesService.calcEdadReturn(17, this.usuario.controls.fecha_nac.value)) {
      return this.presentAlert('La edad debe ser mayor a 17 años!');
    }
    this.buscarUsu = this.usuarios.find(u => u.rut == this.usuario.value.rut);
    this.buscarCorreo = this.usuarios.find(u => u.correo == this.usuario.value.correo);
    if (this.buscarUsu == undefined && this.buscarCorreo == undefined) {
      this.database.addFire('usuarios', this.usuario.value);
      this.presentAlert('Usuario registrado!')
    } else if (this.buscarUsu != undefined) {
      this.presentAlert('El rut ya está registrado.');
    } else if (this.buscarCorreo != undefined) {
      this.presentAlert('El correo ya está registrado.')
    };

    //verificar registro
    this.cargarDatos();
    this.usuario.reset();
    this.verificar_password = '';
    this.v_agregar = false;
  }

  //Método eliminar
  async eliminar(id) {
    this.database.deleteFire('usuarios', id);
    await this.cargandoPantalla('Eliminando...')
    this.cargarDatos();
  }

  //Método para traer un usuario
  async buscar(id) {
    await this.cargandoPantalla('Buscando...')
    var buscarUsu = this.database.getDatoFire('usuarios', id);
    buscarUsu.subscribe(
      (resp: any) => {
        let usr = resp.data();
        usr['id'] = resp.id;
        this.usuario.setValue(usr)
      }
    )
  }



  //Método para modificar usuario
  async modificar() {
    //Verificar contrasena
    if (this.usuario.controls.contrasena.value != this.verificar_password) {
      return this.presentAlert('CONTRASEÑAS NO COINCIDEN!');
    }

    //Verificar rut
    if (!this.validacionesService.validarRut(this.usuario.controls.rut.value)) {
      return this.presentAlert('RUT INVALIDO, VUELVA A INTENTAR')
    }

    //Verificar edad
    if (!this.validacionesService.calcEdadReturn(17, this.usuario.controls.fecha_nac.value)) {
      return this.presentAlert('La edad debe ser mayor a 17 años!');
    }

    await this.cargandoPantalla('Modificando...')

    let usr = this.usuario.value;
    this.database.updateFire('usuarios', this.usuario.value.id, usr);
    this.usuario.reset();
    // this.updateId = '';
  }

  //Método para limpiar campos
  async limpiar(){
    await this.cargandoPantalla('Limpiando datos...')
    this.usuario.reset();
    this.verificar_password = '';
  } */

  //Método para mostrar "cargando pantalla"
  async cargandoPantalla(message) {
    const cargando = await this.loadingController.create({
      message,
      duration: 800,
      spinner: 'lines-small'
    });

    cargando.present();
  }

  async presentAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: mensaje,
      message: '',
      buttons: ['OK'],
    });

    await alert.present();
  }


  //alert cerrar sesión
  async logoutAlert() {
    const alert = await this.alertController.create({
      header: 'Estas seguro de salir?',
      cssClass: '',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
          role: 'cancel',
        },
        {
          text: 'Si',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.logout();
          },
        }
      ],
    });

    await alert.present();

  }

  logout() {
    this.database.logout();
    this.router.navigateByUrl('/login')
  }

  handleChange(e) {
    if(e.detail.value == 'alumno'){
      
      let domcorreo = '@duocuc.cl';
      console.log(domcorreo);
      this.usuario.patchValue({
        correo: domcorreo
      });
      return this.usuario.value.correo = domcorreo;

    }else if(e.detail.value == 'profesor'){
      
      let domcorreo = '@profesor.duoc.cl';
      console.log(domcorreo);
      this.usuario.patchValue({
        correo: domcorreo
      });
      return this.usuario.value.correo = domcorreo;
    
    }else{
      let domcorreo = '@duoc.cl';
      console.log(domcorreo);
      this.usuario.patchValue({
        correo: domcorreo
      });
      return this.usuario.value.correo = domcorreo;
    
    }
  };

  public handleAddressChange(address: Address) {
    console.log(address);
  }



}
