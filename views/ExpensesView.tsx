
import React, { useState } from 'react';
import { Receipt, Plus, X, Save, Trash2, Building2, Tag } from 'lucide-react';
import { Expense, ProjectTP } from '../types';

interface ExpensesViewProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  projects: ProjectTP[];
}

const ExpensesView: React.FC<ExpensesViewProps> = ({ expenses, setExpenses, projects }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    category: 'Madera',
    amount: 0,
    entityName: 'General',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      ...formData as any,
      id: `EXP-${Date.now()}`
    };
    setExpenses([newExpense, ...expenses]);
    setShowModal(false);
    setFormData({ description: '', category: 'Madera', amount: 0, entityName: 'General', date: new Date().toISOString().split('T')[0] });
  };

  const deleteExpense = (id: string) => {
    if(confirm('¿Eliminar este registro de gasto?')) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
            <Receipt className="text-red-500" />
            Gastos e Inversión Real
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 italic">Registro de Madera, Insumos y Logística</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-black hover:bg-red-700 flex items-center gap-2 shadow-xl shadow-red-100 transition-all uppercase tracking-widest text-[10px]">
          <Plus size={18} /> Registrar Factura/Gasto
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b tracking-widest">
            <tr>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Descripción / Proveedor</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Entidad Vinculada</th>
              <th className="px-6 py-4 text-right">Monto (S/)</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-32 text-center text-slate-200 font-black uppercase tracking-widest text-xs">Sin gastos registrados</td>
              </tr>
            ) : expenses.sort((a,b) => b.date.localeCompare(a.date)).map(exp => (
              <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{exp.date}</td>
                <td className="px-6 py-4 font-bold text-slate-900 uppercase tracking-tight">{exp.description}</td>
                <td className="px-6 py-4">
                  <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter border border-red-100">
                    {exp.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase">
                    <Building2 size={12} /> {exp.entityName}
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono font-black text-red-600 text-lg">S/ {exp.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => deleteExpense(exp.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
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
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                    <Receipt size={20} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">REGISTRO DE GASTO REAL</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="bg-white p-2.5 rounded-full border border-slate-200 text-slate-400"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Descripción del Gasto (Ej: 100 pies de Tornillo)</label>
                <input required value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl font-bold uppercase" placeholder="Madera, Herrajes, Movilidad..."/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Categoría</label>
                  <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value as any})} className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl font-bold bg-white">
                    <option value="Madera">Madera / Triplay</option>
                    <option value="Herrajes">Herrajes (Chapas/Bisagras)</option>
                    <option value="Insumos">Insumos (Cola/Laca)</option>
                    <option value="Logística">Transporte / Flete</option>
                    <option value="Otros">Gastos Varios</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Entidad Vinculada</label>
                  <select value={formData.entityName} onChange={e=>setFormData({...formData, entityName: e.target.value})} className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl font-bold bg-white">
                    <option value="General">Gasto General Taller</option>
                    {projects.map(p => <option key={p.id} value={p.entityName}>{p.entityName}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-[1.5rem] border border-red-100 flex items-center justify-between">
                 <div className="flex-1">
                   <label className="block text-[10px] font-black text-red-400 uppercase mb-2 tracking-widest">Monto Total S/</label>
                   <input type="number" step="0.01" required value={formData.amount} onChange={e=>setFormData({...formData, amount: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-white border-2 border-red-200 rounded-xl font-black text-2xl outline-none focus:ring-2 focus:ring-red-500 text-red-600"/>
                 </div>
              </div>

              <button type="submit" className="w-full bg-red-600 text-white py-4.5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-4 text-xs">
                <Save size={20} /> Registrar Inversión
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesView;
