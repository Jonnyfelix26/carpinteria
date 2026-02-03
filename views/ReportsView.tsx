
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Download, 
  Building2, 
  TrendingUp, 
  Coins,
  Calendar,
  Layers,
  Receipt,
  PieChart
} from 'lucide-react';
import { Advance, ProjectTP, Material, Expense } from '../types';

interface ReportsViewProps {
  advances: Advance[];
  projects: ProjectTP[];
  materials: Material[];
  expenses: Expense[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ advances, projects, materials, expenses }) => {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const MODULE_BILLING_RATE = 1350;

  const getWeekNumber = (dateString: string) => {
    const date = new Date(dateString);
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
  };

  const weeklyFinancials = useMemo(() => {
    const weeklyMap = new Map<string, any>();
    
    // 1. Procesar Ingresos y Mano de Obra (Instalación Real)
    advances.filter(a => a.rateId.toLowerCase().includes('instala')).forEach(adv => {
      const week = getWeekNumber(adv.date);
      const year = new Date(adv.date).getFullYear();
      const key = `Semana ${week} - ${year}`;
      
      if (!weeklyMap.has(key)) {
        weeklyMap.set(key, { 
          weekLabel: key, 
          entities: new Map<string, any>(),
          totalModules: 0,
          totalRevenue: 0,
          totalLabor: 0,
          totalRealExpenses: 0,
          totalProfit: 0
        });
      }

      const weekData = weeklyMap.get(key);
      if (!weekData.entities.has(adv.entityName)) {
        weekData.entities.set(adv.entityName, { 
          name: adv.entityName, 
          modules: 0, 
          labor: 0, 
          realExpenses: 0, 
          revenue: 0, 
          profit: 0 
        });
      }

      const entityData = weekData.entities.get(adv.entityName);
      entityData.modules += adv.quantity;
      entityData.labor += adv.totalPay;
      entityData.revenue += adv.quantity * MODULE_BILLING_RATE;
      
      weekData.totalModules += adv.quantity;
      weekData.totalRevenue += adv.quantity * MODULE_BILLING_RATE;
      weekData.totalLabor += adv.totalPay;
    });

    // 2. Procesar Gastos Reales (Madera, Triplay, etc registradas en Expenses)
    expenses.forEach(exp => {
      const week = getWeekNumber(exp.date);
      const year = new Date(exp.date).getFullYear();
      const key = `Semana ${week} - ${year}`;
      
      if (weeklyMap.has(key)) {
        const weekData = weeklyMap.get(key);
        if (weekData.entities.has(exp.entityName)) {
          const entityData = weekData.entities.get(exp.entityName);
          entityData.realExpenses += exp.amount;
        }
        weekData.totalRealExpenses += exp.amount;
      }
    });

    // 3. Cálculo de Utilidad Final
    weeklyMap.forEach(week => {
      week.entities.forEach((entity: any) => {
        entity.profit = entity.revenue - (entity.labor + entity.realExpenses);
      });
      week.totalProfit = week.totalRevenue - (week.totalLabor + week.totalRealExpenses);
    });

    return Array.from(weeklyMap.values()).sort((a, b) => b.weekLabel.localeCompare(a.weekLabel));
  }, [advances, expenses]);

  const handleExportExcelMaster = () => {
    const styles = `<style>
      table { border-collapse: collapse; font-family: 'Segoe UI', Arial; }
      th, td { border: 1px solid #000; padding: 12px; font-size: 10pt; }
      .header-main { background-color: #004b76; color: white; font-weight: bold; text-align: center; }
      .header-sub { background-color: #3399cc; color: white; text-align: center; font-weight: bold; }
      .header-money { background-color: #008080; color: white; text-align: center; font-weight: bold; }
      .money { text-align: right; mso-number-format: "\\S\\/\\ #\\,##0\\.00"; }
      .profit { font-weight: bold; background-color: #f0fdf4; color: #008000; }
      .total-row { background-color: #f2f2f2; font-weight: bold; }
    </style>`;

    let html = `<html><head><meta charset="UTF-8">${styles}</head><body><table>`;
    html += `<tr><td colspan="6" class="header-main" style="font-size:18pt">MATRIZ DE UTILIDAD REAL SEMANAL</td></tr>`;
    html += `<tr></tr>`;
    
    html += `<tr>
      <th class="header-sub">Periodo</th>
      <th class="header-sub">Entidad Técnica</th>
      <th class="header-money">Ingreso Taller (S/ 1,350)</th>
      <th class="header-money">Inv. Mano de Obra</th>
      <th class="header-money">Inv. Materiales (Gastos)</th>
      <th class="header-money">Ganancia Neta</th>
    </tr>`;

    weeklyFinancials.forEach(week => {
      Array.from(week.entities.values()).forEach((entity: any, idx: number) => {
        html += `<tr>`;
        html += `<td>${idx === 0 ? week.weekLabel : ''}</td>`;
        html += `<td>${entity.name}</td>`;
        html += `<td class="money">${entity.revenue}</td>`;
        html += `<td class="money">${entity.labor}</td>`;
        html += `<td class="money">${entity.realExpenses}</td>`;
        html += `<td class="money profit">${entity.profit}</td>`;
        html += `</tr>`;
      });
      html += `<tr class="total-row">`;
      html += `<td colspan="2" style="text-align:right">RESUMEN ${week.weekLabel}:</td>`;
      html += `<td class="money">${week.totalRevenue}</td>`;
      html += `<td class="money">${week.totalLabor}</td>`;
      html += `<td class="money">${week.totalRealExpenses}</td>`;
      html += `<td class="money" style="background:#004b76; color:white">${week.totalProfit}</td>`;
      html += `</tr>`;
      html += `<tr></tr>`;
    });

    html += `</table></body></html>`;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Reporte_Utilidades_Reales_Taller_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
  };

  const renderFinancialMaster = () => (
    <div className="p-8 space-y-10">
      <div className="flex justify-between items-end border-b-2 border-slate-100 pb-8">
        <div>
          <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">Análisis Real de Caja</h3>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Relación de Módulos (S/ 1,350) vs Inversión en Obra</p>
        </div>
        <button onClick={handleExportExcelMaster} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 hover:bg-emerald-700 transition-all">
          <Download size={20} /> Exportar Matriz Maestra Excel
        </button>
      </div>

      <div className="space-y-16">
        {weeklyFinancials.length === 0 ? (
          <div className="text-center py-20 text-slate-200">
             <PieChart size={80} className="mx-auto opacity-10 mb-4" />
             <p className="font-black uppercase tracking-widest text-xs">Aún no hay liquidaciones procesadas para esta semana</p>
          </div>
        ) : weeklyFinancials.map((week) => (
          <div key={week.weekLabel} className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden border-t-8 border-t-[#004b76]">
            <div className="bg-slate-50 px-10 py-8 border-b flex justify-between items-center">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-[#004b76] rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <Calendar size={28} />
                 </div>
                 <div>
                    <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{week.weekLabel}</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Balance Semanal de Producción</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="bg-white border-2 border-slate-100 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tight shadow-sm">
                    {week.totalModules} Módulos Instalados
                 </div>
              </div>
            </div>

            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#3399cc] text-white text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-10 py-5">Entidad Técnica (ET)</th>
                    <th className="px-10 py-5 text-right">Cobro Taller</th>
                    <th className="px-10 py-5 text-right">Inv. Planilla</th>
                    <th className="px-10 py-5 text-right">Inv. Materiales</th>
                    <th className="px-10 py-5 text-right bg-[#008080]">Utilidad Neta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from(week.entities.values()).map((entity: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-10 py-6 font-black text-slate-800 uppercase text-xs tracking-tight">
                        <div className="flex items-center gap-3">
                           <Building2 size={16} className="text-slate-300" />
                           {entity.name}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right font-mono font-bold text-slate-400 italic">S/ {entity.revenue.toLocaleString()}</td>
                      <td className="px-10 py-6 text-right font-mono font-bold text-red-400 italic">S/ {entity.labor.toLocaleString()}</td>
                      <td className="px-10 py-6 text-right font-mono font-bold text-red-400 italic">S/ {entity.realExpenses.toLocaleString()}</td>
                      <td className="px-10 py-6 text-right font-mono font-black text-emerald-600 text-2xl bg-emerald-50/50 italic">S/ {entity.profit.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-900 text-white">
                  <tr>
                    <td className="px-10 py-10 font-black uppercase text-[11px] tracking-widest italic">Consolidado Semanal</td>
                    <td className="px-10 py-10 text-right font-mono font-black text-slate-400 text-xl italic">S/ {week.totalRevenue.toLocaleString()}</td>
                    <td className="px-10 py-10 text-right font-mono font-black text-red-300 text-xl italic">S/ {week.totalLabor.toLocaleString()}</td>
                    <td className="px-10 py-10 text-right font-mono font-black text-red-300 text-xl italic">S/ {week.totalRealExpenses.toLocaleString()}</td>
                    <td className="px-10 py-10 text-right font-mono font-black text-emerald-400 text-4xl italic bg-slate-950">
                      S/ {week.totalProfit.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (activeReport) {
    return (
      <div className="space-y-6">
        <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <button onClick={() => setActiveReport(null)} className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400 flex items-center gap-2">
            <ChevronLeft size={24} /> <span className="font-black uppercase text-[10px] tracking-widest leading-none">Volver al Panel</span>
          </button>
        </header>
        <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[700px]">
          {activeReport === 'financial_master' ? renderFinancialMaster() : (
            <div className="p-20 text-center text-slate-300 flex flex-col items-center">
               <Layers size={64} className="opacity-10 mb-4" />
               <p className="font-black uppercase tracking-widest text-[10px]">Utiliza el reporte maestro para ver el flujo real de caja.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">Reportes Financieros</h2>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mt-2">Liquidación de Utilidades Netas por Entidad Técnica</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <button onClick={() => setActiveReport('financial_master')} className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-sm text-left hover:border-blue-400 hover:shadow-2xl transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 opacity-10 rounded-bl-[5rem] group-hover:scale-110 transition-transform" />
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-10 shadow-inner"><TrendingUp size={40} /></div>
          <h3 className="font-black text-slate-900 text-4xl uppercase tracking-tighter mb-4 leading-none italic">Liquidación Maestra</h3>
          <p className="text-sm text-slate-400 font-bold mb-12 leading-relaxed uppercase tracking-tight">Análisis cruzado de ingresos, mano de obra y facturas de materiales por semana.</p>
          <div className="w-full bg-[#004b76] text-white py-6 rounded-2xl text-[12px] font-black uppercase tracking-widest text-center group-hover:bg-blue-600 transition-colors shadow-2xl">Visualizar Rentabilidad Real</div>
        </button>

        <div className="bg-slate-900 p-16 rounded-[4rem] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
           <Layers className="absolute -top-10 -right-10 opacity-5" size={300} />
           <div>
              <p className="text-amber-500 font-black uppercase tracking-widest text-xs mb-3 border-b border-white/10 pb-2">Acumulado Histórico Cartera TP</p>
              <h4 className="text-6xl font-black italic tracking-tighter">S/ {weeklyFinancials.reduce((s,w) => s + w.totalProfit, 0).toLocaleString()}</h4>
              <p className="text-slate-400 text-xs font-bold uppercase mt-4">Ganancia Total Generada por el taller tras egresos reales</p>
           </div>
           
           <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
              <div>
                 <p className="text-blue-400 font-black uppercase text-[10px] tracking-widest mb-1">Total Invertido</p>
                 <p className="text-3xl font-black italic text-red-400">S/ {(weeklyFinancials.reduce((s,w) => s + w.totalLabor, 0) + weeklyFinancials.reduce((s,w) => s + w.totalRealExpenses, 0)).toLocaleString()}</p>
              </div>
              <div>
                 <p className="text-blue-400 font-black uppercase text-[10px] tracking-widest mb-1">Módulos Instalados</p>
                 <p className="text-3xl font-black italic text-emerald-400">{weeklyFinancials.reduce((s,w) => s + w.totalModules, 0)}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
