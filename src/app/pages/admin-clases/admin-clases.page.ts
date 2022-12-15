import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AlumnoDetalle, Asignatura, Usuario } from 'src/app/interfaces/models';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-admin-clases',
  templateUrl: './admin-clases.page.html',
  styleUrls: ['./admin-clases.page.scss'],
})
export class AdminClasesPage implements OnInit {

  asignatura = new FormGroup({
    id_asig: new FormControl(''),
    sigla_asig: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]{1,5}[0-9]{4}')]),
    nom_asig: new FormControl('', [Validators.required, Validators.minLength(6)]),
    profe_asig: new FormControl('', [Validators.required]),
    alumno: new FormControl([]),
  });

  asignaturas: Asignatura[] = [];
  alumnos: AlumnoDetalle[] = [];
  profesores: Usuario[] = [];
  alumnos_seleccionados: [];


  constructor(private cargandoPantalla: LoadingController,private router: Router, private database: FirebaseService, private alertController: AlertController, private dbangular: AngularFirestore, private auth: AngularFireAuth,/* private usuarioService: UsuarioService */ private loadingController: LoadingController) { }

  ngOnInit() {
    this.cargarAsignaturas();
    this.cargarProfesAlumnos();
  }

  cargarAsignaturas() {
    this.database.getCollection<Asignatura>('asignaturas').subscribe((res) => {
      this.asignaturas = res;
    });
  }

  cargarProfesAlumnos() {
    this.database.getUsuarioTipo<Usuario>('profesor').subscribe(
      (respuesta) => {
        this.profesores = respuesta
      }
    )
    this.database.getUsuarioTipo<Usuario>('alumno').subscribe(
      (respuesta) => {
        console.log(respuesta);
        this.alumnos = respuesta
        var alumnostemp = []
        respuesta.forEach(element => {
          var alumnotemp = {
            id: '',
            nom_completo: '',
            rut: '',
          };
          alumnotemp.id = element.id;
          alumnotemp.nom_completo = element.nom_completo;
          alumnotemp.rut = element.rut;
          alumnostemp.push(alumnotemp);
        });
        this.alumnos = alumnostemp;

        console.log(this.alumnos)
      }
    )
  }

  registraAsig() {
    console.log(this.asignatura.value);

    if (this.asignatura.value.id_asig === '' || this.asignatura.value.id_asig === null) {
      const idtemp = this.database.getId();
      this.asignatura.value.id_asig = idtemp;
      this.database.createDocumento(this.asignatura.value, 'asignaturas', idtemp).then((res) => {
        console.log('asignatura ingresada con exito!!')
      });
    } else {
      this.database.createDocumento(this.asignatura.value, 'asignaturas', this.asignatura.value.id_asig).then((res) => {
        console.log('asignatira ingresada');
      });
    }
  }


  eliminarAsig(id: string) {
    this.database.eliminarDocumento('asignaturas', id).then(
      () => {

      });
  }


  async buscarAsig(id: string) {
    this.database.getDocumento<Asignatura>('asignaturas', id).subscribe((res) => {
      this.asignatura.setValue(res);
      this.alumnos_seleccionados = res.alumno;

      /* this.alumnos = res.alumno; */
      console.log(this.asignatura);

    });
  }

  compareWith(o1, o2) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((o) => o.id === o1.id);
    }

    return o1.id === o2.id;
  }

  

  limpiarAsig() {
    this.asignatura.reset();
  }


  //////////////////////////////////////////////



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
  /* async ngOnInit() {
    await this.cargarAsignaturas();
    await this.asignarProfesor();
 
    this.asigPredef = {
      cod_asig: '15483569',
      nom_asig: 'Programación de algoritmos cuánticos',
      sigla_asig: 'PGY5050',
      prof_asignatura: 'Rick Sánchez',
      clasif_esc: 'Informática y telecomunicaciones'
    };
 
    await this.usuarioService.agregarAsignatura(this.KEY_ASIGNATURAS, this.asigPredef);
  }
 
  //Método para poder usar storage
  async cargarAsignaturas(){
    this.asignaturas = await this.usuarioService.obtenerAsignaturas(this.KEY_ASIGNATURAS);
  }
 
  //Método para traer ususarios de tipo profesor
  async asignarProfesor(){
    this.usuarios = await this.usuarioService.obtenerProfesores(this.KEY_USUARIOS);
  }
 
  //Método registrar asignatura
  async registrarAsignatura(){
    //verificar registro
    var resp = await this.usuarioService.agregarAsignatura(this.KEY_ASIGNATURAS, this.asignatura.value);
    if(resp){
      this.cargarAsignaturas();
    }
    alert('Asignatura registrada.');
    this.asignatura.reset();
  }
 
  //Método eliminar asignatura
  async eliminarAsignatura(cod_asig){
    await this.usuarioService.eliminarAsig(this.KEY_ASIGNATURAS, cod_asig);
    await this.cargandoPantalla('Eliminando...')
    await this.cargarAsignaturas();
  }
 
  //Método para buscar una asignatura
  async buscarAsignatura(cod_asig){
    var buscarAsig = await this.usuarioService.obtenerAsignatura(this.KEY_ASIGNATURAS, cod_asig);
    this.asignatura.setValue(buscarAsig);
  }
 
  //Método para modificar asignatura
  async modificarAsig(){
    this.usuarioService.modificarAsignatura(this.KEY_ASIGNATURAS, this.asignaturas);
    await this.cargarAsignaturas();
  }
 
  //Método para limpiar campos
  limpiarAsig(){
    this.asignatura.reset();
  }
 
  //Método para mostrar "cargando pantalla"
  async cargandoPantalla(message){
    const cargando = await this.loadingController.create({
      message,
      duration: 3000,
      spinner: 'lines-small'
    });
 
    cargando.present();
  } */


}
