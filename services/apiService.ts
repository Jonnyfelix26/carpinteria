
/**
 * Mock API Service
 * En un entorno real, estas funciones usarían fetch() o axios para comunicarse con un backend.
 * Por ahora, simulan latencia de red para comportamiento de aplicación web.
 */

const LATENCY = 600;

export const webApi = {
  fetchData: async (key: string) => {
    await new Promise(resolve => setTimeout(resolve, LATENCY));
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  saveData: async (key: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, LATENCY / 2));
    localStorage.setItem(key, JSON.stringify(data));
    return { success: true, timestamp: new Date().toISOString() };
  },

  // Simulación de un endpoint de telemetría o auditoría web
  logActivity: async (user: string, action: string) => {
    console.log(`[WebAudit] ${new Date().toISOString()} - User ${user}: ${action}`);
  }
};
