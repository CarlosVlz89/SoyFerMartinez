import React, { useState } from 'react';
import { Zap, Plus, Trash2, LayoutDashboard, LogOut, ArrowLeft, Link2 } from 'lucide-react';

export default function Sidebar({ 
  user, 
  projects, 
  activeProject, 
  setActiveProject, 
  onAddProject, 
  onDeleteProject,
  onAddLink,      // Nueva prop
  onDeleteLink,   // Nueva prop
  onLogout, 
  onClose 
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Estados para Recursos
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onAddProject(newProjectName);
      setNewProjectName('');
      setIsAdding(false);
    }
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    if (newLinkLabel.trim() && newLinkUrl.trim()) {
      onAddLink(newLinkLabel, newLinkUrl);
      setNewLinkLabel('');
      setNewLinkUrl('');
      setIsAddingLink(false);
    }
  };

  return (
    <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 hidden md:flex flex-col relative z-20 shrink-0 h-full">
      
      {onClose && (
        <div className="px-8 pt-6">
            <button onClick={onClose} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group w-full">
                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors"><ArrowLeft size={14} /></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Volver al inicio</span>
            </button>
        </div>
      )}

      <div className="p-8 pt-4">
        <div className="flex items-center gap-2 mb-1 text-left">
          <Zap size={18} className="text-indigo-400 fill-indigo-400/20" />
          <h1 className="text-xl font-black tracking-tighter italic">FerDev Studio</h1>
        </div>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold text-left">Business Intel</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto no-scrollbar text-left">
        <button 
          onClick={() => setActiveProject(null)} 
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all border mb-6 ${!activeProject ? 'bg-white/10 border-white/20 text-white shadow-lg' : 'border-transparent text-slate-500 hover:bg-white/5'}`}
        >
          <LayoutDashboard size={16} />
          <span className="font-bold text-xs uppercase tracking-wider">Panorama General</span>
        </button>

        <div className="flex items-center justify-between px-4 mb-4">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Proyectos</span>
          <button onClick={() => setIsAdding(!isAdding)} className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-indigo-400 transition-colors"><Plus size={14} /></button>
        </div>

        {isAdding && (
          <form onSubmit={handleSubmit} className="px-2 mb-4 animate-in fade-in slide-in-from-top-2">
            <input autoFocus type="text" placeholder="Nombre..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
          </form>
        )}

        <div className="space-y-1 mb-8">
          {projects.map((proj) => (
            <div key={proj.id} className="group relative flex items-center">
              <button 
                onClick={() => setActiveProject(proj)} 
                className={`flex-1 flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all border ${activeProject?.id === proj.id ? 'bg-white/10 border-white/20 text-white shadow-lg ' + proj.glow : 'border-transparent text-slate-500 hover:bg-white/5'}`}
              >
                <div className={`w-2 h-2 rounded-full ${proj.color} shadow-lg shadow-current`} />
                <span className="font-bold text-xs uppercase tracking-wider truncate pr-6">{proj.name}</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDeleteProject(proj.id, proj.name); }} className="absolute right-3 opacity-0 group-hover:opacity-100 p-1.5 text-slate-600 hover:text-red-400 transition-all rounded-lg hover:bg-red-500/10">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* --- SECCIÓN RECURSOS (RECUPERADA) --- */}
        {activeProject && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between px-4 mb-4 pt-4 border-t border-white/5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Recursos</span>
              <button onClick={() => setIsAddingLink(!isAddingLink)} className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-indigo-400 transition-colors">
                <Plus size={14} />
              </button>
            </div>

            {isAddingLink && (
              <form onSubmit={handleLinkSubmit} className="px-2 mb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
                <input autoFocus type="text" placeholder="Nombre (ej. GitHub)" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none" value={newLinkLabel} onChange={(e) => setNewLinkLabel(e.target.value)} />
                <input type="url" placeholder="URL del enlace" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} />
                <button type="submit" className="w-full py-2 bg-indigo-600 rounded-xl text-[9px] font-black uppercase text-white">Guardar</button>
              </form>
            )}

            <div className="space-y-2 px-2">
              {activeProject.links?.map((link, idx) => (
                <div key={idx} className="group relative flex items-center">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 px-3 py-2.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest truncate">
                    <span>{link.icon}</span> {link.label}
                  </a>
                  <button onClick={() => onDeleteLink(idx)} className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-400 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="p-6">
        <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-[24px] border border-white/5 backdrop-blur-md">
          {user?.photoURL && <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-white/20" />}
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-black truncate uppercase tracking-wider">{user?.displayName}</p>
          </div>
          <button onClick={onLogout} className="text-slate-500 hover:text-white" title="Cerrar Sesión"><LogOut size={14}/></button>
        </div>
      </div>
    </aside>
  );
}