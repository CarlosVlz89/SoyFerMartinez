import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// IMPORTANTE: Aquí corregimos la ruta del CSS que moviste
import './styles/index.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Agregamos el basename con el nombre EXACTO de tu repo */}
    <BrowserRouter basename="/SoyFerMartinez">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
