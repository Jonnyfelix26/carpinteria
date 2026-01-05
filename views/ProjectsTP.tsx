
import React, { useState, useMemo } from 'react';
import { Home, Search, Filter, Plus, FileText, MapPin, X, Save, Trash2, Building2 } from 'lucide-react';
import { ProjectTP } from '../types';

interface ProjectsTPProps {
  projects: ProjectTP[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectTP[]>>;
  searchTerm: string;
}

const ProjectsTP: React.FC<ProjectsTPProps> = ({ projects, setProjects, searchTerm }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    entityName: '',
    location: '',
    totalViviendas: 1,
    doorsPerVivienda: 4,
    stage: 'Fabricación de Marcos'
  });

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

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
    setFormData({
      entityName: '',
      location: '',
      totalViviendas: 1,
      doorsPerVivienda: 4,
      stage: 'Fabricación de Marcos'
    });
  };

  const deleteProject = (id: string) => {
    if (confirm('¿Eliminar este proyecto de Techo Propio?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
            <Home className="text-amber-600" />
            Proyectos Techo Propio
          </h2>
          <p className="text-slate-500 font-medium">Gestión de contratos con Entidades Técnicas</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black hover:bg-black flex items-center gap-2 shadow-xl shadow-slate-900/20 transition-all uppercase tracking-widest text-xs"
        >
          <Plus size={18} />
          Nuevo Proyecto TP
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="bg-white p-20 rounded-[2rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
            <Building2 size={64} className="text-slate-100 mb-4" />
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No hay proyectos registrados hoy.</p>
          </div>
        ) : filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row transition-all hover:border-amber-400">
            <div className="md:w-1/4 bg-slate-50 p-8 flex flex-col justify-between border-r border-slate-100">
              <div>
                <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full mb-3 inline-block uppercase tracking-widest">ID: {project.id}</span>
                <h3 className="text-xl font-black text-slate-900 leading-tight uppercase tracking-tighter">{project.entityName}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3 font-bold uppercase">
                  <MapPin size={14} className="text-amber-500" />
                  {project.location}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Meta del Contrato</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{(project.totalViviendas * project.doorsPerVivienda).toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase italic mt-1">Puertas en {project.totalViviendas} viviendas</p>
              </div>
            </div>

            <div className="flex-1 p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estado de Obra:</p>
                  <p className="text-xl font-black text-blue-600 uppercase tracking-tight">{project.stage}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avance Consolidado:</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">{project.progress}%</p>
                </div>
              </div>

              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mb-8 border border-slate-200">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-1000 shadow-inner" 
                  style={{ width: `${project.progress}%` }} 
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fabricadas</p>
                  <p className="text-lg font-black text-slate-800">0</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Instaladas</p>
                  <p className="text-lg font-black text-slate-800">0</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Valorizado</p>
                  <p className="text-lg font-black text-emerald-700">S/ 0.00</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-center">
                   <button onClick={() => deleteProject(project.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                   </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all text-xs">
                  Detalle Técnico por Vivienda
                </button>
                <button className="px-6 py-3.5 border-2 border-slate-100 rounded-2xl text-slate-500 font-black uppercase tracking-widest hover:bg-slate-50 transition-all text-xs flex items-center gap-2">
                  <FileText size={18} />
                  Reporte TP
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                    <Building2 size={24} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">REGISTRO DE CONTRATO TP</h3>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Nuevo proyecto bajo modalidad Techo Propio</p>
                 </div>
              </div>
              <button onClick={() => setShowModal(false)} className="bg-white p-3 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddProject} className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Nombre de la Entidad Técnica (Constructora)</label>
                  <input 
                    required 
                    autoFocus
                    value={formData.entityName} 
                    onChange={e=>setFormData({...formData, entityName: e.target.value})} 
                    className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-amber-500 font-black uppercase text-slate-800" 
                    placeholder="Ej: CONSTRUCTORA NORTE SAC"/>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Ubicación del Proyecto (Departamento - Ciudad)</label>
                  <input 
                    required 
                    value={formData.location} 
                    onChange={e=>setFormData({...formData, location: e.target.value})} 
                    className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-amber-500 font-black uppercase text-slate-800" 
                    placeholder="Ej: PIURA - CASTILLA"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Nº Viviendas</label>
                  <input 
                    type="number" 
                    min="1"
                    required 
                    value={formData.totalViviendas} 
                    onChange={e=>setFormData({...formData, totalViviendas: parseInt(e.target.value)})} 
                    className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl outline-none focus:border-amber-500 font-black text-xl"/>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Puertas / Vivienda</label>
                  <select 
                    value={formData.doorsPerVivienda} 
                    onChange={e=>setFormData({...formData, doorsPerVivienda: parseInt(e.target.value)})} 
                    className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl outline-none bg-white font-black text-xl"
                  >
                    <option value={3}>3 Puertas</option>
                    <option value={4}>4 Puertas</option>
                    <option value={5}>5 Puertas</option>
                    <option value={6}>6 Puertas</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl flex items-center justify-between shadow-xl">
                 <div>
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Total Puertas Contratadas</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{(formData.totalViviendas * formData.doorsPerVivienda).toLocaleString()} Unid.</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] text-slate-400 font-bold uppercase italic leading-none">Etapa Actual:</p>
                    <p className="text-sm font-black text-blue-400 mt-1 uppercase">Inicio de Proyecto</p>
                 </div>
              </div>

              <button type="submit" className="w-full bg-[#0f172a] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-900/30 flex items-center justify-center gap-3 text-xs">
                <Save size={20} /> Registrar Proyecto en Sistema
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsTP;
