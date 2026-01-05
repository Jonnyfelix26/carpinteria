
import React, { useState, useMemo } from 'react';
import { Package, Plus, ArrowUpRight, ArrowDownLeft, AlertTriangle, X, Save, Trash2 } from 'lucide-react';
import { Material } from '../types';

interface InventoryViewProps {
  searchTerm: string;
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
}

const InventoryView: React.FC<InventoryViewProps> = ({ searchTerm, materials, setMaterials }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Madera', unit: 'pies', minStock: 10, stock: 0 });

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [materials, searchTerm]);

  const updateStock = (id: string, amount: number) => {
    setMaterials(prev => prev.map(m => {
      if (m.id === id) {
        const newStock = Math.max(0, m.stock + amount);
        return { ...m, stock: newStock };
      }
      return m;
    }));
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const newMat: Material = {
      ...formData as any,
      id: `MAT-${Math.floor(Math.random() * 900) + 100}`,
    };
    setMaterials([...materials, newMat]);
    setShowModal(false);
    setFormData({ name: '', category: 'Madera', unit: 'pies', minStock: 10, stock: 0 });
  };

  const deleteMaterial = (id: string) => {
    if(confirm('¿Eliminar material permanentemente?')) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="text-amber-600" />
            Almacén e Inventario
          </h2>
          <p className="text-slate-500">Gestión persistente de insumos y materiales</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={18} />
          Registrar Material
        </button>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {filteredMaterials.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400">
            <Package size={48} className="mb-4 opacity-20" />
            <p className="font-bold uppercase text-xs tracking-widest">No hay materiales registrados.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
              <tr>
                <th className="px-6 py-4">Insumo</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Ajuste de Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaterials.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{item.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold">
                    {item.stock} <span className="text-slate-400 font-normal">{item.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    {item.stock <= item.minStock ? (
                      <span className="flex items-center gap-1 text-red-600 font-bold">
                        <AlertTriangle size={14} /> Crítico
                      </span>
                    ) : <span className="text-emerald-600 font-bold">Suficiente</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => updateStock(item.id, 1)}
                        className="bg-emerald-50 text-emerald-700 p-2 rounded-lg hover:bg-emerald-100 transition-colors"
                        title="Sumar stock"
                      >
                        <ArrowDownLeft size={16} />
                      </button>
                      <button 
                        onClick={() => updateStock(item.id, -1)}
                        className="bg-red-50 text-red-700 p-2 rounded-lg hover:bg-red-100 transition-colors"
                        title="Restar stock"
                      >
                        <ArrowUpRight size={16} />
                      </button>
                      <button 
                        onClick={() => deleteMaterial(item.id)}
                        className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Nuevo Material</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddMaterial} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Nombre del Material</label>
                <input 
                  required 
                  autoFocus
                  value={formData.name} 
                  onChange={e=>setFormData({...formData, name: e.target.value})} 
                  className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-amber-500 font-bold uppercase" 
                  placeholder="Madera Tornillo..."/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Stock Inicial</label>
                  <input 
                    type="number" 
                    value={formData.stock} 
                    onChange={e=>setFormData({...formData, stock: parseInt(e.target.value)})} 
                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-amber-500 font-bold"/>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Unidad</label>
                  <input 
                    value={formData.unit} 
                    onChange={e=>setFormData({...formData, unit: e.target.value})} 
                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-amber-500 font-bold" 
                    placeholder="pies, unid, gal..."/>
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/30 flex items-center justify-center gap-2">
                  <Save size={18} /> Guardar en Almacén
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
