
import React, { useState, useEffect } from 'react';
import { DollarSign, Cpu, Loader2, AlertTriangle, TrendingUp } from 'lucide-react';
import { analyzeProjectBudget } from '../services/geminiService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Advance } from '../types';

interface CostsViewProps {
  advances: Advance[];
}

// CostsView component providing financial analysis and AI-driven insights.
const CostsView: React.FC<CostsViewProps> = ({ advances }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const mockCosts = {
    materials: 45200,
    labor: 15800,
    install: 8900
  };
  const totalBudget = 85000;
  const currentTotal = mockCosts.materials + mockCosts.labor + mockCosts.install;
  const margin = ((totalBudget - currentTotal) / totalBudget * 100).toFixed(1);

  const costTrend = [
    { month: 'Ene', cost: 12000, revenue: 15000 },
    { month: 'Feb', cost: 18000, revenue: 22000 },
    { month: 'Mar', cost: 15000, revenue: 28000 },
    { month: 'Abr', cost: 22000, revenue: 35000 },
    { month: 'May', cost: 28000, revenue: 45000 },
  ];

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeProjectBudget("Proyecto Residencial Olivos - Techo Propio", totalBudget, mockCosts);
    setAnalysis(result || '');
    setLoading(false);
  };

  useEffect(() => {
    handleAnalyze();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <DollarSign className="text-emerald-600" />
          Análisis de Costos y Rentabilidad
        </h2>
        <p className="text-slate-500">Control financiero por proyecto y puerta</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl">
          <p className="text-sm font-medium text-emerald-700">Presupuesto Ejecutado</p>
          <p className="text-3xl font-black text-emerald-900 mt-1">S/ {currentTotal.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-2">de S/ {totalBudget.toLocaleString()} proyectado</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
          <p className="text-sm font-medium text-blue-700">Margen de Utilidad</p>
          <p className="text-3xl font-black text-blue-900 mt-1">{margin}%</p>
          <p className="text-xs text-blue-600 mt-2">Bruto actual</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl">
          <p className="text-sm font-medium text-slate-700">Costo Promedio / Puerta</p>
          <p className="text-3xl font-black text-slate-900 mt-1">S/ 485.00</p>
          <p className="text-xs text-slate-600 mt-2">Basado en 144 unidades</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl">
          <p className="text-sm font-medium text-amber-700">Desvío Presupuestario</p>
          <p className="text-3xl font-black text-amber-900 mt-1">+4.2%</p>
          <p className="text-xs text-amber-600 mt-2">Respecto a línea base</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" />
              Tendencia de Ingresos vs Egresos
            </span>
            <span className="text-xs font-normal text-slate-400">Últimos 5 meses</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#d1fae5" name="Ingresos" />
                <Area type="monotone" dataKey="cost" stackId="2" stroke="#ef4444" fill="#fee2e2" name="Costos" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-slate-100 p-6 rounded-xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-amber-400">
                <Cpu size={20} />
                Inteligencia Predictiva (Gemini AI)
              </h3>
              <button 
                onClick={handleAnalyze} 
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1 rounded transition-colors"
              >
                Refrescar Análisis
              </button>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-amber-400 mb-4" />
                <p className="text-slate-400 animate-pulse">Analizando variables del proyecto...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-amber-500 prose prose-invert text-sm max-w-none">
                  {analysis.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0 leading-relaxed text-slate-300 italic">
                      {line}
                    </p>
                  ))}
                </div>
                <div className="flex items-start gap-2 text-xs text-amber-300 bg-amber-900/30 p-2 rounded">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <p>Basado en los precios actuales de la madera tornillo y mano de obra en Lima/Provincias.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostsView;
