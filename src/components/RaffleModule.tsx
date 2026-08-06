import React, { useState } from 'react';
import { raffleService, type TicketWithCustomer } from '../services/raffleService';
import type { Customer, Raffle } from '../types';
import { Trophy, Sparkles, PartyPopper, RefreshCw, Calendar, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  activeRaffle: Raffle | null;
  onRaffleRenewed: (newRaffle: Raffle) => void;
}

export const RaffleModule: React.FC<Props> = ({ activeRaffle, onRaffleRenewed }) => {
  const [branchFilter, setBranchFilter] = useState<string>('Todas');
  const [winner, setWinner] = useState<{ ticket: string; customer: Customer } | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [drawnTickets, setDrawnTickets] = useState<TicketWithCustomer[]>([]);

  const getFormattedDate = () => {
    const rawDate = new Date().toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' });
    return rawDate.charAt(0).toUpperCase() + rawDate.slice(1);
  };

  // 1. Ejecutar Rifa (Obtiene boletos, saca ganador y renueva la semana)
  async function handleExecuteRaffle() {
    setDrawing(true);

    try {
      let currentRaffle = activeRaffle;
      const dateText = getFormattedDate();
      const newRaffleName = `Rifa Semanal • ${dateText}`;

      // Si no hay rifa activa, creamos una nueva directamente
      if (!currentRaffle) {
        currentRaffle = await raffleService.renewWeeklyRaffle(newRaffleName);
        onRaffleRenewed(currentRaffle);
      }

      // Obtener los boletos emitidos
      const tickets = await raffleService.getTicketsForRaffle(currentRaffle.id, branchFilter);

      if (tickets.length === 0) {
        toast.error('No hay boletos emitidos para este sorteo.');
        return;
      }

      setDrawnTickets(tickets);

      // Cierre y creación de nueva rifa mediante el servicio
      const nextRaffle = await raffleService.renewWeeklyRaffle(newRaffleName, currentRaffle.id);
      onRaffleRenewed(nextRaffle);

      // Selección instantánea de ganador
      const randomIndex = Math.floor(Math.random() * tickets.length);
      const winningItem = tickets[randomIndex];

      setWinner({
        ticket: winningItem.codigo,
        customer: winningItem.clientes,
      });

      setShowModal(true);
      toast.success('¡Sorteo ejecutado con éxito!');

    } catch (err: any) {
      toast.error(err.message || 'Error al ejecutar la rifa');
    } finally {
      setDrawing(false);
    }
  }

  // 2. Volver a sortear en el modal (Memoria local rápida)
  function handleResort() {
    if (drawnTickets.length === 0) return;

    setDrawing(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * drawnTickets.length);
      const winningItem = drawnTickets[randomIndex];

      setWinner({
        ticket: winningItem.codigo,
        customer: winningItem.clientes,
      });

      setDrawing(false);
      toast.info('Se ha seleccionado un nuevo ganador.');
    }, 300);
  }

  return (
    <div className="bg-[#FFFDF9] p-5 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[32px] border border-orange-200/80 shadow-md text-center space-y-5 sm:space-y-6 select-none max-w-2xl mx-auto">
      
      {/* Icono Copa */}
      <div className="inline-flex bg-[#FDEFE3] p-4 sm:p-5 rounded-full border border-orange-200 shadow-inner">
        <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-[#C84B20]" />
      </div>

      {/* Título de la Rifa */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-[#F7F2EB] text-[#8C271E] px-3.5 sm:px-4 py-1.5 rounded-full border border-[#E8DFC8] text-[11px] sm:text-xs font-black uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-[#C84B20]" />
          <span>{getFormattedDate()}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#3D2314] font-brand-display pt-1">
          {activeRaffle ? activeRaffle.nombre : 'Rifa Semanal Activa'}
        </h2>
        <p className="text-xs font-bold text-stone-500 max-w-md mx-auto leading-relaxed">
          Al presionar el botón se elige el ganador y automáticamente se inicia el periodo de la nueva semana.
        </p>
      </div>

      {/* Filtro Sucursal */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-xs sm:text-sm font-bold text-[#60493A] bg-[#F7F2EB] p-3 rounded-2xl max-w-sm mx-auto border border-[#E8DFC8]">
        <span>Filtrar boletos:</span>
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="w-full sm:w-auto bg-white border border-[#D9CBB5] rounded-xl px-3 py-1.5 sm:py-1 font-bold text-[#3D2314] focus:outline-none cursor-pointer text-xs sm:text-sm"
        >
          <option value="Todas">Todas las sucursales</option>
          <option value="Naranjo">Solo Naranjo</option>
          <option value="Sarchí">Solo Sarchí</option>
          <option value="Grecia">Solo Grecia</option>
        </select>
      </div>

      {/* Botón Principal */}
      <div className="pt-2">
        <button
          onClick={handleExecuteRaffle}
          disabled={drawing}
          className="w-full sm:w-auto bg-[#3D2314] hover:bg-[#8C271E] text-white font-black text-base sm:text-lg py-3.5 sm:py-4 px-8 sm:px-10 rounded-full shadow-lg transform active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 mx-auto"
        >
          <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 text-[#F28230] ${drawing ? 'animate-spin' : ''}`} />
          <span>{drawing ? 'Generando Ganador...' : '¡Generar Rifa!'}</span>
        </button>
      </div>

      {/* MODAL DE GANADOR */}
      {showModal && winner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFDF9] rounded-[24px] sm:rounded-[32px] border-2 border-[#C84B20] p-5 sm:p-8 max-w-lg w-full text-center space-y-4 sm:space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 sm:right-5 sm:top-5 p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <PartyPopper className="w-10 h-10 sm:w-12 sm:h-12 text-[#8C271E] mx-auto" />
            
            <span className="inline-block text-[10px] sm:text-xs font-black text-[#8C271E] uppercase tracking-widest bg-[#FDEFE3] px-3.5 sm:px-4 py-1.5 rounded-full border border-orange-200">
              🎉 Cliente Ganador 🎉
            </span>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-[#3D2314] font-brand-display">
                {winner.customer?.nombre || 'Cliente'}
              </h3>
              <p className="text-sm sm:text-base font-bold text-stone-600">
                Teléfono: <span className="text-[#3D2314] font-mono">{winner.customer?.telefono || 'N/A'}</span>
              </p>
            </div>

            <div className="bg-[#F7F2EB] p-3.5 sm:p-4 rounded-2xl border border-[#E8DFC8]">
              <span className="text-xs text-stone-500 font-bold block mb-1">Ticket Ganador</span>
              <span className="font-mono font-black text-[#C84B20] text-lg sm:text-xl bg-white px-4 py-1.5 rounded-xl border border-orange-300 inline-block">
                {winner.ticket}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={handleResort}
                disabled={drawing}
                className="flex-1 bg-[#F7F2EB] hover:bg-[#EFE6D8] font-bold py-3 sm:py-3.5 rounded-xl border border-[#D9CBB5] text-[#3D2314] flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <RefreshCw className={`w-4 h-4 text-[#F28230] ${drawing ? 'animate-spin' : ''}`} />
                <span>Volver a Sortear</span>
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-[#3D2314] hover:bg-[#8C271E] text-white font-black py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-sm shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Finalizar y Cerrar</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};