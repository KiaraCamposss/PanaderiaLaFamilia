import React, { useState } from 'react';
import { customerService } from '../services/customerService';
import { ticketService } from '../services/ticketService';
import type { Branch, Customer, Raffle } from '../types';
import { Search, Ticket, User, Phone, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  currentBranch: Branch;
  activeRaffle: Raffle | null;
}

export const TicketGenerator: React.FC<Props> = ({ currentBranch, activeRaffle }) => {
  const [searchPhone, setSearchPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [ticketCount, setTicketCount] = useState<number>(0);
  const [issuing, setIssuing] = useState(false);
  const [lastIssuedCode, setLastIssuedCode] = useState<string | null>(null);

  // 1. Buscar cliente por teléfono y obtener su conteo de tickets
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchPhone.trim()) {
      toast.warning('Ingresa un número de teléfono para buscar');
      return;
    }

    setSearching(true);
    setCustomer(null);
    setLastIssuedCode(null);

    try {
      const found = await customerService.getCustomerByPhone(searchPhone.trim());
      if (found) {
        setCustomer(found);
        if (activeRaffle) {
          const count = await ticketService.getCustomerTicketCount(found.id, activeRaffle.id);
          setTicketCount(count);
        }
        toast.success(`Cliente encontrado: ${found.nombre}`);
      } else {
        toast.error('No se encontró ningún cliente registrado con ese número.');
      }
    } catch (err: any) {
      toast.error('Error al buscar: ' + (err.message || 'Intente de nuevo'));
    } finally {
      setSearching(false);
    }
  }

  // 2. Emitir nuevo ticket usando ticketService
  async function handleIssueTicket() {
    if (!customer) return;

    if (!activeRaffle) {
      toast.error('No hay una rifa activa en este momento para asignar boletos.');
      return;
    }

    setIssuing(true);
    try {
      const code = await ticketService.issueTicket(
        customer.id,
        activeRaffle.id,
        currentBranch
      );

      setLastIssuedCode(code);
      setTicketCount((prev) => prev + 1);
      toast.success(`¡Ticket ${code} emitido con éxito!`);
    } catch (err: any) {
      toast.error(err.message || 'Error al emitir el ticket');
    } finally {
      setIssuing(false);
    }
  }

  return (
    <div className="space-y-6 select-none max-w-2xl mx-auto">
      
      {/* TARJETA PRINCIPAL */}
      <div className="bg-[#FFFDF9] rounded-[24px] sm:rounded-[28px] border border-orange-200/80 p-4 sm:p-6 md:p-8 shadow-md space-y-6">
        
        {/* Cabecera */}
        <div className="flex items-center gap-3 border-b border-stone-200/80 pb-4">
          <div className="bg-[#FDE8E6] p-2.5 sm:p-3 rounded-2xl text-[#8C271E] flex-shrink-0">
            <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#8C271E] bg-red-50 px-2.5 py-0.5 rounded-md">
              Emisión en Caja
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#3D2314] font-brand-display mt-0.5">
              Emitir Tickets por Compra
            </h2>
          </div>
        </div>

        {/* Buscador */}
        <form onSubmit={handleSearch} className="space-y-2">
          <label className="text-xs font-black uppercase text-stone-600 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-[#C84B20]" /> Número de Teléfono del Cliente
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="tel"
                placeholder="Ej. 88888888"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-[#F7F2EB] border border-[#E8DFC8] rounded-xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#C84B20]"
                required
              />
              <Search className="w-5 h-5 text-stone-400 absolute right-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="w-full sm:w-auto bg-[#3D2314] hover:bg-[#8C271E] text-white font-bold px-6 py-3 rounded-xl shadow-xs transition-all cursor-pointer text-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {searching ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>

        {/* DETALLE DEL CLIENTE ENCONTRADO */}
        {customer && (
          <div className="bg-[#F7F2EB] rounded-2xl p-4 sm:p-6 border border-[#E8DFC8] space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-orange-100 text-[#C84B20] flex items-center justify-center font-black text-base sm:text-lg shadow-xs flex-shrink-0">
                  {customer.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#3D2314] font-brand-display">
                    {customer.nombre}
                  </h3>
                  <span className="text-xs font-bold text-stone-500 flex flex-wrap items-center gap-1">
                    <User className="w-3 h-3 text-[#C84B20]" /> Tel: {customer.telefono} • Sucursal: {customer.sucursal_registro}
                  </span>
                </div>
              </div>

              {/* Conteo de Tickets */}
              <div className="text-left sm:text-right bg-white px-4 py-2 rounded-xl border border-orange-200/80 shadow-2xs self-start sm:self-auto">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-stone-400 block">
                  Rifa Activa
                </span>
                <span className="text-base sm:text-lg font-black text-[#C84B20]">
                  {ticketCount} {ticketCount === 1 ? 'boleto' : 'boletos'}
                </span>
              </div>
            </div>

            {/* BOTÓN PARA EMITIR BOLETO */}
            <button
              onClick={handleIssueTicket}
              disabled={issuing}
              className="w-full bg-[#3D2314] hover:bg-[#8C271E] text-white font-black py-3.5 sm:py-4 rounded-xl shadow-md transition-all cursor-pointer text-sm sm:text-base flex items-center justify-center gap-2 transform active:scale-98"
            >
              <PlusCircle className="w-5 h-5 text-[#F28230]" />
              {issuing ? 'Generando Ticket...' : 'Emitir Nuevo Ticket de Compra'}
            </button>

            {/* CÓDIGO GENERADO */}
            {lastIssuedCode && (
              <div className="bg-white p-4 rounded-xl border-2 border-emerald-200 text-center space-y-1 animate-in slide-in-from-bottom duration-300">
                <span className="text-xs font-black uppercase text-emerald-600 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> ¡Ticket Generado con Éxito!
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-[#3D2314] tracking-widest">
                  {lastIssuedCode}
                </div>
                <span className="text-[11px] font-bold text-stone-400 block">
                  Registrado en sucursal {currentBranch}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ALERTA SI NO HAY RIFA ACTIVA */}
        {!activeRaffle && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-800 text-xs font-bold">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              Atención: No se puede emitir boletos porque no existe una Rifa Semanal activa actualmente.
            </span>
          </div>
        )}

      </div>
    </div>
  );
};