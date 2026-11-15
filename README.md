# Clarius — Landing Page

Landing page moderna, interactiva y responsive para **Clarius**, una plataforma de automatización de flujos de trabajo de código abierto y orquestación de agentes de IA (inspirada en n8n, Zapier y Make).

---

## 🚀 Características Principales de la Landing Page

1. **Diseño Visual de Alta Gama (Estética Dark-Mode Moderna)**:
   - Inspirado en la interfaz de usuario de herramientas líderes para desarrolladores como n8n, Linear, Supabase y Vercel.
   - Iluminación ambiental y efectos de cristal (*glassmorphism*).
   - Patrón de cuadrícula de lienzo sutil (*dot-grid*).

2. **Simulador de Flujo de Trabajo Interactivo (Hero Section)**:
   - Conexiones dinámicas SVG con curvas Bézier que se adaptan a cualquier resolución (desktop y mobile).
   - Botón **"Ejecutar Flujo de Prueba"**: anima pulsos de datos luminosos que viajan de nodo en nodo (Webhook → Agente IA Gemini 1.5 Pro → PostgreSQL & Slack en paralelo).
   - **Inspector de Nodos en Vivo**: Haz clic en cualquier nodo para inspeccionar sus cargas JSON reales simuladas (payloads de entrada, prompts de IA con puntuación de lead y consultas SQL).

3. **Ecosistema de Integraciones Filtrable y Buscable**:
   - Catálogo interactivo de conectores (Inteligencia Artificial, Bases de Datos, Mensajería/CRM, DevOps & Cloud).
   - Búsqueda en tiempo real por texto o filtrado por categorías.

4. **Terminal de Despliegue con Pestañas**:
   - Muestra comandos de arranque rápido para **Docker**, **Docker Compose**, **Kubernetes (Helm)** y **npm CLI**.
   - Botón de copiado al portapapeles con confirmación visual interactiva.

5. **Tabla Comparativa Detallada**:
   - Comparación transparente de características clave: Clarius vs. Zapier vs. Make.com vs. n8n (Privacidad de datos, soporte de Python/JS nativo, coste por ejecución y orquestación de IA).

6. **Calculadora y Selector de Precios**:
   - Selector entre ciclo de facturación mensual y anual con descuento del 20%.
   - Desglose de planes: **Community (Self-Hosted Gratuito)**, **Pro Cloud** y **Enterprise**.

7. **Sección de Preguntas Frecuentes (FAQ Accordion)**:
   - Respuestas expandibles con animaciones suaves a las dudas más comunes sobre hosting propio, GDPR, importación de flujos y requerimientos de servidor.

---

## 📂 Estructura de Archivos

- [index.html](file:///Users/imac/tutoantigravitygithub/index.html): Documento HTML semántico con diseño modular.
- [styles.css](file:///Users/imac/tutoantigravitygithub/styles.css): Animaciones de cables SVG, pulsos de nodos, patrones de cuadrícula y efectos luminosos.
- [app.js](file:///Users/imac/tutoantigravitygithub/app.js): Lógica de simulación de flujos, cálculo reactivo de curvas Bézier, filtrado de integraciones, terminal interactiva y acordeón.

---

## 🌐 Cómo Visualizar la Landing Page

Puedes abrir directamente el archivo en cualquier navegador:

```bash
open /Users/imac/tutoantigravitygithub/index.html
```

O si prefieres un servidor web local:
```bash
python3 -m http.server 3000
```
Y abrir en tu navegador: `http://localhost:3000`
