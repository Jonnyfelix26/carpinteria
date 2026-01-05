
import React, { useState } from 'react';
import { Target, Plus, Save, Trash2, X } from 'lucide-react';
import { TaskRate } from '../types';

interface RatesViewProps {
  rates: TaskRate[];
  setRates: React.Dispatch<React.SetStateAction<TaskRate[]>>;
}

const RatesView: React.FC<RatesViewProps> = ({ rates, setRates }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<TaskRate>>({ description: '', category: 'Fabricación', unitPrice: 0 });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newRate: TaskRate = {
      ...formData as any,
      id: `RATE-${Date.now()}`
    };
    setRates([newRate, ...rates]);
    setShowModal(false);
    setFormData({ description: '', category: 'Fabricación', unitPrice: 0 });
  };

  const deleteRate = (id: string) => {
    if(confirm('¿Eliminar este precio? Los avances registrados con este precio no se verán afectados.')) {
      setRates(rates.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="text-amber-600" />
            Tabla de Precios (Destajo)
          </h2>
          <p className="text-slate-500">Configura cuánto se paga por cada operación terminada</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 flex items-center gap-2 shadow-sm transition-all">
          <Plus size={18} /> Nueva Tarea / Precio
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b tracking-widest">
            <tr>
              <th className="px-6 py-4">Descripción de la Tarea</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Pago Unitario</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {rates.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No hay precios configurados. Agrega uno para empezar.</td>
              </tr>
            ) : rates.map(rate => (
              <tr key={rate.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{rate.description}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter">
                    {rate.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-emerald-600">S/ {rate.unitPrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => deleteRate(rate.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Nueva Tarea</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-1">Nombre de la Operación</label>
                <input 
                  required 
                  autoFocus
                  value={formData.description} 
                  onChange={e=>setFormData({...formData, description: e.target.value})} 
                  className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-amber-500 transition-all font-medium" 
                  placeholder="Ej: Pintado de Puerta Contraplacada"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-1">Categoría</label>
                  <select 
                    value={formData.category} 
                    onChange={e=>setFormData({...formData, category: e.target.value as any})} 
                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none bg-white font-medium"
                  >
                    <option value="Fabricación">Fabricación</option>
                    <option value="Pintura">Pintura</option>
                    <option value="Instalación">Instalación</option>
                    <option value="Especial">Especial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-1">Precio Unit. (S/)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={formData.unitPrice} 
                    onChange={e=>setFormData({...formData, unitPrice: parseFloat(e.target.value)})} 
                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20">
                Guardar Precio
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatesView;
