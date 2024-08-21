export class Usuario {
    _id?: number;
    nombre: string;
    apellidos: string;
    username: string;
    password: string;
    email: string;
    telefono: string;
    direccion: string;

    constructor(nombre: string, apellidos: string, username: string, telefono:string, email: string, password: string, direccion: string){
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.direccion = direccion;
        this.telefono = telefono;
        this.username = username;
        this.password = password;
    }
}