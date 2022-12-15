import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { FirebaseService } from 'src/app/services/firebase.service';



@Component({
  selector: 'app-error404',
  templateUrl: './error404.page.html',
  styleUrls: ['./error404.page.scss'],
})
export class Error404Page implements OnInit {
  cant_personajes: number = 0;
  personajes: any[] = [];
  personaje_img:any;
  personaje_species:string;
  personaje_status:string;
  personaje_name:string;
  constructor(private router: Router, private database: FirebaseService, private apiService: ApiService, private alertController: AlertController) { }

  async ngOnInit() {

    //llamar al metodo que obtiene a todos los personajes:
    let respuesta = await this.apiService.get();
    respuesta.subscribe( (data: any) => {
      console.log(data);
      this.personaje_img = data.image;
      this.personaje_name = data.name;
      this.personaje_status = data.status; 
      this.personaje_species = data.species;
    });
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

}
