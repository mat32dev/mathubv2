
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Eliminada extensión .tsx para mayor compatibilidad

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("FATAL ERROR:", error);
    container.innerHTML = `<div style="color:white; padding:40px; font-family:sans-serif; background:#1c1917; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
      <h2 style="color:#ea580c; font-size:2rem; margin-bottom:1rem;">MAT32 | SISTEMA EN MANTENIMIENTO</h2>
      <p style="color:#888; margin-bottom:2rem;">Estamos sincronizando los platos. Vuelve en unos segundos.</p>
    </div>`;
  }
}
