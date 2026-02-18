# Revisión rápida del proyecto y mejoras a futuro

## Diagnóstico actual

- **Arquitectura frontend monolítica:** `App.tsx` concentra carga de datos, sincronización y routing de vistas.
- **Persistencia local simulada:** `webApi` usa `localStorage`; no hay backend real ni manejo robusto de errores.
- **Tipado parcial:** hay uso de `any[]` (por ejemplo, en pedidos), lo que puede ocultar errores en tiempo de desarrollo.
- **Riesgo de runtime en pedidos:** cuando `orderId` no existe en un avance, se podía invocar `toUpperCase()` sobre `undefined`.
- **Build saludable:** el proyecto compila en producción con Vite.

## Mejoras recomendadas (priorizadas)

### 1) Estabilidad y calidad (corto plazo: 1-2 semanas)

1. **Eliminar `any` y tipar entidades clave**
   - Crear interfaz `Order` en `types.ts` y usarla en `App.tsx` + `OrdersView.tsx`.
   - Beneficio: menos errores silenciosos y mejor autocompletado.

2. **Manejo de errores en capa de datos**
   - En `services/apiService.ts`, envolver parseo JSON y operaciones de storage con fallback y logs.
   - Mostrar estados de error en UI (toast/banner).

3. **Validaciones de formularios**
   - Validar rangos y datos obligatorios (módulos, nombres, etc.) con esquema (Zod/Yup).

4. **Linting + formateo + type-check en CI**
   - Añadir scripts: `lint`, `typecheck`, `test`.
   - Activar pipeline mínima (GitHub Actions) para evitar regresiones.

### 2) Escalabilidad funcional (mediano plazo: 3-6 semanas)

1. **Separar estado global de vistas**
   - Migrar a TanStack Query + store ligera (Zustand/Redux Toolkit) para desacoplar `App.tsx`.

2. **Backend real y autenticación**
   - Reemplazar `localStorage` por API REST/GraphQL con persistencia (PostgreSQL).
   - Incorporar autenticación por roles (admin, supervisor, operador).

3. **Observabilidad básica**
   - Integrar logging estructurado y trazas de errores de frontend (Sentry o similar).

4. **Módulo financiero completo**
   - Consolidar `CostsView`, `ReportsView`, `ExpensesView` en navegación principal y conectarlos con datos reales.

### 3) Producto y analítica (largo plazo: 6+ semanas)

1. **KPIs operativos reales**
   - Cambiar datos mock del dashboard por métricas agregadas del backend.

2. **Predicción y alertas**
   - Alertas de stock bajo, desvío de presupuesto y riesgo de atraso por orden.

3. **Asistente IA gobernado**
   - Versionar prompts, registrar resultados de `geminiService`, y controlar costos/latencia.

4. **Auditoría y trazabilidad**
   - Historial de cambios por entidad (quién, cuándo, qué cambió).

## Quick wins técnicos sugeridos

- [x] Corregir acceso inseguro de `orderId` en cálculo de avances de pedidos.
- [ ] Crear tipo `Order` y retirar `any[]`.
- [ ] Añadir `npm run typecheck` con `tsc --noEmit`.
- [ ] Añadir tests de lógica (cálculo de progreso por pedido).
- [ ] Incluir estado de error visual cuando falle sincronización.
