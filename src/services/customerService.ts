import { supabase } from '../lib/supabase';
import type { Customer, Branch } from '../types';

export interface CustomerWithCount extends Customer {
  ticket_count?: number;
}

export const customerService = {
  /**
   * Buscar un cliente por su número de teléfono
   */
  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('telefono', phone.trim())
      .single();

    if (error || !data) return null;
    return data as Customer;
  },

  /**
   * Obtener el número total de tickets de un cliente en la rifa activa
   */
  async getCustomerTicketCount(customerId: string, raffleId: string): Promise<number> {
    const { count, error } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('cliente_id', customerId)
      .eq('rifa_id', raffleId);

    if (error) return 0;
    return count || 0;
  },

  /**
   * Registrar un nuevo cliente y generarle automáticamente su 1er ticket
   */
  async createCustomerWithTicket(
    name: string,
    phone: string,
    branch: Branch,
    raffleId: string
  ): Promise<Customer> {
    // 1. Insertar el cliente
    const { data: customer, error: customerError } = await supabase
      .from('clientes')
      .insert({
        nombre: name.trim(),
        telefono: phone.trim(),
        sucursal_registro: branch,
      })
      .select()
      .single();

    if (customerError || !customer) {
      throw new Error(
        customerError?.code === '23505'
          ? 'Este número de teléfono ya está registrado.'
          : customerError?.message || 'Error al guardar cliente'
      );
    }

    // 2. Asignar el 1er ticket de bienvenida
    await this.issueTicket(customer.id, raffleId, branch);

    return customer as Customer;
  },

  /**
   * Emitir un ticket adicional para un cliente
   */
  async issueTicket(customerId: string, raffleId: string, branch: Branch): Promise<string> {
    const ticketCode = 'TKT-' + Math.floor(100000 + Math.random() * 900000);

    const { error } = await supabase.from('tickets').insert({
      cliente_id: customerId,
      rifa_id: raffleId,
      sucursal_emision: branch,
      codigo: ticketCode,
    });

    if (error) {
      throw new Error('Error al emitir el ticket: ' + error.message);
    }

    return ticketCode;
  },

  /**
   * Obtener la lista completa de todos los clientes con la cantidad de tickets en la rifa activa
   */
  async getAllCustomersWithTicketCount(raffleId?: string): Promise<CustomerWithCount[]> {
    const { data: customers, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !customers) return [];

    if (!raffleId) {
      return customers.map(c => ({ ...c, ticket_count: 0 }));
    }

    // Traer todos los tickets de la rifa activa
    const { data: tickets } = await supabase
      .from('tickets')
      .select('cliente_id')
      .eq('rifa_id', raffleId);

    // Mapear el conteo por cliente
    const ticketMap: Record<string, number> = {};
    if (tickets) {
      tickets.forEach((t) => {
        ticketMap[t.cliente_id] = (ticketMap[t.cliente_id] || 0) + 1;
      });
    }

    return customers.map((c) => ({
      ...c,
      ticket_count: ticketMap[c.id] || 0,
    }));
  },

  /**
   * Actualizar los datos de un cliente existente
   */
  async updateCustomer(
    id: string,
    updates: { nombre: string; telefono: string; sucursal_registro: Branch }
  ): Promise<Customer> {
    const { data, error } = await supabase
      .from('clientes')
      .update({
        nombre: updates.nombre.trim(),
        telefono: updates.telefono.trim(),
        sucursal_registro: updates.sucursal_registro,
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'No se pudo actualizar el cliente');
    }

    return data as Customer;
  }
};