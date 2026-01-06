
import React, { useState, useMemo } from 'react';
import { 
  PieChart, 
  ChevronLeft, 
  Table as TableIcon, 
  Printer,
  FileSpreadsheet,
  Calculator,
  UserCheck,
  Download,
  FileText
} from 'lucide-react';
import { Advance, ProjectTP, Material } from '../types';

interface ReportsViewProps {
  advances: Advance[];
  projects: ProjectTP[];
  materials: Material[];
  orders: any[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ advances, projects, materials, orders }) => {
  const [activeReport, setActiveReport] = useState<string | null>(null);

  const reportTypes = [
    { 
      id: 'payroll', 
      title: 'Matriz Salarial a Destajo', 
      desc: 'Tabla técnica con desglose horizontal por trabajador y precios unitarios.', 
      icon: Calculator,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      id: 'production', 
      title: 'Balance de Producción', 
      desc: 'Consolidado de piezas terminadas por categoría.', 
      icon: TableIcon,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
  ];

  // Lógica para la Matriz de Reporte
  // Fix: Explicitly type sort parameters to avoid 'unknown' inference error
  const uniqueDates = useMemo(() => {
    return Array.from(new Set(advances.map(a => a.date))).sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
  }, [advances]);

  const activeWorkers = useMemo(() => {
    return Array.from(new Set(advances.map(a => a.workerId)));
  }, [advances]);

  const renderMatrixTable = () => (
    <div className="bg-white p-0 overflow-x-auto">
      <table className="w-full text-left border-collapse border border-slate-200">
        <thead className="bg-slate-900 text-white uppercase font-black tracking-widest text-[9px]">
          <tr className="divide-x divide-slate-800">
            <th className="px-4 py-4 w-24 text-center">Fecha</th>
            {activeWorkers.map(w => (
              <th key={w} colSpan={3} className="px-4 py-4 text-center border-b border-slate-700 bg-slate-800">{w}</th>
            ))}
          </tr>
          <tr className="bg-slate-100 text-slate-500 divide-x divide-slate-200 border-b border-slate-200">
            <th className="px-4 py-2">Día/Mes</th>
            {activeWorkers.map(w => (
              <React.Fragment key={`${w}-cols`}>
                <th className="px-4 py-2">Trabajo</th>
                <th className="px-4 py-2 text-center">Cant</th>
                <th className="px-4 py-2 text-right">S/</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-[11px]">
          {uniqueDates.map(date => (
            <tr key={date} className="divide-x divide-slate-50 hover:bg-slate-50">
              <td className="px-4 py-2 font-mono text-center text-slate-400">{date}</td>
              {activeWorkers.map(worker => {
                const adv = advances.find(a => a.date === date && a.workerId === worker);
                return (
                  <React.Fragment key={`${date}-${worker}`}>
                    <td className="px-4 py-2 font-medium text-slate-700">{adv ? adv.rateId : '-'}</td>
                    <td className="px-4 py-2 text-center font-black">{adv ? adv.quantity : 0}</td>
                    <td className="px-4 py-2 text-right font-mono">{adv ? adv.totalPay.toFixed(2) : '0.00'}</td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
          <tr className="bg-slate-900 text-amber-500 border-t-4 border-amber-500">
            <td className="px-4 py-5 text-center font-black text-[10px]">TOTALES</td>
            {activeWorkers.map(worker => {
              const total = advances.filter(a => a.workerId === worker).reduce((s, a) => s + a.totalPay, 0);
              return (
                <React.Fragment key={`${worker}-total`}>
                  <td colSpan={2} className="px-4 py-5 text-right font-black uppercase text-[8px]">Monto Personal:</td>
                  <td className="px-4 py-5 text-right font-black text-lg bg-slate-950">S/ {total.toFixed(2)}</td>
                </React.Fragment>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );

  if (activeReport) {
    const reportInfo = reportTypes.find(r => r.id === activeReport);
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <header className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveReport(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronLeft size={24} className="text-slate-400" />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">{reportInfo?.title}</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Formato de matriz técnica consolidada</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
              <Printer size={16} /> Imprimir Reporte
            </button>
          </div>
        </header>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          {activeReport === 'payroll' && renderMatrixTable()}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Reportería Estructurada</h2>
        <p className="text-slate-500">Generación de tablas y matrices de control operativo</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
          <button 
            key={report.id} 
            onClick={() => setActiveReport(report.id)}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm text-left hover:border-amber-400 hover:shadow-xl transition-all group"
          >
            <div className={`w-14 h-14 ${report.bg} ${report.color} rounded-2xl flex items-center justify-center mb-6`}>
              <report.icon size={28} />
            </div>
            <h3 className="font-black text-slate-900 text-xl uppercase tracking-tighter mb-2">{report.title}</h3>
            <p className="text-sm text-slate-400 font-medium mb-8">{report.desc}</p>
            <div className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center group-hover:bg-amber-600 transition-colors">
              Abrir Matriz Organizada
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportsView;
