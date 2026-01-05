
import React, { useState, useMemo } from 'react';
import { ClipboardList, Plus, Search, Edit2, Trash2, X, Save, Building2, Package } from 'lucide-react';
import { ProjectStatus } from '../types';

interface OrdersViewProps {
  searchTerm: string;
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
}

const OrdersView: React.FC<OrdersViewProps> = ({ searchTerm, orders, setOrders }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);

  const [formData, setFormData] = useState({
    client: '',
    entity: '', 
    moduleDesc: '',
    moduleQty: 1, // Cantidad de Módulos
    priority: 'Media',
    status: ProjectStatus.QUOTED
  });

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      setOrders(orders.map(o => o.id === editingOrder.id ? { ...formData, id: o.id } : o));
    } else {
      const newOrder = {
        ...formData,
        id: `PED-${Math.floor(Math.random() * 9000) + 1000}`,
        createdAt: new Date().toLocaleDateString()
      };
      setOrders([newOrder, ...orders]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOrder(null);
    setFormData({ client: '', entity: '', moduleDesc: '', moduleQty: 1, priority: 'Media', status: ProjectStatus.QUOTED });
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
            <ClipboardList className="text-amber-600" />
            Pedidos de Módulos
          </h2>
          <p className="text-slate-500 font-medium">1 Módulo = Instalación de 5 Puertas</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black flex items-center gap-2 shadow-xl shadow-slate-900/20 transition-all"
        >
          <Plus size={20} />
          Nuevo Pedido
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b tracking-widest">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Cliente / Constructora</th>
              <th className="px-6 py-4 text-center">Módulos Solicitados</th>
              <th className="px-6 py-4 text-center">Total Puertas</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Sin pedidos activos.</td>
              </tr>
            ) : filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-amber-700">{order.id}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{order.client}</div>
                  <div className="text-[10px] text-amber-600 font-black uppercase flex items-center gap-1">
                    <Building2 size={10} /> {order.entity}
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-black text-slate-900 text-lg">{order.moduleQty}</td>
                <td className="px-6 py-4 text-center">
                   <span className="bg-slate-100 px-2 py-1 rounded font-bold text-slate-600 text-xs">
                     {order.moduleQty * 5} puertas
                   </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-lg text-[10px] font-black bg-slate-100 text-slate-700 uppercase">
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setEditingOrder(order); setFormData(order); setShowModal(true); }} className="p-2 text-slate-300 hover:text-amber-600 transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => setOrders(orders.filter(o => o.id !== order.id))} className="p-2 text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Registrar Nuevo Pedido</h3>
              <button onClick={closeModal} className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Nombre del Cliente</label>
                  <input 
                    required
                    type="text" 
                    value={formData.client}
                    onChange={e => setFormData({...formData, client: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl focus:border-amber-500 outline-none font-bold bg-slate-50/50" 
                    placeholder="Ej: Constructora ABC"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Entidad Constructora (Techo Propio)</label>
                  <input 
                    required
                    type="text" 
                    value={formData.entity}
                    onChange={e => setFormData({...formData, entity: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl focus:border-amber-500 outline-none font-bold bg-slate-50/50" 
                    placeholder="Ej: Techo Propio Norte"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Cantidad de Módulos</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={formData.moduleQty}
                    onChange={e => setFormData({...formData, moduleQty: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none font-black text-lg bg-slate-50/50" 
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-bold italic">Total: {formData.moduleQty * 5} puertas</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Prioridad</label>
                  <select 
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none font-bold bg-slate-50/50"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-[#1e293b] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black shadow-xl shadow-slate-900/30 flex items-center justify-center gap-3 transition-all">
                  <Save size={20} />
                  Crear Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
