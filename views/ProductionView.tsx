
import React, { useState, useEffect } from 'react';
import { Hammer, Plus, X, Save, Trash2, CreditCard, Package, SaveAll } from 'lucide-react';
import { Advance, Worker, TaskRate } from '../types';

interface ProductionViewProps {
  advances: Advance[];
  setAdvances: React.Dispatch<React.SetStateAction<Advance[]>>;
  workers: Worker[];
  rates: TaskRate[];
  orders: any[];
}

const ProductionView: React.FC<ProductionViewProps> = ({ advances, setAdvances, workers, rates, orders }) => {
  const [showModal, setShowModal] = useState(false);
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

  const handleLogAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.workerId || !formData.rateId || !formData.orderId) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    // Buscamos la entidad automáticamente desde los pedidos existentes
    const linkedOrder = orders.find(o => o.id.toUpperCase() === formData.orderId.toUpperCase());
    const entityToSave = linkedOrder ? linkedOrder.entity : 'GENERAL';

    const worker = workers.find(w => w.id === formData.workerId);
    const rate = rates.find(r => r.id === formData.rateId);

    const newAdvance: Advance = {
      id: `ADV-${Date.now()}`,
      workerId: worker?.name || 'Desconocido',
      orderId: formData.orderId.toUpperCase(),
      rateId: rate?.description || 'Especial',
      entityName: entityToSave,
      quantity: formData.quantity,
      date: formData.date,
      totalPay: formData.quantity * formData.customPrice
    };
    
    setAdvances([newAdvance, ...advances]);
    setShowModal(false);
    setFormData({ workerId: '', orderId: '', rateId: '', quantity: 1, customPrice: 0, date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
            <Hammer className="text-amber-600" />
            Taller / Avances
          </h2>
          <p className="text-slate-500 font-medium">Control de producción diaria del personal</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black hover:bg-black flex items-center gap-2 shadow-xl shadow-slate-900/20 transition-all uppercase tracking-widest text-xs">
          <Plus size={18} /> Registrar Avance
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b tracking-widest">
            <tr>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Responsable</th>
              <th className="px-6 py-4">ID Módulo</th>
              <th className="px-6 py-4">Operación</th>
              <th className="px-6 py-4 text-center">Cant.</th>
              <th className="px-6 py-4">Pago</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {advances.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-32 text-center text-slate-200 font-black uppercase tracking-widest text-xs">Sin registros hoy</td>
              </tr>
            ) : advances.map(adv => (
              <tr key={adv.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{adv.date}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{adv.workerId}</td>
                <td className="px-6 py-4 font-mono font-bold text-amber-700">{adv.orderId}</td>
                <td className="px-6 py-4 text-slate-600 font-medium">{adv.rateId}</td>
                <td className="px-6 py-4 text-center font-black text-slate-900 text-lg">{adv.quantity}</td>
                <td className="px-6 py-4 font-mono font-bold text-emerald-600">S/ {adv.totalPay.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setAdvances(advances.filter(a => a.id !== adv.id))} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                    <Package size={20} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">INGRESO DE TRABAJO</h3>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Personal → Tarea → Cantidad</p>
                 </div>
              </div>
              <button onClick={() => setShowModal(false)} className="bg-white p-2.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleLogAdvance} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Trabajador Carpintería</label>
                  <select 
                    required 
                    value={formData.workerId} 
                    onChange={e=>setFormData({...formData, workerId: e.target.value})} 
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl outline-none focus:border-amber-500 font-bold bg-white text-slate-800"
                  >
                    <option value="">Seleccionar trabajador...</option>
                    {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">ID Pedido / Módulo</label>
                  <input 
                    required 
                    value={formData.orderId} 
                    onChange={e=>setFormData({...formData, orderId: e.target.value})} 
                    className="w-full px-4 py-3.5 bg-slate-700 text-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 font-black uppercase placeholder:text-slate-400" 
                    placeholder="PED-XXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Operación / Tarea</label>
                  <select 
                    required 
                    value={formData.rateId} 
                    onChange={e=>setFormData({...formData, rateId: e.target.value})} 
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl outline-none focus:border-amber-500 font-bold bg-white"
                  >
                    <option value="">Seleccionar operación...</option>
                    {rates.map(r => <option key={r.id} value={r.id}>{r.description} (S/ {r.unitPrice})</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-[#f8fafc] p-6 rounded-[1.5rem] border border-slate-100 flex items-center justify-between gap-6">
                 <div className="flex-1">
                   <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Cantidad (Unid o Mod.)</label>
                   <input 
                      type="number" 
                      min="1" 
                      required 
                      value={formData.quantity} 
                      onChange={e=>setFormData({...formData, quantity: parseInt(e.target.value)})} 
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-xl font-black text-2xl text-center outline-none focus:ring-2 focus:ring-amber-500"
                    />
                 </div>
                 <div className="flex-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Ganancia Operario</p>
                   <div className="h-[56px] flex items-center justify-center bg-white border border-emerald-200 rounded-xl font-mono font-black text-emerald-600 text-xl">
                      S/ {(formData.quantity * formData.customPrice).toFixed(2)}
                   </div>
                 </div>
              </div>

              <button type="submit" className="w-full bg-[#0f172a] text-white py-4.5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/30 flex items-center justify-center gap-4 text-xs">
                <SaveAll size={20} /> Registrar en Sistema
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionView;
