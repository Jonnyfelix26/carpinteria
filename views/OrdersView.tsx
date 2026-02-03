
import React, { useState, useMemo } from 'react';
import { ClipboardList, Plus, Building2, Trash2, X, Package } from 'lucide-react';
import { ProjectStatus, Advance } from '../types';

interface OrdersViewProps {
  searchTerm: string;
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  advances: Advance[];
}

const OrdersView: React.FC<OrdersViewProps> = ({ searchTerm, orders, setOrders, advances }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ client: '', entity: '', moduleQty: 1, priority: 'Media', status: ProjectStatus.QUOTED });

  const processedOrders = useMemo(() => {
    return orders.map(order => {
      const orderAdvances = advances.filter(a => a.orderId.toUpperCase() === order.id.toUpperCase());
      const finishedCount = orderAdvances.reduce((sum, a) => sum + a.quantity, 0);
      const totalRequired = order.moduleQty * 5;
      const progress = totalRequired > 0 ? Math.round((finishedCount / totalRequired) * 100) : 0;
      
      return { ...order, finishedCount, totalRequired, progress };
    });
  }, [orders, advances]);

  const filteredOrders = processedOrders.filter(o => 
    o.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.entity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = {
      ...formData,
      id: `PED-${Math.floor(Math.random() * 9000) + 1000}`,
      createdAt: new Date().toLocaleDateString()
    };
    setOrders([newOrder, ...orders]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter leading-none">
            <ClipboardList className="text-amber-600" size={32} />
            Pedidos de Obra
          </h2>
          <p className="text-slate-500 font-bold italic text-xs uppercase tracking-widest mt-1">Vinculados a Facturación por Entidad</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black hover:bg-black flex items-center gap-2 shadow-xl text-xs uppercase tracking-widest transition-all">
          <Plus size={20} /> Crear Pedido
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b tracking-widest">
            <tr>
              <th className="px-8 py-5">ID / Cliente</th>
              <th className="px-8 py-5">Entidad Técnica</th>
              <th className="px-8 py-5 text-center">Cumplimiento</th>
              <th className="px-8 py-5 text-center">Módulos</th>
              <th className="px-8 py-5 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredOrders.map((order: any) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-all group">
                <td className="px-8 py-6">
                  <div className="font-mono font-black text-amber-700 text-lg leading-none mb-1">{order.id}</div>
                  <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{order.client}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100 w-fit">
                    <Building2 size={14} />
                    <span className="font-black uppercase text-[10px] tracking-tight">{order.entity}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="w-40 mx-auto">
                      <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                         <span className="text-slate-400">{order.progress}%</span>
                         <span className="text-slate-900">{order.finishedCount}/{order.totalRequired} ptas</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                         <div className={`h-full ${order.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'} transition-all`} style={{ width: `${order.progress}%` }} />
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6 text-center">
                   <div className="w-12 h-12 bg-slate-900 text-amber-500 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg mx-auto">
                      {order.moduleQty}
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                   <button onClick={() => setOrders(prev => prev.filter(o => o.id !== order.id))} className="text-slate-200 hover:text-red-500 p-3 transition-colors">
                      <Trash2 size={20} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">NUEVO PEDIDO DE OBRA</h3>
              <button onClick={() => setShowModal(false)} className="bg-white p-2 rounded-full border border-slate-200 text-slate-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Inmobiliaria / Cliente</label>
                <input required value={formData.client} onChange={e=>setFormData({...formData, client: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold uppercase" placeholder="Ej: GRUPO IMAGINA"/>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Vincular a Entidad Técnica (TP)</label>
                <input required value={formData.entity} onChange={e=>setFormData({...formData, entity: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold uppercase" placeholder="Ej: ENTIDAD LURIN"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Nº Módulos (Viviendas)</label>
                  <input type="number" min="1" value={formData.moduleQty} onChange={e=>setFormData({...formData, moduleQty: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-black"/>
                </div>
                <div className="bg-slate-900 rounded-2xl flex flex-col items-center justify-center p-2">
                   <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Meta Producción</p>
                   <p className="text-2xl font-black text-white italic">{formData.moduleQty * 5} PTAS</p>
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all text-xs shadow-2xl">Crear Pedido y Vincular Facturación</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
