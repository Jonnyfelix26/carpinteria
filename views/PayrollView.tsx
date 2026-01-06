
import React, { useMemo, useState } from 'react';
import { Calculator, Download, UserCheck, Calendar, Search, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';
import { Advance, Worker } from '../types';

interface PayrollViewProps {
  advances: Advance[];
  workers: Worker[];
}

const PayrollView: React.FC<PayrollViewProps> = ({ advances, workers }) => {
  const [filter, setFilter] = useState('');

  // Precios unitarios actuales (para el Excel)
  const taskPrices = useMemo(() => {
    const prices = new Map<string, number>();
    advances.forEach(a => prices.set(a.rateId, a.totalPay / a.quantity));
    return Array.from(prices.entries()).map(([name, price]) => ({ name, price }));
  }, [advances]);

  // Agrupación de datos por trabajador (Para la UI Vertical)
  const workerData = useMemo(() => {
    const grouped: Record<string, { total: number, advances: Advance[] }> = {};
    
    advances.forEach(adv => {
      if (!grouped[adv.workerId]) {
        grouped[adv.workerId] = { total: 0, advances: [] };
      }
      grouped[adv.workerId].advances.push(adv);
      grouped[adv.workerId].total += adv.totalPay;
    });

    return Object.entries(grouped)
      .map(([name, data]) => ({ name, ...data }))
      .filter(w => w.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => b.total - a.total);
  }, [advances, filter]);

  const totalGeneral = advances.reduce((sum, a) => sum + a.totalPay, 0);

  // EXPORTADOR: Mantiene la estructura de Matriz Horizontal para Excel (lo que pidieron antes)
  const handleExportMatrix = () => {
    if (advances.length === 0) return;

    const activeWorkers = Array.from(new Set(advances.map(a => a.workerId))).sort();
    // Fix: Explicitly type sort parameters to avoid 'unknown' inference error in Date constructor
    const uniqueDates = Array.from(new Set(advances.map(a => a.date))).sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
    
    // Generamos las filas de la matriz
    const matrixRows: any[] = [];
    uniqueDates.forEach(date => {
      const dateAdvances = advances.filter(a => a.date === date);
      const maxTasks = Math.max(...activeWorkers.map(w => dateAdvances.filter(a => a.workerId === w).length), 1);
      
      for (let i = 0; i < maxTasks; i++) {
        const rowTasks = activeWorkers.map(worker => {
          const workerDateAdvances = dateAdvances.filter(a => a.workerId === worker);
          return workerDateAdvances[i] || null;
        });
        matrixRows.push({ date: i === 0 ? date : "", tasks: rowTasks });
      }
    });

    const styles = `<style>
      table { border-collapse: collapse; font-family: Arial; }
      th, td { border: 1px solid #000; padding: 4px; }
      .header { background-color: #004b76; color: white; font-weight: bold; text-align: center; }
      .sub-header { background-color: #3399cc; color: white; text-align: center; font-size: 9pt; }
      .price-header { background-color: #008080; color: white; }
      .money { text-align: right; mso-number-format: "\\S\\/\\ #\\,##0\\.00"; }
    </style>`;

    let html = `<html><head><meta charset="UTF-8">${styles}</head><body><table>`;
    html += `<tr><td colspan="${activeWorkers.length * 3 + 4}" class="header" style="font-size:16pt">REPORTE DE SALARIOS - MATRIZ GENERAL</td></tr>`;
    html += `<tr></tr>`;
    
    // Encabezados
    html += `<tr><th colspan="2" class="price-header">Lista de Precios</th><td style="border:none"></td><th class="header">Fecha</th>`;
    activeWorkers.forEach(w => html += `<th colspan="3" class="header">${w}</th>`);
    html += `</tr>`;

    // Sub-encabezados
    html += `<tr><th class="price-header">Tarea</th><th class="price-header">P.U.</th><td style="border:none"></td><th></th>`;
    activeWorkers.forEach(() => html += `<th class="sub-header">Tarea</th><th class="sub-header">Cant.</th><th class="sub-header">Total (S/)</th>`);
    html += `</tr>`;

    // Datos
    const maxRows = Math.max(taskPrices.length, matrixRows.length);
    for (let i = 0; i < maxRows; i++) {
      html += `<tr>`;
      html += taskPrices[i] ? `<td>${taskPrices[i].name}</td><td class="money">${taskPrices[i].price}</td>` : `<td></td><td></td>`;
      html += `<td style="border:none"></td>`;
      if (matrixRows[i]) {
        html += `<td style="text-align:center; background:#f0f0f0"><b>${matrixRows[i].date}</b></td>`;
        matrixRows[i].tasks.forEach((t: any) => {
          html += t ? `<td>${t.rateId}</td><td style="text-align:center">${t.quantity}</td><td class="money">${t.totalPay}</td>` : `<td>-</td><td>0</td><td class="money">0</td>`;
        });
      }
      html += `</tr>`;
    }

    // Totales Finales
    html += `<tr><td colspan="3" style="border:none"></td><td class="header">TOTALES:</td>`;
    activeWorkers.forEach(w => {
      const total = advances.filter(a => a.workerId === w).reduce((s, a) => s + a.totalPay, 0);
      html += `<td colspan="2" class="header"></td><td class="header money">${total}</td>`;
    });
    html += `</tr></table></body></html>`;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Matriz_Salarial_Global_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* HEADER DE CONTROL */}
      <header className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Calculator size={30} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Planilla por Operario</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Gestión vertical para múltiples trabajadores</p>
          </div>
        </div>

        <div className="flex flex-1 max-w-md w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar trabajador..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="flex gap-2">
          <div className="bg-slate-900 px-6 py-2 rounded-2xl text-right">
             <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Total Global</p>
             <p className="text-xl font-black text-white">S/ {totalGeneral.toLocaleString()}</p>
          </div>
          <button 
            onClick={handleExportMatrix}
            className="bg-amber-500 text-slate-900 px-6 py-3 rounded-2xl font-black hover:bg-amber-600 transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest shadow-lg shadow-amber-100"
          >
            <Download size={18} /> Exportar Matriz Maestra
          </button>
        </div>
      </header>

      {/* VISTA VERTICAL: ESCALABLE PARA 15+ TRABAJADORES */}
      <div className="grid grid-cols-1 gap-8">
        {workerData.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
             <Calculator size={64} className="mx-auto text-slate-100 mb-4" />
             <p className="text-slate-300 font-black uppercase tracking-widest">No se encontraron registros de producción</p>
          </div>
        ) : (
          workerData.map((worker) => (
            <div key={worker.name} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-shadow border-l-8 border-l-emerald-600">
              {/* Resumen del Trabajador */}
              <div className="p-6 bg-slate-50 flex flex-col md:flex-row justify-between items-center border-b border-slate-100 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 text-3xl font-black shadow-inner border-2 border-white">
                    {worker.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{worker.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {worker.advances.length} Operaciones registradas
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 items-center">
                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monto a Pagar</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">
                      <span className="text-emerald-600 mr-1">S/</span>
                      {worker.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabla Detallada del Trabajador */}
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b">
                    <tr>
                      <th className="px-8 py-3 w-40">Fecha</th>
                      <th className="px-8 py-3">Tipo de Trabajo / Operación</th>
                      <th className="px-8 py-3 text-center">Cantidad</th>
                      <th className="px-8 py-3 text-right">Subtotal (S/)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {worker.advances.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((adv, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-8 py-4 font-mono font-bold text-slate-400">
                          {new Date(adv.date).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-4 font-black text-slate-700 uppercase tracking-tight italic">
                          {adv.rateId}
                        </td>
                        <td className="px-8 py-4 text-center">
                          <span className="bg-slate-900 text-white px-3 py-1 rounded-lg font-black text-lg">
                            {adv.quantity}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                           <p className="font-mono font-black text-slate-900 text-lg">S/ {adv.totalPay.toFixed(2)}</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">P.U: S/ {(adv.totalPay / adv.quantity).toFixed(2)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PayrollView;
