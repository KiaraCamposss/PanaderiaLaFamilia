import { supabase } from '../lib/supabase';
import type { Raffle, Customer } from '../types';

export interface TicketWithCustomer {
  codigo: string;
  clientes: Customer;
}

export const raffleService = {
  /**
   * Obtener la rifa activa actualmente
   */
  async getActiveRaffle(): Promise<Raffle | null> {
    const { data, error } = await supabase
      .from('rifas')
      .select('*')
      .eq('activa', true)
      .maybeSingle();

    if (error || !data) return null;
    return data as Raffle;
  },

  /**
   * Obtener los tickets emitidos para una rifa especifica con filtro opcional de sucursal
   */
  async getTicketsForRaffle(raffleId: string, branchFilter?: string): Promise<TicketWithCustomer[]> {
    let query = supabase
      .from('tickets')
      .select('codigo, clientes(*)')
      .eq('rifa_id', raffleId);

    if (branchFilter && branchFilter !== 'Todas') {
      query = query.eq('sucursal_emision', branchFilter);
    }

    const { data, error } = await query;

    if (error || !data) return [];

    // Formatear los clientes correctamente en caso de que vengan en un array
    return data.map((item: any) => ({
      codigo: item.codigo,
      clientes: Array.isArray(item.clientes) ? item.clientes[0] : item.clientes,
    })) as TicketWithCustomer[];
  },

  /**
   * Cierra la rifa actual e inicia un nuevo periodo semanal (boletos a 0)
   */
  async renewWeeklyRaffle(newRaffleName: string, currentRaffleId?: string): Promise<Raffle> {
    // 1. Cierre de rifa anterior
    if (currentRaffleId) {
      await supabase
        .from('rifas')
        .update({ activa: false })
        .eq('id', currentRaffleId);
    }

    // 2. Creación de la nueva semana activa
    const { data: newRaffle, error } = await supabase
      .from('rifas')
      .insert({
        nombre: newRaffleName,
        activa: true,
      })
      .select()
      .single();

    if (error || !newRaffle) {
      throw new Error('Error al crear la nueva rifa: ' + (error?.message || 'Error de conexión'));
    }

    return newRaffle as Raffle;
  }
};