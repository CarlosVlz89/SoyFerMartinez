import React from 'react';
import { Zap, ChevronRight, Terminal, Linkedin, Github } from 'lucide-react';

const Hero = ({ onOpenConsole }) => {
  return (
    <section className="relative pt-48 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-8">
            <Zap size={14} className="fill-current" />
            <span>Digital Strategist & Developer</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.85] mb-10 tracking-tighter">
            Entiendo el <span className="text-indigo-500">negocio</span>,<br />
            creo la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">solución</span>.
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-12 max-w-3xl font-light">
            Especialista en convertir necesidades comerciales en productos digitales funcionales. Utilizo <span className="text-white font-medium italic">IA y disciplina técnica</span> para acelerar el crecimiento de negocios.
          </p>
          <div className="flex flex-wrap gap-6 items-center">
            <a href="#proyectos" className="px-10 py-5 bg-white text-black hover:bg-indigo-500 hover:text-white rounded-2xl font-black transition-all flex items-center gap-3 group">
              VER PROYECTOS
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>

            <button 
              onClick={onOpenConsole}
              className="px-8 py-5 border border-white/10 rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3 group"
            >
              <Terminal size={20} className="text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm tracking-widest">EJECUTAR CONSOLA</span>
            </button>

            <div className="flex items-center gap-8 px-8 border-l border-white/10">
              <Linkedin size={24} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
              <Github size={24} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;