
import React from 'react';
import { 
  LayoutDashboard, 
  Home,
  ClipboardList,
  Package,
  Users,
  Target,
  Hammer,
  Calculator,
  Truck,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Proyectos TP', icon: Home },
    { id: 'orders', label: 'Pedidos', icon: ClipboardList },
    { id: 'inventory', label: 'Almacén', icon: Package },
    { id: 'users', label: 'Personal', icon: Users },
    { id: 'rates', label: 'Precio Destajo', icon: Target },
    { id: 'production', label: 'Taller / Avances', icon: Hammer },
    { id: 'payroll', label: 'Planilla / Pagos', icon: Calculator },
    { id: 'installations', label: 'Instalaciones', icon: Truck },
  ];

  return (
    <div className="w-64 bg-[#0f172a] text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 z-50">
      <div className="p-6 border-b border-slate-800/50 mb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center">
            <Hammer size={18} className="text-white" />
          </div>
          CarpinERP
        </h1>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 mb-1 rounded-xl transition-all duration-200 group ${
              activeView === item.id 
                ? 'bg-[#d97706] text-white shadow-lg font-bold' 
                : 'hover:bg-slate-800/50 hover:text-white font-medium'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className={activeView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="text-sm tracking-tight">{item.label}</span>
            </div>
            {activeView === item.id && <ChevronRight size={14} className="text-white" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors px-4 py-2 w-full text-xs font-bold uppercase tracking-wider">
          <LogOut size={16} />
          <span>Cerrar Turno</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
