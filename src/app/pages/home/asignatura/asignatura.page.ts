import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlumnoDetalle, Asignatura, Clase, ClaseAlumnos, Usuario } from 'src/app/interfaces/models';
import { FirebaseService} from 'src/app/services/firebase.service';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.page.html',
  styleUrls: ['./asignatura.page.scss'],
})
export class AsignaturaPage implements OnInit {
  clases: Clase[];
  usuario: Usuario;
  profesor: Usuario;
  claseAlumnos: ClaseAlumnos[];
  id_seccion:string;
  codigoClase:string;
  asignatura: Asignatura;
  
  alumnos: AlumnoDetalle[];
  isModalOpen = false;

  constructor(private database : FirebaseService,private actRoute: ActivatedRoute,private router:Router) { }

  
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
        this.listarClasesAsig();
      })
    );
  }

  listarClasesAsig() {
    this.actRoute.paramMap.subscribe((paramMap) => {
      this.id_seccion=paramMap.get('id1');
      this.database.getDocumento<Asignatura>('asignaturas', paramMap.get('id1')).subscribe((res) => {
          this.asignatura = res;
          this.database.getDocumento<Usuario>('usuarios', res.profe_asig).subscribe((res) => {
            this.profesor = res;
          });
      });

      if(this.usuario.tipo === 'alumno' || this.usuario.tipo === 'admin'){
        this.database.getClaseAsig<Clase>(this.id_seccion).subscribe((res) => {
          var clasesAlumnoTemp = [];
          res.forEach(element => {
            var claseAlumnoTemp = { id: '', alumnos: [], fecha: '', numero: 0, seccion:'' , asistencia: ''};
            claseAlumnoTemp.id = element.id;
            claseAlumnoTemp.alumnos = element.alumnos;
            claseAlumnoTemp.fecha = element.fecha;
            claseAlumnoTemp.numero = element.numero;
            claseAlumnoTemp.seccion = element.seccion;
            element.alumnos.forEach(element => {
               if(element.id_Alumno === this.usuario.id){
                claseAlumnoTemp.asistencia = element.asistencia
               }
            });
            clasesAlumnoTemp.push(claseAlumnoTemp)
          });

          const clasesTemp = clasesAlumnoTemp.sort((p1, p2) =>
            p1.numero < p2.numero ? 1 : p1.numero > p2.numero ? -1 : 0
          );
          return this.claseAlumnos = clasesTemp;
        });
      } 
        this.database.getClaseAsig<Clase>(this.id_seccion).subscribe((res) => {
          const clasesTemp = res.sort((p1, p2) =>
            p1.numero < p2.numero ? 1 : p1.numero > p2.numero ? -1 : 0
          );
          return this.clases = clasesTemp
      });
      
      
    });
  }

  crearClase() {

    var claseTemp = { id: '', alumnos: [], fecha: '', numero: 0, seccion:'' };
    var alumnosClaseTemp = [];
    const idClase = this.database.getId();
    this.asignatura.alumno.forEach((aux) => {
      var alumnoClaseTemp = {
        id_Alumno: '',
        nombre: '',
        rut: '',
        asistencia: '',
      };
      alumnoClaseTemp.id_Alumno = aux['id'];
      alumnoClaseTemp.nombre = aux['nom_completo'];
      alumnoClaseTemp.rut = aux['rut'];
      alumnoClaseTemp.asistencia = 'ausente';
      alumnosClaseTemp.push(alumnoClaseTemp);
    });
    claseTemp.alumnos = alumnosClaseTemp;
    var d = new Date();
    let day = d.toLocaleString();
    claseTemp.fecha = day;
    claseTemp.id = idClase;
    claseTemp.numero = this.clases.length.valueOf() + 1;
    claseTemp.seccion = this.id_seccion
    this.database.createDocumento(claseTemp,'clases',idClase).then((res) => {
        console.log('clase creada')
      });
  }

  async cambiarAsistenciaAlumno(claseId: string) {
    await this.database.getDocumentoUna<Clase>('clases',claseId).subscribe((res) => {
        const alumnos = res.data().alumnos;
        const alumnosTemp = [];
        alumnos.forEach((aux) => {
          if (aux['id_Alumno'] == this.usuario.id) {
            const alumnoClaseTemp = {
              id_Alumno: aux['id_Alumno'],
              nombre: aux['nombre'],
              rut: aux['rut'],
              asistencia: 'presente',
            };
            alumnosTemp.push(alumnoClaseTemp);
          } else {
            alumnosTemp.push(aux);
          }
        });
        return this.database.actualizarAlumnos(alumnosTemp,res.id);
      });
  }
  
  irClase(id){
    this.actRoute.paramMap.subscribe(res=> 
      this.router.navigateByUrl('tabs/home/'+res.get('id1')+'/'+id))
  }

  marcarAsistencia(){
    this.actRoute.paramMap.subscribe((aux) => {
      this.database.getDocumentoUna<Clase>('clases',this.codigoClase).subscribe((res)=>{
        if (res.data().seccion === aux.get('id1')) {
          return this.cambiarAsistenciaAlumno(this.codigoClase).then(
            (res) => {
              console.log('presente!');
              this.codigoClase ='';
            },
            (error)=>{ 
         
              console.log('codigo invalido!');
            }      
          );
        }else{
          console.log('QR de otra seccion');
        }
      },
      (error)=>{ 
       console.log('invalido')
      }
      );
    });

  }
}
