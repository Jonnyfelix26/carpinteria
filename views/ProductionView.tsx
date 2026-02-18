
import React, { useState, useEffect } from 'react';
import { Hammer, Plus, X, Trash2, Package, Save, Calendar as CalendarIcon, ClipboardList, Loader2 } from 'lucide-react';
import { Advance, Worker, TaskRate, Order } from '../types';

interface ProductionViewProps {
  advances: Advance[];
  setAdvances: (val: Advance[]) => void;
  workers: Worker[];
  rates: TaskRate[];
  orders: Order[];
}

const ProductionView: React.FC<ProductionViewProps> = ({ advances, setAdvances, workers, rates, orders }) => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    workerId: '',
    orderId: '',
    rateId: '',
    quantity: 1,
    customPrice: 0,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const selectedRate = rates.find(r => r.id === formData.rateId);
    if (selectedRate) {
      setFormData(prev => ({ ...prev, customPrice: selectedRate.unitPrice }));
    }
  }, [formData.rateId, rates]);

  const handleLogAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    const worker = workers.find(w => w.id === formData.workerId);
    const rate = rates.find(r => r.id === formData.rateId);

    if (!worker || !rate) {
      alert('Por favor selecciona trabajador y tarea.');
      return;
    }

    setIsSubmitting(true);
    const order = orders.find(o => o.id === formData.orderId.toUpperCase()) || { entity: 'General' };

    const newAdvance: Advance = {
      id: `ADV-${Date.now()}`,
      workerId: worker.name,
      rateId: rate.description,
      orderId: formData.orderId.toUpperCase() || 'S/N',
      entityName: order.entity,
      quantity: formData.quantity,
      date: formData.date,
      totalPay: formData.quantity * formData.customPrice
    };
    
    // Simular guardado web
    await new Promise(resolve => setTimeout(resolve, 500));
    setAdvances([newAdvance, ...advances]);
    
    setIsSubmitting(false);
    setShowModal(false);
    setFormData({ 
      workerId: '', 
      orderId: '',
      rateId: '', 
      quantity: 1, 
      customPrice: 0, 
      date: new Date().toISOString().split('T')[0] 
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner border border-amber-100/50">
              <Hammer size={28} />
           </div>
           <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Taller / Avances</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                Monitoreo de Planta en Tiempo Real
              </p>
           </div>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#0f172a] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-black transition-all text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl">
          <Plus size={18} className="text-amber-500" /> Nuevo Reporte de Producción
        </button>
      </header>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b tracking-widest">
            <tr>
              <th className="px-8 py-6">Fecha</th>
              <th className="px-8 py-6">Operario</th>
              <th className="px-8 py-6">Pedido</th>
              <th className="px-8 py-6">Tarea</th>
              <th className="px-8 py-6 text-center">Cant.</th>
              <th className="px-8 py-6 text-right">Pago</th>
              <th className="px-8 py-6 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {advances.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-8 py-40 text-center text-slate-300 font-bold uppercase text-xs tracking-widest opacity-30">
                   Sin actividad en taller el día de hoy
                </td>
              </tr>
            ) : advances.map(adv => (
              <tr key={adv.id} className="hover:bg-slate-50/80 transition-all group">
                <td className="px-8 py-6 font-mono text-xs text-slate-400 font-bold">{adv.date}</td>
                <td className="px-8 py-6 font-black text-slate-900 uppercase text-sm tracking-tight">{adv.workerId}</td>
                <td className="px-8 py-6">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase italic border border-slate-200">
                    {adv.orderId}
                  </span>
                </td>
                <td className="px-8 py-6 text-slate-500 font-bold uppercase text-[10px] italic">{adv.rateId}</td>
                <td className="px-8 py-6 text-center">
                   <div className="bg-[#0f172a] text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg italic shadow-lg mx-auto">
                    {adv.quantity}
                   </div>
                </td>
                <td className="px-8 py-6 text-right font-mono font-black text-emerald-600 text-xl">
                  <span className="text-xs mr-1 opacity-50 font-sans">S/</span>{adv.totalPay.toFixed(2)}
                </td>
                <td className="px-8 py-6 text-right">
                  <button onClick={() => setAdvances(advances.filter(a => a.id !== adv.id))} className="text-slate-200 hover:text-red-500 transition-colors p-2">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300 border border-white/20">
            {/* Header Modal - Exacto a la imagen */}
            <div className="p-8 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-amber-500/30">
                  <Package size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-[#0f172a] uppercase leading-none tracking-tighter italic">Ingreso de Trabajo</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 border-l-4 border-amber-500 pl-2">Personal → Tarea → Cantidad</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-slate-50 transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleLogAdvance} className="p-8 pt-0 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-[0.15em] ml-1">Trabajador Carpintería</label>
                  <select 
                    required 
                    value={formData.workerId} 
                    onChange={e=>setFormData({...formData, workerId: e.target.value})} 
                    className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl font-bold bg-slate-50 text-slate-700 outline-none focus:border-amber-500 transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Seleccionar trabajador...</option>
                    {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-[0.15em] ml-1">Id Pedido / Módulo</label>
                  <input 
                    type="text" 
                    value={formData.orderId} 
                    onChange={e=>setFormData({...formData, orderId: e.target.value})} 
                    className="w-full px-5 py-4 bg-[#334155] border-none rounded-2xl font-bold text-white uppercase placeholder-slate-500 outline-none shadow-inner text-center tracking-widest focus:ring-4 focus:ring-slate-700/50 transition-all" 
                    placeholder="PED-XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-[0.15em] ml-1">Operación / Tarea</label>
                <select 
                  required 
                  value={formData.rateId} 
                  onChange={e=>setFormData({...formData, rateId: e.target.value})} 
                  className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl font-bold bg-slate-50 text-slate-700 outline-none focus:border-amber-500 transition-all text-sm appearance-none cursor-pointer shadow-sm"
                >
                  <option value="">Seleccionar operación...</option>
                  {rates.map(r => <option key={r.id} value={r.id}>{r.description} - S/ {r.unitPrice.toFixed(2)}</option>)}
                </select>
              </div>

              <div className="bg-[#f8fafc] p-8 rounded-[2.5rem] border-2 border-slate-100 flex items-center justify-between gap-8 shadow-inner">
                <div className="flex-1">
                  <label className="block text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest text-center">Cantidad (Unid o Mod.)</label>
                  <div className="bg-[#334155] rounded-2xl overflow-hidden shadow-2xl">
                    <input 
                      type="number" 
                      min="1" 
                      required 
                      value={formData.quantity} 
                      onChange={e=>setFormData({...formData, quantity: parseInt(e.target.value)})} 
                      className="w-full px-2 py-6 bg-transparent text-white font-black text-4xl text-center outline-none"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest text-center">Ganancia Operario</label>
                  <div className="bg-white border-2 border-emerald-100 rounded-2xl py-6 text-center shadow-xl shadow-emerald-500/10">
                    <p className="text-3xl font-black text-emerald-500 italic tracking-tighter">
                      <span className="text-xs mr-1 opacity-50 font-sans not-italic">S/</span>
                      {(formData.quantity * formData.customPrice).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center px-2">
                 <input 
                  type="date" 
                  value={formData.date} 
                  onChange={e=>setFormData({...formData, date: e.target.value})} 
                  className="text-[11px] font-black text-slate-400 uppercase outline-none bg-slate-100 px-4 py-2 rounded-full cursor-pointer hover:bg-slate-200 transition-colors border-2 border-white shadow-sm"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#0f172a] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-900/40 flex items-center justify-center gap-4 text-xs disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={24} className="animate-spin text-amber-500" /> : <Save size={24} className="text-amber-500" />}
                Registrar en Sistema Cloud
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionView;
