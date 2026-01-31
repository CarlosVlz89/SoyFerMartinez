import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { projectsData } from '../../data/projects'; // Importamos los datos

const Portafolio = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <section id="proyectos" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic">Portafolio_</h2>
          <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
            {['all', 'dev', 'marketing', 'data'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projectsData.filter(p => activeTab === 'all' || p.category === activeTab).map(project => {
            // Extraemos el icono dinámicamente
            const Icon = project.icon; 
            
            return (
              <div key={project.id} className="group flex flex-col h-full">
                <div className="relative mb-6 overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-white/5 aspect-[4/3] flex items-center justify-center">
                   {/* Renderizamos el icono */}
                   <Icon size={80} className={`text-white/20 group-hover:scale-110 transition-transform duration-500 ${project.category === 'dev' ? 'text-indigo-500/20' : project.category === 'data' ? 'text-emerald-500/20' : 'text-amber-500/20'}`} />
                   
                   <div className="absolute top-6 right-6">
                      <div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all cursor-pointer">
                        <ExternalLink size={16} />
                      </div>
                   </div>
                </div>
                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">{project.subtitle}</div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                  {project.tech.map(t => (
                    <span key={t} className="text-[9px] font-black text-slate-400 bg-white/5 px-2 py-1 rounded-md border border-white/5 uppercase tracking-widest">{t}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Portafolio;