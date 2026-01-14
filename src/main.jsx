import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

/**
 * ARCHIVO: src/main.jsx
 * Este es el punto de entrada de tu aplicación.
 * Su única función es tomar el componente principal (App) 
 * y renderizarlo en el archivo index.html.
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
