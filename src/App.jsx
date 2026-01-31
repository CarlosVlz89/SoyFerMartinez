import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Importamos Componentes
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Proceso from './components/sections/Proceso';
import Portafolio from './components/sections/Portafolio';
import IASection from './components/sections/IASection';

// Importamos Páginas
import DevDashboard from './dashboard/DevDashboard';
import ClientPortal from './pages/ClientPortal';

// --- COMPONENTE WRAPPER PARA LA LANDING PAGE ---
// (Esto agrupa todo lo que ya tenías en una sola "Página")
const LandingPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate(); // Hook para navegar

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Función que se ejecuta al dar clic en "Terminal Dev"
  const handleOpenConsole = () => {
    navigate('/dashboard'); // Ahora redirige a la ruta /dashboard
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-500"
        style={{ background: `radial-gradient(800px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.12), transparent 80%)` }}
      />
      <Navbar onOpenConsole={handleOpenConsole} />
      <Hero onOpenConsole={handleOpenConsole} />
      <Proceso />
      <Portafolio />
      <IASection />
      <Footer />
    </div>
  );
};

// --- APP PRINCIPAL CON RUTAS ---
const App = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Ruta 1: Home (Landing) */}
      <Route path="/" element={<LandingPage />} />

      {/* Ruta 2: Admin Panel */}
      <Route path="/dashboard" element={<DevDashboard onClose={() => navigate('/')} />} />

      {/* Ruta 3: Portal del Cliente (Dinámico por ID) */}
      <Route path="/status/:projectId" element={<ClientPortal />} />
    </Routes>
  );
};

export default App;