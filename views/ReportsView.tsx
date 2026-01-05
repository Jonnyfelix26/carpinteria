
import React from 'react';
import { PieChart, Download, FileText, Calendar, Filter } from 'lucide-react';

const ReportsView: React.FC = () => {
  const reports = [
    { title: 'Producción por Planta', desc: 'Resumen de puertas fabricadas vs meta mensual.', icon: PieChart },
    { title: 'Liquidación Techo Propio', desc: 'Documentación requerida para cobro de valorizaciones.', icon: FileText },
    { title: 'Asistencia de Cuadrillas', desc: 'Horas hombre y asistencia en instalaciones.', icon: Calendar },
    { title: 'Mermas y Desperdicios', desc: 'Análisis de eficiencia en el uso de madera.', icon: Filter },
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="text-amber-600" />
            Centro de Reportes e Inteligencia
          </h2>
          <p className="text-slate-500">Análisis operativo para la toma de decisiones</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-amber-400 transition-all group">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
              <report.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-lg">{report.title}</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{report.desc}</p>
              <div className="mt-4 flex gap-2">
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition-colors flex items-center gap-2">
                  <Download size={14} />
                  Generar PDF
                </button>
                <button className="border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                  Ver en Pantalla
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsView;
