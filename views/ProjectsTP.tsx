
import React, { useState, useMemo } from 'react';
import { Home, Search, Filter, Plus, FileText, MapPin, X, Save, Trash2, Building2 } from 'lucide-react';
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
    stage: 'Fabricación de Marcos'
  });

  const processedProjects = useMemo(() => {
    return projects.map(proj => {
      // Filtrar avances que corresponden a esta entidad técnica
      const entityAdvances = advances.filter(a => a.entityName === proj.entityName);
      const finishedDoors = entityAdvances.reduce((sum, a) => sum + a.quantity, 0);
      const metaTotal = proj.totalViviendas * proj.doorsPerVivienda;
      const calculatedProgress = metaTotal > 0 ? Math.round((finishedDoors / metaTotal) * 100) : 0;
      
      return {
        ...proj,
        progress: Math.min(calculatedProgress, 100),
        finishedDoors
      };
    });
  }, [projects, advances]);

  const filteredProjects = processedProjects.filter(p => 
    p.entityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: ProjectTP = {
      id: `TP-${Date.now().toString().slice(-4)}`,
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
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
            <Home className="text-amber-600" />
            Contratos Techo Propio
          </h2>
          <p className="text-slate-500 font-medium italic">Progreso real calculado por avances de taller</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black hover:bg-black transition-all text-xs uppercase tracking-widest shadow-xl">
          <Plus size={18} /> Nuevo Proyecto TP
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="bg-white p-20 rounded-[2rem] border-2 border-dashed border-slate-200 text-center uppercase text-xs font-black text-slate-400 tracking-widest">
            No hay proyectos registrados
          </div>
        ) : filteredProjects.map((project: any) => (
          <div key={project.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row hover:border-amber-400 transition-all">
            <div className="md:w-1/3 bg-slate-50 p-8 border-r border-slate-100">
              <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-1 rounded-full uppercase tracking-widest">ID: {project.id}</span>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mt-4 leading-none">{project.entityName}</h3>
              <p className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest"><MapPin size={12}/> {project.location}</p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                 <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Meta</p>
                    <p className="text-xl font-black text-slate-900">{project.totalViviendas * project.doorsPerVivienda}</p>
                 </div>
                 <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm text-center">
                    <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Terminadas</p>
                    <p className="text-xl font-black text-emerald-700">{project.finishedDoors}</p>
                 </div>
              </div>
            </div>

            <div className="flex-1 p-8">
              <div className="flex justify-between items-end mb-4">
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado en Obra</p>
                   <p className="text-xl font-black text-blue-600 uppercase tracking-tight">{project.stage}</p>
                 </div>
                 <p className="text-5xl font-black text-slate-900 tracking-tighter">{project.progress}%</p>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-8 border border-slate-200">
                 <div className="h-full bg-amber-500 rounded-full transition-all duration-1000 shadow-lg" style={{ width: `${project.progress}%` }} />
              </div>
              <div className="flex gap-4">
                 <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black">Detalle de Avances</button>
                 <button onClick={() => setProjects(prev => prev.filter(p => p.id !== project.id))} className="p-4 border border-slate-100 rounded-2xl text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">REGISTRAR PROYECTO TP</h3>
              <button onClick={() => setShowModal(false)} className="bg-white p-2 rounded-full border border-slate-200 text-slate-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddProject} className="p-8 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Entidad Técnica (Constructora)</label>
                <input required value={formData.entityName} onChange={e=>setFormData({...formData, entityName: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold uppercase" placeholder="Ej: Constructora Perú"/>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Ubicación</label>
                <input required value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold uppercase" placeholder="Ej: Lima, Los Olivos"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Nº Viviendas</label>
                  <input type="number" min="1" value={formData.totalViviendas} onChange={e=>setFormData({...formData, totalViviendas: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-black"/>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Puertas / Viv.</label>
                  <input type="number" min="1" value={formData.doorsPerVivienda} onChange={e=>setFormData({...formData, doorsPerVivienda: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-black"/>
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all text-xs">Guardar Proyecto</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTP;
