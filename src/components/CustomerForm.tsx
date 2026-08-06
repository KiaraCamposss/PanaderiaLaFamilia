import React, { useState, useEffect } from 'react';
import { customerService, type CustomerWithCount } from '../services/customerService';
import type { Branch, Customer, Raffle } from '../types';
import { UserPlus, Search, Edit2, Users, Check, X, Phone, User, Ticket } from 'lucide-react';
import { toast } from 'sonner'; 

interface Props {
  currentBranch: Branch;
  activeRaffle: Raffle | null;
  onCustomerCreated?: () => void;
}

export const CustomerForm: React.FC<Props> = ({ currentBranch, activeRaffle }) => {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');

  const [customers, setCustomers] = useState<CustomerWithCount[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('Todas');

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [editSucursal, setEditSucursal] = useState<Branch>('Naranjo');
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, [activeRaffle]);

  async function loadCustomers() {
    setLoadingList(true);
    const data = await customerService.getAllCustomersWithTicketCount(activeRaffle?.id);
    setCustomers(data);
    setLoadingList(false);
  }

  // Crear cliente con Toast
  async function handleCreateCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) return;

    if (!activeRaffle) {
      toast.warning('No hay una rifa activa. Inicia una semana antes de continuar.');
      return;
    }

    setLoading(true);
    try {
      await customerService.createCustomerWithTicket(
        nombre.trim(),
        telefono.trim(),
        currentBranch,
        activeRaffle.id
      );

      toast.success('¡Cliente registrado con éxito y 1er ticket asignado!');
      setNombre('');
      setTelefono('');
      await loadCustomers();
      setViewMode('list');
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar el cliente');
    } finally {
      setLoading(false);
    }
  }

  // Abrir Modal de Edición
  function handleOpenEdit(customer: Customer) {
    setEditingCustomer(customer);
    setEditNombre(customer.nombre);
    setEditTelefono(customer.telefono);
    setEditSucursal(customer.sucursal_registro);
  }

  // Guardar Edición con Toast
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCustomer) return;

    setSavingEdit(true);
    try {
      await customerService.updateCustomer(editingCustomer.id, {
        nombre: editNombre.trim(),
        telefono: editTelefono.trim(),
        sucursal_registro: editSucursal,
      });

      toast.success('¡Datos del cliente actualizados correctamente!');
      setEditingCustomer(null);
      await loadCustomers();
    } catch (err: any) {
      toast.error('Error al actualizar cliente: ' + (err.message || 'Intente nuevamente'));
    } finally {
      setSavingEdit(false);
    }
  }

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telefono.includes(searchTerm);
    const matchesBranch =
      branchFilter === 'Todas' || c.sucursal_registro === branchFilter;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-6 select-none">
      
      {/* Selector de Pestañas Responsivo */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-[#F7F2EB] p-2 rounded-2xl border border-[#E8DFC8] gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#3D2314] text-[#FFF6EB] shadow-sm'
                : 'text-[#60493A] hover:bg-[#EFE6D8]'
            }`}
          >
            <Users className="w-4 h-4 text-[#F28230]" /> Listado de Clientes ({customers.length})
          </button>

          <button
            onClick={() => setViewMode('create')}
            className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              viewMode === 'create'
                ? 'bg-[#3D2314] text-[#FFF6EB] shadow-sm'
                : 'text-[#60493A] hover:bg-[#EFE6D8]'
            }`}
          >
            <UserPlus className="w-4 h-4 text-[#F28230]" /> Registrar Cliente Nuevo
          </button>
        </div>
      </div>

      {/* VISTA 1: LISTADO DE CLIENTES */}
      {viewMode === 'list' && (
        <div className="bg-[#FFFDF9] rounded-[24px] sm:rounded-[28px] border border-orange-200/80 p-4 sm:p-6 shadow-md space-y-5">
          
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Buscar por nombre o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F2EB] border border-[#E8DFC8] rounded-xl text-stone-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C84B20]"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-stone-500 uppercase">Sucursal:</span>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="bg-[#F7F2EB] border border-[#E8DFC8] rounded-xl px-3 py-2 font-bold text-sm text-[#3D2314] focus:outline-none cursor-pointer flex-1 sm:flex-none"
              >
                <option value="Todas">Todas las sucursales</option>
                <option value="Naranjo">Naranjo</option>
                <option value="Sarchí">Sarchí</option>
                <option value="Grecia">Grecia</option>
              </select>
            </div>
          </div>

          {loadingList ? (
            <div className="text-center py-12 text-stone-500 font-bold">Cargando la lista de clientes...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12 text-stone-400 font-bold">
              No se encontraron clientes con esos filtros.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-[#F7F2EB] text-[#3D2314] uppercase text-[11px] font-black tracking-wider border-b border-[#E8DFC8]">
                  <tr>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Teléfono</th>
                    <th className="p-4">Sucursal Registro</th>
                    <th className="p-4 text-center">Tickets (Rifa Activa)</th>
                    <th className="p-4 text-right">Editar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-[#FFF8F0] transition-colors">
                      <td className="p-4 font-black text-[#3D2314]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-orange-100 text-[#C84B20] flex items-center justify-center font-black text-xs">
                            {c.nombre.charAt(0).toUpperCase()}
                          </div>
                          {c.nombre}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-stone-600">{c.telefono}</td>
                      <td className="p-4 font-bold">
                        <span className="bg-orange-50 text-[#C84B20] text-xs px-2.5 py-1 rounded-md border border-orange-200/60">
                          {c.sucursal_registro}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1.5 bg-[#FDEFE3] text-[#C84B20] font-black text-xs px-3 py-1 rounded-full border border-orange-200">
                          <Ticket className="w-3.5 h-3.5" />
                          {c.ticket_count || 0} {c.ticket_count === 1 ? 'boleto' : 'boletos'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-2 bg-stone-100 hover:bg-[#3D2314] hover:text-white rounded-xl transition-all text-stone-600 cursor-pointer"
                          title="Editar información del cliente"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: FORMULARIO REGISTRAR CLIENTE */}
      {viewMode === 'create' && (
        <div className="bg-[#FFFDF9] rounded-[24px] sm:rounded-[28px] border border-orange-200/80 p-5 sm:p-8 shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#FDEFE3] p-3 rounded-2xl text-[#C84B20] flex-shrink-0">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#3D2314] font-brand-display">
                Registrar Nuevo Cliente
              </h3>
              <p className="text-xs font-bold text-stone-500">
                Se acreditará automáticamente 1 ticket de bienvenida para la rifa activa.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateCustomer} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-stone-600 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#C84B20]" /> Nombre Completo
              </label>
              <input
                type="text"
                placeholder="Ej. María Rodríguez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 bg-[#F7F2EB] border border-[#E8DFC8] rounded-xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#C84B20]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-stone-600 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#C84B20]" /> Número de Teléfono
              </label>
              <input
                type="tel"
                placeholder="Ej. 88888888"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-3 bg-[#F7F2EB] border border-[#E8DFC8] rounded-xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#C84B20]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3D2314] hover:bg-[#8C271E] text-white font-black py-4 rounded-xl shadow-md transition-all cursor-pointer text-sm sm:text-base"
            >
              {loading ? 'Guardando...' : 'Guardar y Asignar Ticket'}
            </button>
          </form>
        </div>
      )}

      {/* MODAL EDITAR CLIENTE */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFDF9] rounded-[24px] sm:rounded-[28px] border border-orange-200 p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="text-base sm:text-lg font-black text-[#3D2314] font-brand-display flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#C84B20]" /> Editar Cliente
              </h3>
              <button
                onClick={() => setEditingCustomer(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600">Nombre</label>
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F2EB] border border-[#E8DFC8] rounded-xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#C84B20]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600">Teléfono</label>
                <input
                  type="tel"
                  value={editTelefono}
                  onChange={(e) => setEditTelefono(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F2EB] border border-[#E8DFC8] rounded-xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#C84B20]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600">Sucursal de Registro</label>
                <select
                  value={editSucursal}
                  onChange={(e) => setEditSucursal(e.target.value as Branch)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F2EB] border border-[#E8DFC8] rounded-xl text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#C84B20]"
                >
                  <option value="Naranjo">Naranjo</option>
                  <option value="Sarchí">Sarchí</option>
                  <option value="Grecia">Grecia</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3 rounded-xl transition-all cursor-pointer text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 bg-[#3D2314] hover:bg-[#8C271E] text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-sm flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" /> {savingEdit ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};