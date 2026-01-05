
import React, { useMemo } from 'react';
import { Calculator, Download, Calendar, DollarSign, User, CheckCircle2 } from 'lucide-react';
import { Advance, Worker } from '../types';

interface PayrollViewProps {
  advances: Advance[];
  workers: Worker[];
}

const PayrollView: React.FC<PayrollViewProps> = ({ advances, workers }) => {
  // Lógica de cálculo: Agrupar avances por trabajador
  const payrollDetails = useMemo(() => {
    const map = new Map();
    
    advances.forEach(adv => {
      if (!map.has(adv.workerId)) {
        map.set(adv.workerId, { 
          workerName: adv.workerId, 
          totalTasks: 0, 
          totalAmount: 0,
          advances: [] 
        });
      }
      const data = map.get(adv.workerId);
      data.totalTasks += adv.quantity;
      data.totalAmount += adv.totalPay;
      data.advances.push(adv);
    });

    return Array.from(map.values());
  }, [advances]);

  const totalWeekly = payrollDetails.reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="text-emerald-600" />
            Planilla de Pagos por Avance
          </h2>
          <p className="text-slate-500">Resumen semanal de liquidación para el personal</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all">
            <Download size={18} /> Exportar Planilla (XLS)
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border-b-4 border-emerald-500">
          <div className="flex items-center gap-3 text-emerald-400 mb-4 font-black uppercase text-[10px] tracking-widest">
            <DollarSign size={18} /> Total Planilla Semanal
          </div>
          <p className="text-4xl font-black">S/ {totalWeekly.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-4">
            <Calendar size={14} /> Semana del {new Date().toLocaleDateString()}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-blue-600 mb-4 font-black uppercase text-[10px] tracking-widest">
            <User size={18} /> Trabajadores Activos
          </div>
          <p className="text-4xl font-black text-slate-900">{payrollDetails.length}</p>
          <p className="text-xs text-slate-400 mt-4 font-bold uppercase">Personal con avances registrados</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-amber-500 mb-4 font-black uppercase text-[10px] tracking-widest">
            <CheckCircle2 size={18} /> Total Operaciones
          </div>
          <p className="text-4xl font-black text-slate-900">
            {advances.reduce((sum, a) => sum + a.quantity, 0)}
          </p>
          <p className="text-xs text-slate-400 mt-4 font-bold uppercase">Piezas terminadas en taller</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Detalle por Trabajador</h3>
        {payrollDetails.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
            <Calculator size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No hay datos para liquidar esta semana</p>
          </div>
        ) : payrollDetails.map((pay, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-emerald-400 transition-all">
            <div className="p-6 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xl border-4 border-white shadow-md">
                  {pay.workerName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">{pay.workerName}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Total piezas avanzadas: {pay.totalTasks}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monto a Liquidar</p>
                <p className="text-3xl font-black text-emerald-600">S/ {pay.totalAmount.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="px-6 pb-6 pt-2">
              <div className="bg-white rounded-xl border border-slate-100 p-2 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 font-black uppercase border-b border-slate-50">
                    <tr>
                      <th className="px-3 py-2">Fecha</th>
                      <th className="px-3 py-2">Tarea</th>
                      <th className="px-3 py-2 text-center">Cant.</th>
                      <th className="px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pay.advances.map((a: any) => (
                      <tr key={a.id}>
                        <td className="px-3 py-2 font-mono">{a.date}</td>
                        <td className="px-3 py-2 font-bold">{a.rateId}</td>
                        <td className="px-3 py-2 text-center font-black">{a.quantity}</td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-slate-700">S/ {a.totalPay.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayrollView;
