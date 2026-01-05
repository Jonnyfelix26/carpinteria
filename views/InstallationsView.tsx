
import React, { useMemo } from 'react';
import { Truck, MapPin, Calendar, CheckCircle, TrendingUp, Users, Building2, Package } from 'lucide-react';
import { Advance } from '../types';

interface InstallationsViewProps {
  advances: Advance[];
}

const InstallationsView: React.FC<InstallationsViewProps> = ({ advances }) => {
  // Filtramos avances que sean de tipo instalación
  const installationAdvances = useMemo(() => {
    return advances.filter(adv => 
      adv.rateId.toLowerCase().includes('instala') || 
      adv.rateId.toLowerCase().includes('obra')
    );
  }, [advances]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Módulos hoy
    const todayModules = installationAdvances
      .filter(a => a.date === today)
      .reduce((sum, a) => sum + a.quantity, 0);

    // Módulos semana (últimos 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyModules = installationAdvances
      .filter(a => new Date(a.date) >= sevenDaysAgo)
      .reduce((sum, a) => sum + a.quantity, 0);

    // Agrupación por Entidad
    const entitiesMap = new Map();
    installationAdvances.forEach(a => {
      if (!entitiesMap.has(a.entityName)) {
        entitiesMap.set(a.entityName, { name: a.entityName, total: 0, doors: 0 });
      }
      const data = entitiesMap.get(a.entityName);
      data.total += a.quantity;
      data.doors += a.quantity * 5;
    });

    return { todayModules, weeklyModules, entities: Array.from(entitiesMap.values()) };
  }, [installationAdvances]);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
          <Truck className="text-amber-600" />
          Productividad de Instalación
        </h2>
        <p className="text-slate-500 font-medium italic">Unidad de medida: 1 Módulo = 5 Puertas instaladas</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl">
          <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4">Módulos Instalados Hoy</p>
          <div className="flex items-baseline gap-2">
            <p className="text-7xl font-black text-white">{stats.todayModules}</p>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-tighter">Módulos</p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-emerald-500 font-bold text-sm">
             <CheckCircle size={16} /> Equivale a {stats.todayModules * 5} puertas
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm">
          <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4">Meta Semanal Alcaenzada</p>
          <div className="flex items-baseline gap-2">
            <p className="text-7xl font-black text-slate-900">{stats.weeklyModules}</p>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-tighter">Módulos</p>
          </div>
          <p className="text-sm text-slate-400 mt-4 font-bold uppercase italic tracking-tighter">Basado en avances registrados los últimos 7 días</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Resumen por Entidad Constructora</h3>
        
        {stats.entities.length === 0 ? (
          <div className="bg-white p-20 rounded-[2rem] border-2 border-dashed border-slate-100 text-center">
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No hay datos de instalación registrados aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.entities.map((entity, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                    <Building2 size={20} />
                  </div>
                  <span className="font-mono font-black text-2xl text-slate-900">{entity.total} mod.</span>
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-tighter truncate">{entity.name}</h4>
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Total Puertas</span>
                  <span className="text-slate-700">{entity.doors} unid.</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallationsView;
