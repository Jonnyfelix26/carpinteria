

export enum DoorType {
  SOLID = 'Madera Maciza',
  PLYWOOD = 'Contraplacada'
}

export enum ProjectStatus {
  QUOTED = 'Cotizado',
  APPROVED = 'Aprobado',
  MANUFACTURING = 'En fabricación',
  FINISHED = 'Terminado',
  INSTALLED = 'Instalado',
  DELIVERED = 'Entregado'
}

export enum WorkerType {
  CARPENTER = 'Carpintero',
  PAINTER = 'Pintor',
  INSTALLER = 'Instalador'
}

export interface Worker {
  id: string;
  name: string;
  type: WorkerType;
  specialty: string;
  status: 'Activo' | 'Inactivo';
}

export interface TaskRate {
  id: string;
  description: string;
  category: 'Fabricación' | 'Pintura' | 'Instalación' | 'Especial';
  unitPrice: number;
}

export interface Advance {
  id: string;
  workerId: string;
  rateId: string;
  quantity: number;
  date: string;
  totalPay: number;
  orderId?: string;
  entityName?: string;
}

export interface Material {
  id: string;
  name: string;
  category: 'Madera' | 'Triplay' | 'Acabado' | 'Ferretería';
  stock: number;
  unit: string;
  minStock: number;
}

export interface ProjectTP {
  id: string;
  entityName: string;
  location: string;
  totalViviendas: number;
  doorsPerVivienda: number;
  progress: number;
  stage: string;
}

// Added Expense interface to support financial tracking and reports
export interface Expense {
  id: string;
  description: string;
  category: 'Madera' | 'Herrajes' | 'Insumos' | 'Logística' | 'Otros';
  amount: number;
  entityName: string;
  date: string;
}
