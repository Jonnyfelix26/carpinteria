
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  Hammer, 
  Package, 
  Truck, 
  ClipboardList, 
  Calculator,
  Target,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  // Orden solicitado: DASHBOARD, PROYECTOS TP, PEDIDOS, ALMACEN, PERSONAL, PRECIO DESTAJO, TALLER/AVANCES, PLANILLA/PAGOS, INSTALACIONES
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
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center">
            <Hammer size={18} className="text-white" />
          </div>
          CarpinERP
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Gestión de Carpintería</p>
      </div>

      <nav className="flex-1 mt-4 px-3 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center justify-between px-4 py-2.5 mb-1 rounded-lg transition-all ${
              activeView === item.id 
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            {activeView === item.id && <ChevronRight size={14} />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors px-4 py-2 w-full text-sm">
          <LogOut size={18} />
          <span>Salir del Sistema</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
