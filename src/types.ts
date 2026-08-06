export type Branch = 'Naranjo' | 'Sarchí' | 'Grecia';

export interface Customer {
  id: string;
  nombre: string;
  telefono: string;
  sucursal_registro: Branch;
  created_at: string;
}

export interface Raffle {
  id: string;
  nombre: string;
  activa: boolean;
  created_at: string;
}

export interface Ticket {
  id: string;
  cliente_id: string;
  rifa_id: string;
  sucursal_emision: Branch;
  codigo: string;
  created_at: string;
  clientes?: Customer;
}