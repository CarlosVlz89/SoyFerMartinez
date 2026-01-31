import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

const Navbar = ({ onOpenConsole }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-[#050505]/90 border-white/10 py-4 backdrop-blur-md' : 'bg-transparent border-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="text-2xl font-black tracking-tighter text-white">
            Soy<span className="text-indigo-500 group-hover:text-indigo-400 transition-colors">FerMartinez</span>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-10 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
          <a href="#proceso" className="hover:text-white transition-colors">Mi Proceso</a>
          <a href="#proyectos" className="hover:text-white transition-colors">Portafolio</a>
          
          <button 
            onClick={onOpenConsole}
            className="flex items-center gap-2 border border-indigo-500/30 px-4 py-2 rounded-full text-indigo-400 hover:bg-indigo-500/10 transition-all"
          >
            <Terminal size={14} />
            TERMINAL DEV
          </button>

          <a href="mailto:hola@soyfermartinez.com" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 font-bold">
            Contacto
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;