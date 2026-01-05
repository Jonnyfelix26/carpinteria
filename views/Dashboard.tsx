
import React from 'react';
import { 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Box
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import StatsCard from '../components/StatsCard';
import { Advance } from '../types';

interface DashboardProps {
  advances: Advance[];
}

const Dashboard: React.FC<DashboardProps> = ({ advances }) => {
  const prodData = [
    { name: 'Lun', solid: 12, plywood: 20 },
    { name: 'Mar', solid: 15, plywood: 25 },
    { name: 'Mie', solid: 10, plywood: 18 },
    { name: 'Jue', solid: 18, plywood: 30 },
    { name: 'Vie', solid: 20, plywood: 22 },
    { name: 'Sab', solid: 8, plywood: 12 },
  ];

  const pieData = [
    { name: 'Macizas', value: 40, color: '#92400e' },
    { name: 'Contraplacadas', value: 60, color: '#0369a1' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Resumen General</h2>
          <p className="text-slate-500">Estado operativo al día de hoy</p>
        </div>
        <button className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors">
          Exportar Reporte Mensual
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          label="Proyectos Activos" 
          value="12" 
          change="+2 esta semana" 
          icon={ClipboardList} 
          color="bg-blue-600" 
        />
        <StatsCard 
          label="Producción Diaria" 
          value="45 puertas" 
          change="+15%" 
          icon={TrendingUp} 
          color="bg-emerald-600" 
        />
        <StatsCard 
          label="Puertas Pendientes" 
          value="158" 
          icon={Box} 
          color="bg-amber-500" 
        />
        <StatsCard 
          label="Personal en Obra" 
          value="24" 
          icon={Users} 
          color="bg-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-600" />
            Producción Semanal (Madera vs Contraplacada)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prodData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="solid" name="Maciza" fill="#92400e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="plywood" name="Contraplacada" fill="#0369a1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Mix de Productos</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">100%</p>
                <p className="text-xs text-slate-400">Total Producción</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
