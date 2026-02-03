
import React, { useMemo } from 'react';
import { Truck, Building2, TrendingUp, Package, Calendar, DollarSign, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Advance } from '../types';

interface InstallationsViewProps {
  advances: Advance[];
}

const InstallationsView: React.FC<InstallationsViewProps> = ({ advances }) => {
  const MODULE_BILLING_RATE = 1350;

  const statsByEntity = useMemo(() => {
    const map = new Map();
    advances.filter(a => a.rateId.toLowerCase().includes('instala')).forEach(adv => {
      if (!map.has(adv.entityName)) {
        map.set(adv.entityName, { 
          name: adv.entityName, 
          modules: 0, 
          laborCost: 0, 
          revenue: 0,
          advances: [] 
        });
      }
      const data = map.get(adv.entityName);
      data.modules += adv.quantity;
      data.laborCost += adv.totalPay;
      data.revenue += adv.quantity * MODULE_BILLING_RATE;
      data.advances.push(adv);
    });
    return Array.from(map.values()).sort((a,b) => b.revenue - a.revenue);
  }, [advances]);

  const totalBilling = statsByEntity.reduce((sum, e) => sum + e.revenue, 0);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 shadow-xl shadow-slate-200 border-2 border-white">
              <Truck size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Liquidación Comercial</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Cuentas por Cobrar a Entidades Técnicas</p>
           </div>
        </div>
        <div className="bg-emerald-600 text-white px-8 py-4 rounded-3xl shadow-xl shadow-emerald-100 text-right">
           <p className="text-[10px] font-black uppercase opacity-70 tracking-widest mb-1">Monto Total Facturable</p>
           <p className="text-3xl font-black italic tracking-tighter">S/ {totalBilling.toLocaleString()}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {statsByEntity.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
             <Package size={64} className="mx-auto text-slate-100 mb-4" />
             <p className="text-slate-300 font-black uppercase tracking-widest">No hay módulos instalados registrados</p>
          </div>
        ) : (
          statsByEntity.map((entity) => (
            <div key={entity.name} className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col xl:flex-row group hover:border-emerald-400 transition-all">
              {/* Resumen Entidad */}
              <div className="xl:w-80 p-8 bg-slate-50 border-r border-slate-100 flex flex-col justify-between">
                <div>
                   <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-4">
                      <CheckCircle2 size={14} /> Entidad Verificada
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{entity.name}</h3>
                </div>
                <div className="mt-8 space-y-4">
                   <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Volumen Entregado</p>
                      <p className="text-3xl font-black text-slate-900">{entity.modules} <span className="text-xs text-slate-400 font-bold uppercase tracking-widest ml-1">Mod</span></p>
                   </div>
                </div>
              </div>

              {/* Matriz de Cobro */}
              <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Desglose de Facturación</h4>
                   <table className="w-full text-left text-[11px]">
                      <thead className="text-slate-400 font-black uppercase">
                        <tr>
                          <th className="py-2">Fecha</th>
                          <th className="py-2">ID Vivienda</th>
                          <th className="py-2 text-right">Tarifa</th>
                          <th className="py-2 text-right">Total S/</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {entity.advances.map((adv: any, i: number) => (
                          <tr key={i} className="group/row">
                            <td className="py-3 font-mono font-bold text-slate-400">{adv.date}</td>
                            <td className="py-3 font-black text-slate-700 uppercase italic">{adv.orderId}</td>
                            <td className="py-3 text-right font-bold text-slate-400">S/ 1,350.00</td>
                            <td className="py-3 text-right font-black text-slate-900">S/ {(adv.quantity * MODULE_BILLING_RATE).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                   <ArrowUpRight className="absolute -top-4 -right-4 text-emerald-500 opacity-10" size={120} />
                   <div>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Estado Liquidación</p>
                      <div className="space-y-4">
                         <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Cobro Bruto Entidad:</p>
                            <p className="text-3xl font-black text-white italic">S/ {entity.revenue.toLocaleString()}</p>
                         </div>
                         <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Costo Operativo (Taller):</p>
                            <p className="text-xl font-black text-red-400 italic">S/ {entity.laborCost.toLocaleString()}</p>
                         </div>
                      </div>
                   </div>
                   <div className="mt-8 pt-6 border-t border-slate-800">
                      <p className="text-[11px] font-black text-emerald-400 uppercase">Utilidad Proyectada:</p>
                      <p className="text-4xl font-black text-white tracking-tighter">S/ {(entity.revenue - entity.laborCost).toLocaleString()}</p>
                   </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InstallationsView;
