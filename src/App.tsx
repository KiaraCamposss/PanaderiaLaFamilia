import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { Branch, Raffle } from './types';
import { Toaster } from 'sonner';

import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { CustomerForm } from './components/CustomerForm';
import { TicketGenerator } from './components/TicketGenerator';
import { RaffleModule } from './components/RaffleModule';

export default function App() {
  const [currentBranch, setCurrentBranch] = useState<Branch>('Naranjo');
  const [activeTab, setActiveTab] = useState<'home' | 'customers' | 'tickets' | 'raffle'>('home');
  const [activeRaffle, setActiveRaffle] = useState<Raffle | null>(null);

  useEffect(() => {
    async function fetchActiveRaffle() {
      const { data } = await supabase
        .from('rifas')
        .select('*')
        .eq('activa', true)
        .single();

      if (data) setActiveRaffle(data);
    }
    fetchActiveRaffle();
  }, []);

  return (
    <div className="min-h-screen bg-[#fffaf4] text-stone-800 font-sans flex flex-col md:flex-row">
      {/* Componente que renderiza las notificaciones flotantes (Toast) */}
      <Toaster position="top-right" richColors />

      {/* Sidebar Responsivo (Barra superior con menú en celular / Lateral en PC) */}
      <Sidebar
        currentBranch={currentBranch}
        onBranchChange={setCurrentBranch}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Contenido Principal con padding responsivo */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'home' && (
          <HomeView
            onNavigateToRaffle={() => setActiveTab('raffle')}
            onNavigateToCustomers={() => setActiveTab('customers')}
            onNavigateToTickets={() => setActiveTab('tickets')}
          />
        )}

        {activeTab === 'customers' && (
          <div className="max-w-3xl mx-auto">
            <CustomerForm
              currentBranch={currentBranch}
              activeRaffle={activeRaffle}
              onCustomerCreated={() => {}}
            />
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="max-w-3xl mx-auto">
            <TicketGenerator
              currentBranch={currentBranch}
              activeRaffle={activeRaffle}
            />
          </div>
        )}

        {activeTab === 'raffle' && (
          <div className="max-w-3xl mx-auto">
            <RaffleModule
              activeRaffle={activeRaffle}
              onRaffleRenewed={(newRaffle) => setActiveRaffle(newRaffle)}
            />
          </div>
        )}
      </main>
    </div>
  );
}