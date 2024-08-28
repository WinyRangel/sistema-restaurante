import { ItemCarrito } from './ItemCarrito';

export interface Carrito {
  carritoId: number;
  usuarioId: number;
  items: ItemCarrito[];
  estado: 'En Preparación' | 'En Proceso de Entrega' | 'Entregado'; // Estado del carrito
}