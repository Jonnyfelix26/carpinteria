
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeProjectBudget = async (projectName: string, budget: number, costs: any) => {
  try {
    // Using gemini-3-pro-preview for complex reasoning and budget analysis tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analiza el presupuesto del proyecto "${projectName}". 
      Presupuesto Total: S/ ${budget}. 
      Costos Actuales: Materiales (S/ ${costs.materials}), Mano de Obra (S/ ${costs.labor}), Instalación (S/ ${costs.install}).
      Por favor, proporciona un resumen de rentabilidad, posibles riesgos de sobrecostos en el contexto de Techo Propio Perú y una recomendación estratégica corta.`,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error al generar análisis inteligente.";
  }
};
