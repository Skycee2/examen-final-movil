export interface Asignatura{
    id_asig: string;
    sigla_asig:string;
    nom_asig: string;
    profe_asig:string;
    alumno : [];
}

export interface  Clase{
    id: string;
    alumnos : AlumnoClase[];
    fecha: string;
    numero: number;
    seccion:string;
}
export interface AlumnoClase{
    asistencia:string;
    id_Alumno:string;
    nombre:string;
    rut:string;
};

export interface AsignaturaHome {
    id_asig: string;
    alumno : [];
    nom_asig: string;
    profe_asig: {
        id:string,
        nombre: string,
    };
    num_alumnos: number;
    sigla_asig:string;
} 

export interface AlumnoDetalle {
    id: string;
    nom_completo: string;
    rut: string;
  };
  export interface  ClaseAlumnos{
    id: string;
    fecha: string;
    numero: number;
    seccion:string;
    asistencia:string;
}





  export interface AlumnoClase {
    asistencia:string
    id_Alumno:string,
    nombre:string,
    rut:string
    
  };

export interface Usuario {
    id:string;
    rut: string;
    nom_completo:string;
    correo: string;
    semestre:number;
    fecha_nac:string;
    tipo: string;

}
export interface FireAuth {
    uid:string;
    email:string;
    displayName:string;
    emailVerified:boolean;


}

