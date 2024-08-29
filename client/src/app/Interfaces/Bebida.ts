export interface Bebida {
    bebidaId?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    rating?: number;
    comentarios?: { comentario: string; usuarioNombre: string }[];

}