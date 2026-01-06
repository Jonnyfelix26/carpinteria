
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import ProjectsTP from './views/ProjectsTP';
import CostsView from './views/CostsView';
import OrdersView from './views/OrdersView';
import ProductionView from './views/ProductionView';
import InventoryView from './views/InventoryView';
import InstallationsView from './views/InstallationsView';
import UsersView from './views/UsersView';
import ReportsView from './views/ReportsView';
import RatesView from './views/RatesView';
import PayrollView from './views/PayrollView';
import { Search, Bell, User } from 'lucide-react';
import { Worker, TaskRate, Advance, Material, ProjectTP } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const [workers, setWorkers] = useState<Worker[]>(() => 
    JSON.parse(localStorage.getItem('workers') || '[]'));
  const [rates, setRates] = useState<TaskRate[]>(() => 
    JSON.parse(localStorage.getItem('rates') || '[]'));
  const [advances, setAdvances] = useState<Advance[]>(() => 
    JSON.parse(localStorage.getItem('advances') || '[]'));
  const [orders, setOrders] = useState<any[]>(() => 
    JSON.parse(localStorage.getItem('orders') || '[]'));
  const [materials, setMaterials] = useState<Material[]>(() => 
    JSON.parse(localStorage.getItem('materials') || '[]'));
  const [projects, setProjects] = useState<ProjectTP[]>(() => 
    JSON.parse(localStorage.getItem('projects') || '[]'));

  useEffect(() => { localStorage.setItem('workers', JSON.stringify(workers)); }, [workers]);
  useEffect(() => { localStorage.setItem('rates', JSON.stringify(rates)); }, [rates]);
  useEffect(() => { localStorage.setItem('advances', JSON.stringify(advances)); }, [advances]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('materials', JSON.stringify(materials)); }, [materials]);
  useEffect(() => { localStorage.setItem('projects', JSON.stringify(projects)); }, [projects]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard advances={advances} />;
      case 'projects': return (
        <ProjectsTP 
          projects={projects} 
          setProjects={setProjects} 
          searchTerm={searchTerm} 
          advances={advances}
        />
      );
      case 'costs': return <CostsView advances={advances} />;
      case 'orders': return (
        <OrdersView 
          searchTerm={searchTerm} 
          orders={orders} 
          setOrders={setOrders} 
          advances={advances}
        />
      );
      case 'production': return (
        <ProductionView 
          advances={advances} 
          setAdvances={setAdvances} 
          workers={workers} 
          rates={rates}
          orders={orders}
        />
      );
      case 'rates': return <RatesView rates={rates} setRates={setRates} />;
      case 'payroll': return <PayrollView advances={advances} workers={workers} />;
      case 'inventory': return (
        <InventoryView 
          searchTerm={searchTerm} 
          materials={materials} 
          setMaterials={setMaterials} 
        />
      );
      case 'installations': return <InstallationsView advances={advances} />;
      case 'users': return <UsersView workers={workers} setWorkers={setWorkers} />;
      case 'reports': return (
        <ReportsView 
          advances={advances} 
          projects={projects} 
          materials={materials} 
          orders={orders} 
        />
      );
      default: return <Dashboard advances={advances} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeView={activeView} onViewChange={(view) => { setActiveView(view); setSearchTerm(''); }} />
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-8 z-40">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800 leading-none">Admin Operativo</p>
              <p className="text-[10px] text-amber-600 font-black mt-1 uppercase">CarpinERP v2.0</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border-2 border-amber-500">
               <User size={20} className="text-amber-500" />
            </div>
          </div>
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
