import React from 'react';
import type { Branch } from '../types';
import { Home, Users, Ticket, Trophy, MapPin } from 'lucide-react';

interface SidebarProps {
  currentBranch: Branch;
  onBranchChange: (branch: Branch) => void;
  activeTab: 'home' | 'customers' | 'tickets' | 'raffle';
  onTabChange: (tab: 'home' | 'customers' | 'tickets' | 'raffle') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentBranch,
  onBranchChange,
  activeTab,
  onTabChange,
}) => {
  const menuItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'raffle', label: 'Generar Rifa', icon: Trophy },
  ] as const;

  return (
    <aside className="w-64 bg-[#F7F2EB] text-stone-800 min-h-screen flex flex-col border-r border-[#E8DFC8] shadow-xs flex-shrink-0 select-none justify-between">
      <div>
        {/* Cabecera con Logo Proporcionado y Tipografía Alineada */}
        <div className="p-5 border-b border-[#E8DFC8]">
          <div className="flex items-center gap-3">
            {/* Contenedor del Logo más amplio (w-16 h-16) */}
            <div className="w-16 h-16 bg-white p-1 rounded-2xl border border-orange-200/80 shadow-xs flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="/logo.png"
                alt="Logo Panadería La Familia"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            
            {/* Título alineado sin rotaciones */}
            <div className="flex flex-col justify-center">
              <span className="text-[#C84B20] font-brand-cursive text-xl font-bold leading-tight">
                La Familia
              </span>
              <h1 className="text-base font-black text-[#3D2314] font-brand-display tracking-wider uppercase leading-none mt-0.5">
                PANADERÍA
              </h1>
            </div>
          </div>
          
          <div className="mt-3.5">
            <span className="inline-block bg-[#8C271E] text-white text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full shadow-xs">
              A su Servicio
            </span>
          </div>
        </div>

        {/* Selector de Sucursal */}
        <div className="p-4">
          <div className="bg-[#EFE6D8] p-3 rounded-2xl border border-[#D9CBB5] space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-[#8C271E] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#C84B20]" /> Sucursal Activa
            </label>
            <select
              value={currentBranch}
              onChange={(e) => onBranchChange(e.target.value as Branch)}
              className="w-full bg-[#F7F2EB] font-bold text-[#3D2314] px-2.5 py-1.5 rounded-xl border border-[#D9CBB5] focus:outline-none focus:ring-1 focus:ring-[#C84B20] cursor-pointer text-sm"
            >
              <option value="Naranjo">Naranjo</option>
              <option value="Sarchí">Sarchí</option>
              <option value="Grecia">Grecia</option>
            </select>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#3D2314] text-[#FFF6EB] shadow-sm'
                    : 'text-[#60493A] hover:bg-[#EFE6D8] hover:text-[#3D2314]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#F28230]' : 'text-[#8C7462]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <div className="w-2 h-2 rounded-full bg-[#F28230]" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[#E8DFC8] text-center text-xs font-semibold text-[#8C7462]">
        Panadería La Familia © 2026
      </div>
    </aside>
  );
};