
import React, { useState, useMemo } from 'react';
import { Plus, MapPin, X, Building2, Layers, Coins, ClipboardCheck } from 'lucide-react';
import { ProjectTP, Advance } from '../types';

interface ProjectsTPProps {
  projects: ProjectTP[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectTP[]>>;
  searchTerm: string;
  advances: Advance[];
}

const ProjectsTP: React.FC<ProjectsTPProps> = ({ projects, setProjects, searchTerm, advances }) => {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    entityName: '',
    location: '',
    totalViviendas: 1,
    doorsPerVivienda: 4,
    stage: 'Ejecución'
  });

  const processedEntities = useMemo(() => {
    return projects.map(proj => {
      // Filtramos avances que sean específicamente de INSTALACIÓN para medir el progreso de viviendas terminadas
      const installedModules = advances
        .filter(a => a.entityName === proj.entityName && a.rateId.toLowerCase().includes('instala'))
        .reduce((sum, a) => sum + a.quantity, 0);

      const progress = proj.totalViviendas > 0 
        ? Math.min(Math.round((installedModules / proj.totalViviendas) * 100), 100) 
        : 0;
      
      return {
        ...proj,
        progress,
        installedModules
      };
    });
  }, [projects, advances]);

  const filtered = processedEntities.filter(p => 
    p.entityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEntity = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: ProjectTP = {
      id: `CON-${Date.now().toString().slice(-4)}`,
      entityName: formData.entityName,
      location: formData.location,
      totalViviendas: formData.totalViviendas,
      doorsPerVivienda: formData.doorsPerVivienda,
      progress: 0,
      stage: formData.stage
    };
    setProjects([newProject, ...projects]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center bg-white p-7 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 shadow-inner">
              <Building2 size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">Proyectos Techo Propio</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Seguimiento de contratos y avance de obra</p>
           </div>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#0f172a] text-white px-10 py-4.5 rounded-[1.5rem] font-black hover:bg-black transition-all text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3">
          <Plus size={20} className="text-blue-400" /> Nueva Entidad Técnica
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white p-32 rounded-[4rem] border-4 border-dashed border-slate-50 text-center">
             <Layers size={80} className="mx-auto text-slate-100 mb-6" />
             <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-xs">No hay contratos registrados</p>
          </div>
        ) : filtered.map((entity: any) => (
          <div key={entity.id} className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-2xl hover:border-blue-400 transition-all group">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">ID: {entity.id}</span>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mt-5 leading-tight">{entity.entityName}</h3>
                  <p className="flex items-center gap-2 text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest"><MapPin size={14} className="text-blue-500" /> {entity.location}</p>
                </div>
                <div className="bg-[#0f172a] p-4 rounded-3xl text-center shadow-xl border-2 border-white">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Viviendas</p>
                    <p className="text-3xl font-black text-white italic leading-none">{entity.totalViviendas}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                   <div className="flex justify-between items-end mb-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ClipboardCheck size={14} className="text-emerald-500" /> Avance Físico Instalado</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{entity.progress}%</p>
                   </div>
                   <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-1 shadow-inner">
                      <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 shadow-lg" style={{ width: `${entity.progress}%` }} />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4">
                   <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Módulos OK</p>
                      <p className="text-2xl font-black text-slate-900">{entity.installedModules} <span className="text-[10px] uppercase font-bold text-slate-400 ml-1">unid</span></p>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pendientes</p>
                      <p className="text-2xl font-black text-amber-600 italic">{entity.totalViviendas - entity.installedModules}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 border-b bg-slate-50 flex justify-between items-center">
              <div>
                 <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">Nueva Entidad Técnica</h3>
                 <p className="text-[10px] text-slate-400 font-black uppercase mt-2 tracking-widest">Apertura de Contrato Maestro</p>
              </div>
              <button onClick={() => setShowModal(false)} className="bg-white p-4 rounded-full border border-slate-100 text-slate-300 hover:text-red-500 transition-all"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddEntity} className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1">Constructora / ET</label>
                <input required autoFocus value={formData.entityName} onChange={e=>setFormData({...formData, entityName: e.target.value})} className="w-full px-6 py-5 border-2 border-slate-100 rounded-[1.5rem] font-bold uppercase focus:border-blue-500 outline-none transition-all bg-slate-50" placeholder="Ej: CONSTRUCTORA PACÍFICO"/>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1">Zona / Localidad</label>
                <input required value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} className="w-full px-6 py-5 border-2 border-slate-100 rounded-[1.5rem] font-bold uppercase focus:border-blue-500 outline-none transition-all bg-slate-50" placeholder="Ej: CHINCHA, ICA"/>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest ml-1">Meta Viviendas</label>
                <div className="flex items-center gap-6">
                   <input type="number" min="1" value={formData.totalViviendas} onChange={e=>setFormData({...formData, totalViviendas: parseInt(e.target.value)})} className="flex-1 px-6 py-5 border-2 border-slate-100 rounded-[1.5rem] font-black text-3xl focus:border-blue-500 outline-none bg-slate-50 text-center"/>
                   <div className="w-32 h-20 bg-blue-900 rounded-[1.5rem] flex flex-col items-center justify-center shadow-xl">
                      <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Total</p>
                      <p className="text-2xl font-black text-white italic leading-none">{formData.totalViviendas}</p>
                   </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#0f172a] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-black transition-all text-xs shadow-2xl flex items-center justify-center gap-4">
                <Building2 size={22} className="text-blue-400" /> Registrar en Cartera TP
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTP;
