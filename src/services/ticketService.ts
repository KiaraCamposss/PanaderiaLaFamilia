import { supabase } from '../lib/supabase';
import type { Branch } from '../types';

export const ticketService = {
  /**
   * Generar un código único de ticket (Formato: TKT-123456)
   */
  generateTicketCode(): string {
    return 'TKT-' + Math.floor(100000 + Math.random() * 900000);
  },

  /**
   * Emitir un nuevo ticket para un cliente en la rifa activa
   */
  async issueTicket(customerId: string, raffleId: string, branch: Branch): Promise<string> {
    const code = this.generateTicketCode();

    const { error } = await supabase.from('tickets').insert({
      cliente_id: customerId,
      rifa_id: raffleId,
      sucursal_emision: branch,
      codigo: code,
    });

    if (error) {
      throw new Error('Error al registrar el boleto: ' + error.message);
    }

    return code;
  },

  /**
   * Obtener el conteo total de tickets de un cliente en la rifa activa
   */
  async getCustomerTicketCount(customerId: string, raffleId: string): Promise<number> {
    const { count, error } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('cliente_id', customerId)
      .eq('rifa_id', raffleId);

    if (error) return 0;
    return count || 0;
  }
};