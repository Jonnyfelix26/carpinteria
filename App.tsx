
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import ProjectsTP from './views/ProjectsTP';
import ProductionView from './views/ProductionView';
import InventoryView from './views/InventoryView';
import UsersView from './views/UsersView';
import RatesView from './views/RatesView';
import PayrollView from './views/PayrollView';
import OrdersView from './views/OrdersView';
import InstallationsView from './views/InstallationsView';
import { Search, User, ShieldCheck, CloudCheck, Loader2 } from 'lucide-react';
import { Worker, TaskRate, Advance, Material, ProjectTP } from './types';
import { webApi } from './services/apiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Estados de Datos
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [rates, setRates] = useState<TaskRate[]>([]);
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [projects, setProjects] = useState<ProjectTP[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // Inicialización asíncrona (Simulando carga web)
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      const [w, r, a, m, p, o] = await Promise.all([
        webApi.fetchData('workers'),
        webApi.fetchData('rates'),
        webApi.fetchData('advances'),
        webApi.fetchData('materials'),
        webApi.fetchData('projects'),
        webApi.fetchData('orders')
      ]);
      setWorkers(w);
      setRates(r);
      setAdvances(a);
      setMaterials(m);
      setProjects(p);
      setOrders(o);
      setIsLoading(false);
      webApi.logActivity('Admin', 'Acceso al sistema cloud');
    };
    loadAllData();
  }, []);

  // Función de guardado centralizada con feedback visual de red
  const syncToCloud = useCallback(async (key: string, data: any) => {
    setIsSyncing(true);
    await webApi.saveData(key, data);
    setIsSyncing(false);
  }, []);

  // Wrappers para actualizar y sincronizar
  const handleUpdateWorkers = (val: Worker[]) => { setWorkers(val); syncToCloud('workers', val); };
  const handleUpdateRates = (val: TaskRate[]) => { setRates(val); syncToCloud('rates', val); };
  const handleUpdateAdvances = (val: Advance[]) => { setAdvances(val); syncToCloud('advances', val); };
  const handleUpdateMaterials = (val: Material[]) => { setMaterials(val); syncToCloud('materials', val); };
  const handleUpdateProjects = (val: ProjectTP[]) => { setProjects(val); syncToCloud('projects', val); };
  const handleUpdateOrders = (val: any[]) => { setOrders(val); syncToCloud('orders', val); };

  const renderView = () => {
    if (isLoading) return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-black uppercase tracking-[0.2em] text-xs">Cargando base de datos cloud...</p>
      </div>
    );

    switch (activeView) {
      case 'dashboard': return <Dashboard advances={advances} />;
      case 'projects': return <ProjectsTP projects={projects} setProjects={handleUpdateProjects} searchTerm={searchTerm} advances={advances} />;
      case 'orders': return <OrdersView searchTerm={searchTerm} orders={orders} setOrders={handleUpdateOrders} advances={advances} />;
      case 'inventory': return <InventoryView searchTerm={searchTerm} materials={materials} setMaterials={handleUpdateMaterials} />;
      case 'users': return <UsersView workers={workers} setWorkers={handleUpdateWorkers} />;
      case 'rates': return <RatesView rates={rates} setRates={handleUpdateRates} />;
      case 'production': return <ProductionView advances={advances} setAdvances={handleUpdateAdvances} workers={workers} rates={rates} orders={orders} />;
      case 'payroll': return <PayrollView advances={advances} workers={workers} />;
      case 'installations': return <InstallationsView advances={advances} />;
      default: return <Dashboard advances={advances} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar activeView={activeView} onViewChange={(view) => { setActiveView(view); setSearchTerm(''); }} />
      
      <main className="flex-1 ml-64 p-8 min-h-screen">
        {/* Header Superior - Cloud Edition */}
        <div className="flex justify-between items-center mb-10 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-8 z-40">
          <div className="flex items-center gap-6">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Buscar recursos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2 border-l pl-6 border-slate-100">
               {isSyncing ? (
                 <div className="flex items-center gap-2 text-amber-600">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando...</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-2 text-emerald-600">
                    <CloudCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Servidor En Línea</span>
                 </div>
               )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-xs font-black text-slate-900 leading-none uppercase tracking-tight italic">CarpinERP Cloud</p>
              <div className="flex items-center gap-1 mt-1 justify-end text-amber-600">
                 <ShieldCheck size={12} />
                 <p className="text-[9px] font-black uppercase tracking-widest">Admin Global</p>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#0f172a] flex items-center justify-center text-amber-500 border-2 border-white shadow-lg">
               <User size={22} />
            </div>
          </div>
        </div>

        {/* Contenido Dinámico */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
