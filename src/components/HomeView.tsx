import React from 'react';
import { Trophy, UserPlus, Ticket, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onNavigateToRaffle: () => void;
  onNavigateToCustomers: () => void;
  onNavigateToTickets?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToRaffle,
  onNavigateToCustomers,
  onNavigateToTickets,
}) => {
  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto select-none">
      
      {/* 1. HERO CARD ADAPTADO A MÓVILES Y DESKTOP */}
      <div className="bg-[#E3C39D] text-stone-900 rounded-[28px] md:rounded-[38px] p-6 md:p-12 relative overflow-hidden shadow-xl border border-[#d6b289]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Lado Izquierdo: Textos y Botón */}
          <div className="md:col-span-7 space-y-4 md:space-y-5 z-10 text-center md:text-left">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#8C271E] font-sans">
              PANADERÍA LA FAMILIA • A SU SERVICIO
            </span>

            {/* Título adaptable */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-brand-display text-[#3D2314] leading-[1.1] tracking-tight">
              Pan Fresco con <br className="hidden sm:inline" />
              <span className="text-[#C84B20]"> El Mejor Sabor</span>
            </h1>

            <p className="text-[#4A2E1B] font-medium text-xs sm:text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0">
              Sabor, calidad y tradición en cada bocado. Registra a tus clientes por teléfono, acumula boletos digitales y participa en nuestros grandes sorteos semanales.
            </p>

            <div className="pt-2 flex justify-center md:justify-start">
              <button
                onClick={onNavigateToRaffle}
                className="w-full sm:w-auto justify-center bg-[#3D2314] hover:bg-[#8C271E] text-[#FFF6EB] font-black text-xs sm:text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-3"
              >
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#F28230]" />
                <span>EJECUTAR RIFA SEMANAL</span>
                <ArrowRight className="w-4 h-4 text-[#F28230]" />
              </button>
            </div>
          </div>

          {/* Lado Derecho: Imagen adaptada en celular */}
          <div className="md:col-span-5 flex justify-center items-center z-10 relative">
            <div className="w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px] aspect-square flex items-center justify-center">
              <img
                src={`${import.meta.env.BASE_URL}pan.png`}
                alt="Panadería La Familia"
                className="w-full h-full max-h-56 md:max-h-none object-contain filter drop-shadow-[0_15px_15px_rgba(61,35,20,0.25)] hover:scale-105 transition-transform duration-500"
                onError={() => {
                  console.warn("Verifica que pan.png esté guardado dentro de la carpeta public/");
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* 2. TARJETAS DE ACCIÓN ABAJO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Card 1: Registrar Cliente */}
        <div
          onClick={onNavigateToCustomers}
          className="bg-[#FFFDF9] p-5 sm:p-7 rounded-[24px] sm:rounded-[28px] border border-orange-200/80 shadow-md hover:shadow-xl hover:border-[#C84B20] transition-all duration-300 cursor-pointer group flex items-center sm:items-start justify-between"
        >
          <div className="space-y-2 sm:space-y-3 pr-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FDEFE3] text-[#C84B20] rounded-2xl flex items-center justify-center group-hover:bg-[#C84B20] group-hover:text-white transition-colors duration-300">
              <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#C84B20] bg-orange-50 px-2 py-0.5 rounded-md">
                Ingreso Rápido
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#3D2314] font-brand-display mt-1 group-hover:text-[#C84B20] transition-colors">
                Registrar Nuevo Cliente
              </h3>
              <p className="text-stone-500 text-xs font-bold mt-1 leading-relaxed">
                Agrega al cliente por su número de teléfono y emite su 1er ticket de bienvenida.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-[#C84B20] group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>

        {/* Card 2: Emitir Tickets */}
        <div
          onClick={onNavigateToTickets || onNavigateToCustomers}
          className="bg-[#FFFDF9] p-5 sm:p-7 rounded-[24px] sm:rounded-[28px] border border-orange-200/80 shadow-md hover:shadow-xl hover:border-[#8C271E] transition-all duration-300 cursor-pointer group flex items-center sm:items-start justify-between"
        >
          <div className="space-y-2 sm:space-y-3 pr-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FDE8E6] text-[#8C271E] rounded-2xl flex items-center justify-center group-hover:bg-[#8C271E] group-hover:text-white transition-colors duration-300">
              <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#8C271E] bg-red-50 px-2 py-0.5 rounded-md">
                Emisión Caja
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#3D2314] font-brand-display mt-1 group-hover:text-[#8C271E] transition-colors">
                Emitir Tickets por Compra
              </h3>
              <p className="text-stone-500 text-xs font-bold mt-1 leading-relaxed">
                Busca al cliente registrado y suma más boletos digitales por sus compras del día.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-[#8C271E] group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>

      </div>

    </div>
  );
};