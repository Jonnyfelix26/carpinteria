
import React, { useState, useMemo } from 'react';
import { ClipboardList, Plus, Search, Edit2, Trash2, X, Save, Building2, Package, CheckCircle2 } from 'lucide-react';
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
      // Filtrar avances por ID de pedido
      const orderAdvances = advances.filter(a => a.orderId.toUpperCase() === order.id.toUpperCase());
      const finishedCount = orderAdvances.reduce((sum, a) => sum + a.quantity, 0);
      const totalRequired = order.moduleQty * 5;
      const progress = totalRequired > 0 ? Math.round((finishedCount / totalRequired) * 100) : 0;
      
      return { ...order, finishedCount, totalRequired, progress };
    });
  }, [orders, advances]);

  const filteredOrders = processedOrders.filter(o => 
    o.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
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
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter leading-none">
            <ClipboardList className="text-amber-600" />
            Pedidos de Taller
          </h2>
          <p className="text-slate-500 font-medium italic">Tracking de producción en tiempo real por ID de pedido</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black hover:bg-black flex items-center gap-2 shadow-xl text-xs uppercase tracking-widest">
          <Plus size={20} /> Nuevo Pedido
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b tracking-widest">
            <tr>
              <th className="px-6 py-4">ID Pedido</th>
              <th className="px-6 py-4">Cliente / Entidad</th>
              <th className="px-6 py-4 text-center">Progreso</th>
              <th className="px-6 py-4 text-center">Cant. Puertas</th>
              <th className="px-6 py-4">Estado Actual</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredOrders.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-20 text-center font-bold text-slate-300 uppercase text-xs tracking-widest">Sin pedidos activos</td></tr>
            ) : filteredOrders.map((order: any) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono font-black text-amber-700 text-lg">{order.id}</td>
                <td className="px-6 py-4">
                  <div className="font-black text-slate-900 uppercase tracking-tight">{order.client}</div>
                  <div className="text-[9px] text-slate-400 font-black uppercase flex items-center gap-1"><Building2 size={10}/> {order.entity}</div>
                </td>
                <td className="px-6 py-4">
                   <div className="w-32 mx-auto">
                      <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                         <span className="text-slate-400">{order.progress}%</span>
                         <span className="text-slate-900">{order.finishedCount}/{order.totalRequired}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                         <div className={`h-full ${order.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'} transition-all`} style={{ width: `${order.progress}%` }} />
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-slate-900 text-amber-500 px-3 py-1 rounded-full font-black text-xs uppercase tracking-tighter italic">
                    {order.totalRequired} unid.
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${order.progress === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.progress === 100 ? 'Completado' : order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button onClick={() => setOrders(prev => prev.filter(o => o.id !== order.id))} className="text-slate-200 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">REGISTRAR NUEVO PEDIDO</h3>
              <button onClick={() => setShowModal(false)} className="bg-white p-2 rounded-full border border-slate-200 text-slate-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Cliente / Inmobiliaria</label>
                <input required value={formData.client} onChange={e=>setFormData({...formData, client: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold uppercase" placeholder="Ej: GRUPO IMAGINA"/>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Entidad Técnica (TP)</label>
                <input required value={formData.entity} onChange={e=>setFormData({...formData, entity: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold uppercase" placeholder="Ej: ENTIDAD SUR"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Nº Módulos (1 mod = 5 ptas)</label>
                  <input type="number" min="1" value={formData.moduleQty} onChange={e=>setFormData({...formData, moduleQty: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-black"/>
                </div>
                <div className="bg-slate-900 rounded-xl flex flex-col items-center justify-center p-2">
                   <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Meta Total</p>
                   <p className="text-2xl font-black text-white">{formData.moduleQty * 5} PTAS</p>
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all text-xs">Crear Pedido de Taller</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
