export interface Platillo {
    id: number;
    platilloId?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    rating?: number;
    comentarios?: { comentario: string; usuarioNombre: string }[];

}