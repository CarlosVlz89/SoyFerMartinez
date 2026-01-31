import React, { useMemo } from 'react';
import { Layers, Activity, Briefcase, ListTodo, ArrowRight, Code2, Flame } from 'lucide-react';

export default function SummaryView({ user, projects, allTasks, setActiveProject }) {
  
  // --- LÓGICA DEL MAPA DE CALOR ---
  const heatmapData = useMemo(() => {
    // 1. Generar los últimos 140 días (20 semanas) para que se vea estético
    const today = new Date();
    const days = [];
    for (let i = 139; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().split('T')[0]); // Formato YYYY-MM-DD
    }

    // 2. Contar tareas completadas por día
    const counts = {};
    allTasks.forEach(task => {
      if (task.completed && task.createdAt) {
        const date = task.createdAt.split('T')[0];
        counts[date] = (counts[date] || 0) + 1;
      }
    });

    return { days, counts };
  }, [allTasks]);

  // Función para determinar el color del cuadrito (intensidad)
  const getColor = (count) => {
    if (!count) return 'bg-white/5 border-transparent'; // Vacío
    if (count === 1) return 'bg-emerald-900/40 border-emerald-900/50'; // Poco
    if (count <= 3) return 'bg-emerald-600/60 border-emerald-600'; // Medio
    return 'bg-emerald-400 border-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]'; // ¡Fuego!
  };

  // --- CALCULADORAS ---
  const calculateProgress = (projectId) => {
    const pTasks = allTasks.filter(t => t.projectId === projectId && t.type === 'roadmap');
    if (pTasks.length === 0) return 0;
    const completed = pTasks.filter(t => t.completed).length;
    return Math.round((completed / pTasks.length) * 100);
  };

  const countPendingQuick = (projectId) => {
    return allTasks.filter(t => t.projectId === projectId && t.type === 'quick' && !t.completed).length;
  };

  return (
    <div className="flex-1 p-12 overflow-y-auto no-scrollbar h-full">
       <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex justify-between items-end">
             <div>
               <h2 className="text-4xl font-black tracking-tighter mb-2 text-white">
                 Hola, {user?.displayName?.split(' ')[0]}
               </h2>
               <p className="text-slate-500 font-medium">Aquí tienes la inteligencia de tu ecosistema.</p>
             </div>
             <div className="text-right hidden md:block">
               <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Racha Actual</p>
               <div className="flex items-center justify-end gap-2 text-emerald-400">
                 <Flame size={20} fill="currentColor" />
                 <span className="text-2xl font-black">Activo</span>
               </div>
             </div>
          </header>

          {/* --- HEATMAP SECTION (NUEVO) --- */}
          <div className="mb-12 bg-white/[0.02] border border-white/5 p-8 rounded-[32px]">
            <div className="flex items-center gap-3 mb-6">
              <Activity size={16} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actividad Reciente</span>
            </div>
            
            {/* Grid de cuadritos */}
            <div className="flex flex-wrap gap-1.5">
              {heatmapData.days.map((date) => (
                <div 
                  key={date}
                  title={`${date}: ${heatmapData.counts[date] || 0} tareas`}
                  className={`w-3 h-3 rounded-sm border ${getColor(heatmapData.counts[date])} transition-all duration-300 hover:scale-125`}
                />
              ))}
            </div>
            <div className="flex justify-end items-center gap-2 mt-4 text-[9px] text-slate-600 font-bold uppercase tracking-widest">
              <span>Menos</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-sm bg-white/5"></div>
                <div className="w-2 h-2 rounded-sm bg-emerald-900/40"></div>
                <div className="w-2 h-2 rounded-sm bg-emerald-600/60"></div>
                <div className="w-2 h-2 rounded-sm bg-emerald-400"></div>
              </div>
              <span>Más</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
             <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400"><Layers size={24} /></div>
                <div><p className="text-2xl font-black text-white">{projects.length}</p><p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Proyectos Activos</p></div>
             </div>
             <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400"><ListTodo size={24} /></div>
                <div><p className="text-2xl font-black text-white">{allTasks.filter(t => t.type === 'quick' && !t.completed).length}</p><p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Tareas Pendientes</p></div>
             </div>
          </div>

          <h3 className="text-xl font-black mt-16 mb-6 tracking-tight flex items-center gap-2"><Briefcase size={20} className="text-slate-500"/> Tus Proyectos</h3>

          {projects.length === 0 ? (
             <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center text-slate-500"><p>No tienes proyectos activos. Crea uno en la barra lateral.</p></div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(proj => {
                   const progress = calculateProgress(proj.id);
                   const pending = countPendingQuick(proj.id);
                   return (
                      <button key={proj.id} onClick={() => setActiveProject(proj)} className="group relative bg-white/5 hover:bg-white/10 border border-white/10 p-8 rounded-[32px] text-left transition-all hover:-translate-y-1 hover:shadow-2xl">
                         <div className="flex justify-between items-start mb-6">
                            <div className={`w-10 h-10 rounded-xl ${proj.color} shadow-lg shadow-current flex items-center justify-center`}><Code2 size={20} className="text-white" /></div>
                            <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-300">{progress}% Completo</div>
                         </div>
                         <h4 className="text-xl font-black mb-1">{proj.name}</h4>
                         <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6 mt-4"><div className={`h-full ${proj.color}`} style={{ width: `${progress}%` }} /></div>
                         <div className="flex items-center gap-2 text-xs text-slate-400 font-bold group-hover:text-white transition-colors">
                            <ListTodo size={14} /> {pending} tareas pendientes
                            <ArrowRight size={14} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                         </div>
                      </button>
                   )
                })}
             </div>
          )}
       </div>
    </div>
  );
}