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
    <div className="space-y-8 max-w-5xl mx-auto select-none">
      
      {/* 1. HERO CARD ESTILO SWEETDELIGHTS ADAPTADO A TU MARCA */}
      <div className="bg-[#E3C39D] text-stone-900 rounded-[38px] p-8 md:p-12 relative overflow-hidden shadow-xl border border-[#d6b289]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Lado Izquierdo: Textos Exactos y Botón estilo Píldora */}
          <div className="md:col-span-7 space-y-5 z-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#8C271E] font-sans">
              PANADERÍA LA FAMILIA • A SU SERVICIO
            </span>

            {/* Título en dos colores */}
            <h1 className="text-4xl md:text-5xl font-black font-brand-display text-[#3D2314] leading-[1.1] tracking-tight">
              Pan Fresco con <br />
              <span className="text-[#C84B20]">El Mejor Sabor</span>
            </h1>

            <p className="text-[#4A2E1B] font-medium text-sm md:text-base leading-relaxed max-w-md">
              Sabor, calidad y tradición en cada bocado. Registra a tus clientes por teléfono, acumula boletos digitales y participa en nuestros grandes sorteos semanales.
            </p>

            <div className="pt-2">
              <button
                onClick={onNavigateToRaffle}
                className="bg-[#3D2314] hover:bg-[#8C271E] text-[#FFF6EB] font-black text-sm px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-3"
              >
                <Trophy className="w-5 h-5 text-[#F28230]" />
                <span>EJECUTAR RIFA SEMANAL</span>
                <ArrowRight className="w-4 h-4 text-[#F28230]" />
              </button>
            </div>
          </div>

          {/* Lado Derecho: pan.png Adaptado con import.meta.env.BASE_URL */}
          <div className="md:col-span-5 flex justify-center items-center z-10 relative">
            <div className="w-full max-w-[320px] aspect-square flex items-center justify-center">
              <img
                src={`${import.meta.env.BASE_URL}pan.png`}
                alt="Panadería La Familia"
                className="w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(61,35,20,0.25)] hover:scale-105 transition-transform duration-500"
                onError={() => {
                  console.warn("Verifica que pan.png esté guardado dentro de la carpeta public/");
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* 2. TARJETAS DE ACCIÓN ABAJO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Registrar Cliente */}
        <div
          onClick={onNavigateToCustomers}
          className="bg-[#FFFDF9] p-7 rounded-[28px] border border-orange-200/80 shadow-md hover:shadow-xl hover:border-[#C84B20] transition-all duration-300 cursor-pointer group flex items-start justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 bg-[#FDEFE3] text-[#C84B20] rounded-2xl flex items-center justify-center group-hover:bg-[#C84B20] group-hover:text-white transition-colors duration-300">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#C84B20] bg-orange-50 px-2 py-0.5 rounded-md">
                Ingreso Rápido
              </span>
              <h3 className="text-xl font-black text-[#3D2314] font-brand-display mt-1 group-hover:text-[#C84B20] transition-colors">
                Registrar Nuevo Cliente
              </h3>
              <p className="text-stone-500 text-xs font-bold mt-1 leading-relaxed">
                Agrega al cliente por su número de teléfono y emite su 1er ticket de bienvenida.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-[#C84B20] group-hover:translate-x-1 transition-all" />
        </div>

        {/* Card 2: Emitir Tickets */}
        <div
          onClick={onNavigateToTickets || onNavigateToCustomers}
          className="bg-[#FFFDF9] p-7 rounded-[28px] border border-orange-200/80 shadow-md hover:shadow-xl hover:border-[#8C271E] transition-all duration-300 cursor-pointer group flex items-start justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 bg-[#FDE8E6] text-[#8C271E] rounded-2xl flex items-center justify-center group-hover:bg-[#8C271E] group-hover:text-white transition-colors duration-300">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8C271E] bg-red-50 px-2 py-0.5 rounded-md">
                Emisión Caja
              </span>
              <h3 className="text-xl font-black text-[#3D2314] font-brand-display mt-1 group-hover:text-[#8C271E] transition-colors">
                Emitir Tickets por Compra
              </h3>
              <p className="text-stone-500 text-xs font-bold mt-1 leading-relaxed">
                Busca al cliente registrado y suma más boletos digitales por sus compras del día.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-300 group-hover:text-[#8C271E] group-hover:translate-x-1 transition-all" />
        </div>

      </div>

    </div>
  );
};