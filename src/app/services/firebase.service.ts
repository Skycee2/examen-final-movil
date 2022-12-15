import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FireAuth } from '../interfaces/models';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  loading: any;
  constructor(private database: AngularFirestore, private auth: AngularFireAuth) {}


  createDocumento(data: any, path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).set(data);
  }
  
  getDocumento<tipo>(path: string, id: string) {
    const collection = this.database.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }
  
  getAsignaturaUsuario<tipo>(id: string, tipoUser: string,usuario:object) {
    const asignaturas = this.database.collection<tipo>('asignaturas', (ref) => {
        let query:
          | firebase.firestore.CollectionReference
          | firebase.firestore.Query = ref;
        if (tipoUser === 'profesor') {
          query = query.where('profe_asig', '==', id);
        } else {
          query = query.where('alumno', 'array-contains', usuario);
        }
        return query;
      }).valueChanges();
      return asignaturas;
  }

  eliminarDocumento(path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).delete();
  }

  getId() {
    return this.database.createId();
  }

  getCollection<tipo>(path: string) {
    return this.database.collection<tipo>(path).valueChanges();
  }
  
  
  async login(correo, contraseña) {
    const { user } = await this.auth.signInWithEmailAndPassword(correo, contraseña);
    return user;
  }

  async logout() {
    await this.auth.signOut();
  }

  async verificacion() {
    return (await this.auth.currentUser).sendEmailVerification();
  }

  async registrar(correo, contraseña) {
    const { user } = await this.auth.createUserWithEmailAndPassword(
      correo,
      contraseña
    );
    await this.verificacion();
    return user;
  }

  async getAuthUser() {
    const aux: FireAuth = await this.auth.currentUser;
    return aux;
  }

  //crud administrador
  agregarAsig(coleccion, value){
    try {
      this.database.collection(coleccion).add(value);
      //this.fire.collection(coleccion).doc(id).set(value);
    } catch (error) {
      console.log(error)
    }
  }

  getDatos(coleccion){
    try {
      return this.database.collection(coleccion).snapshotChanges();
    } catch (error) {
      console.log(error);
    }
  }

  eliminar(coleccion, id){
    try {
      this.database.collection(coleccion).doc(id).delete();
    } catch (error) {
      console.log(error);
    }
  }

  getDato(coleccion, id){
    try {
      return this.database.collection(coleccion).doc(id).get();
    } catch (error) {
      console.log(error);
    }
  }

  modificar(coleccion, id, value){
    try {
      this.database.collection(coleccion).doc(id).set(value);
    } catch (error) {
      console.error(error);
    }
  }

///
  getUsuarioTipo<tipo>(tipoUsuario: string) {
    const usuarios = this.database.collection<tipo>('usuarios', (ref) => {
        let query:
          | firebase.firestore.CollectionReference
          | firebase.firestore.Query = ref;
          query = query.where('tipo', '==', tipoUsuario);
        return query;
      }).valueChanges();
      return usuarios;
  }

  ////////////////////////////////////////
  async cambiarClave(correo:string){
    const aux = await this.auth.sendPasswordResetEmail(correo);
    return aux
  }
  
  getClaseAsig<tipo>(id: string) {
    const clases = this.database.collection<tipo>('clases', (ref) => {
        let query:
          | firebase.firestore.CollectionReference
          | firebase.firestore.Query = ref;
          query = query.where('seccion', '==', id);
        return query;
      }).valueChanges();
      return clases;
  }

  actualizarAlumnos(alumnos, id: string) {
    const collection = this.database.collection('clases');
    return collection.doc(id).update({
      alumnos: alumnos,
    });;
  }
  getDocumentoUna<tipo>(path: string, id: string) {
    const collection = this.database.collection<tipo>(path);
    return collection.doc(id).get();
  }

  ///////////crud usuario
  getDatosFire(coleccion){
    try {
      let aux= this.database.collection(coleccion).snapshotChanges();
      return aux
    } catch (error) {
      console.log(error);
    }
  }

  addFire(coleccion, value){
    try {
      this.database.collection(coleccion).add(value);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  deleteFire(coleccion, id){
    try {
      this.database.collection(coleccion).doc(id).delete();
    } catch (error) {
      console.log(error);
    }
  }

  getDatoFire(coleccion, id){
    try {
      return this.database.collection(coleccion).doc(id).get();
    } catch (error) {
      console.log(error);
    }
  }

  updateFire(coleccion, id, value){
    try {
      this.database.collection(coleccion).doc(id).set(value);
    } catch (error) {
      console.log(error);
    }
  }




  
  
}
