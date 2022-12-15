import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Asignatura, AsignaturaHome, Usuario } from 'src/app/interfaces/models';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  asignaturas: AsignaturaHome[];
  usuario: Usuario;

  constructor(private router: Router,private database: FirebaseService,private alertController: AlertController) { }

  ngOnInit() {
    this.cargarUsuario();
  }



  cargarUsuario(){
    this.database.getAuthUser().then((res)=>{
       this.database.getDocumento<Usuario>('usuarios', res.uid).subscribe(
        (res)=>{
          this.usuario = res;
          this.cargarAsigs()
        }
       )
    })
  }
  cargarAsigs(){
    console.log(this.usuario.id+this.usuario.tipo)
    var usuTEmp={
      id: this.usuario.id,
      nom_completo: this.usuario.nom_completo,
      rut: this.usuario.rut
    }
    this.database.getAsignaturaUsuario<Asignatura>(this.usuario.id,this.usuario.tipo,usuTEmp).subscribe((res)=>{

      var asigsHomeTemp = []
      res.forEach(aux => {
        var asigHomeTemp = {
          id_asig: '',
          alumno : [],
          nom_asig: '',
          profe_asig: {
            id:'',
            nombre: '',
            },
          num_alumnos: 0,
          sigla_asig: '',
        }
        asigHomeTemp.id_asig = aux.id_asig;
        asigHomeTemp.alumno = aux.alumno;
        asigHomeTemp.nom_asig = aux.nom_asig
        asigHomeTemp.num_alumnos = aux.alumno.length,
        this.database.getDocumento<Usuario>('usuarios', aux.profe_asig).subscribe(
          (res) => {
            asigHomeTemp.profe_asig.id = res.id;
            asigHomeTemp.profe_asig.nombre = res.nom_completo;
        });
        asigHomeTemp.sigla_asig = aux.sigla_asig
        asigsHomeTemp.push(asigHomeTemp)
      });
      this.asignaturas = asigsHomeTemp
      
    })
  }

  async presentAlert() {
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
            this.logout()  ;
          },
        }
      ],
    });

    await alert.present();

  }

  logout(){
    this.database.logout();
    this.router.navigateByUrl('/login')
  }

  async irDetalle(id_seccion){
    this.router.navigateByUrl('tabs/home/'+id_seccion)
  }

}
