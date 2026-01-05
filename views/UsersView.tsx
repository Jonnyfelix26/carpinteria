
import React, { useState } from 'react';
import { Users, UserPlus, Shield, Mail, Phone, X, Save, Trash2 } from 'lucide-react';
import { Worker, WorkerType } from '../types';

interface UsersViewProps {
  workers: Worker[];
  setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
}

const UsersView: React.FC<UsersViewProps> = ({ workers, setWorkers }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Worker>>({ name: '', type: WorkerType.CARPENTER, specialty: '', status: 'Activo' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newWorker: Worker = {
      ...formData as any,
      id: `WRK-${Date.now()}`
    };
    setWorkers([newWorker, ...workers]);
    setShowModal(false);
    setFormData({ name: '', type: WorkerType.CARPENTER, specialty: '', status: 'Activo' });
  };

  const deleteWorker = (id: string) => {
    if(confirm('¿Eliminar este trabajador? Los registros de avance no se borrarán pero no podrás asignarle nuevos trabajos.')) {
      setWorkers(workers.filter(w => w.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-amber-600" />
            Personal del Taller
          </h2>
          <p className="text-slate-500">Gestión de operarios para asignación de tareas y pagos</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-amber-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-amber-700 flex items-center gap-2 shadow-lg shadow-amber-600/20">
          <UserPlus size={18} /> Registrar Trabajador
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
            <Users size={64} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Registra a tu personal para iniciar el taller</p>
          </div>
        ) : workers.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all">
            <div className={`absolute top-0 right-0 w-1.5 h-full ${user.status === 'Activo' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-amber-500 font-black text-2xl border-4 border-white shadow-lg">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-slate-900 leading-tight uppercase tracking-tighter">{user.name}</h3>
                <div className="flex items-center gap-1 text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">
                  <Shield size={10} />
                  {user.type}
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Especialidad</div>
              <p className="text-sm font-bold text-slate-700">{user.specialty || 'General'}</p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors">
                Ver Avances
              </button>
              <button onClick={() => deleteWorker(user.id)} className="px-4 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-200 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in duration-200">
            <div className="p-8 border-b flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Nuevo Trabajador</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Nombre Completo</label>
                <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-amber-500 font-bold uppercase"/>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Tipo de Rol</label>
                <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value as any})} className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none bg-white font-bold">
                  <option value={WorkerType.CARPENTER}>Carpintero</option>
                  <option value={WorkerType.PAINTER}>Pintor</option>
                  <option value={WorkerType.INSTALLER}>Instalador</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Especialidad</label>
                <input value={formData.specialty} onChange={e=>setFormData({...formData, specialty: e.target.value})} className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl outline-none focus:border-amber-500 font-bold" placeholder="Ej: Puertas Macizas, Lijado, etc."/>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/30">
                Guardar Personal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersView;
