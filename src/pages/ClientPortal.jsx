import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Briefcase, CheckCircle, Clock, Zap, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function ClientPortal() {
  const { projectId } = useParams(); // Capturamos el ID de la URL
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos del proyecto y sus hitos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Datos del Proyecto
        const docRef = doc(db, 'artifacts', 'fer-dev-studio', 'public', 'data', 'projects', projectId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
          
          // 2. Tareas (Roadmap)
          const q = query(
            collection(db, 'artifacts', 'fer-dev-studio', 'public', 'data', 'tasks'), 
            where("projectId", "==", projectId),
            where("type", "==", "roadmap") // Solo mostramos Roadmap al cliente, no las tareas menudas
          );
          const querySnapshot = await getDocs(q);
          const loadedTasks = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          // Ordenar por 'order'
          setTasks(loadedTasks.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)));
        }
      } catch (error) {
        console.error("Error cargando proyecto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-bold tracking-widest uppercase animate-pulse">Cargando status...</div>;
  
  if (!project) return <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white gap-4"><h1 className="text-2xl font-black">Proyecto no encontrado</h1><p className="text-slate-500">Verifica el enlace que te compartieron.</p></div>;

  // Cálculos
  const progress = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
        {/* Navbar Simple */}
        <nav className="border-b border-white/10 px-6 py-6 flex justify-between items-center bg-black/20 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <Link to="/" className="text-slate-500 hover:text-white transition-colors"><ArrowLeft size={20}/></Link>
                <div className="h-6 w-px bg-white/10 mx-2"></div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Client Portal</span>
                    <span className="font-black italic tracking-tighter">FerDev Studio</span>
                </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={14} /> Sitio Seguro
            </div>
        </nav>

        <main className="max-w-4xl mx-auto px-6 py-12">
            {/* Header del Proyecto */}
            <div className="mb-12 text-center md:text-left">
                <div className={`inline-flex p-3 rounded-2xl ${project.color} bg-opacity-10 border border-white/10 mb-6 shadow-[0_0_40px_rgba(255,255,255,0.05)]`}>
                    <Briefcase size={32} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">{project.name}</h1>
                <div className="flex flex-col md:flex-row gap-6 md:items-center text-slate-400 text-sm">
                    <p>Seguimiento en tiempo real del desarrollo.</p>
                    <div className="hidden md:block w-1 h-1 bg-slate-600 rounded-full"></div>
                    <p className="font-mono text-xs opacity-60">ID: {project.id}</p>
                </div>
            </div>

            {/* Status Card Principal */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-8 md:p-12 rounded-[40px] mb-12 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-64 h-64 ${project.color} blur-[150px] opacity-20 pointer-events-none rounded-full`}></div>
                
                <div className="flex justify-between items-end mb-4 relative z-10">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Estado Actual</p>
                        <div className="text-5xl font-black text-white">{progress}%</div>
                    </div>
                    <div className="text-right">
                        <Zap size={32} className={progress === 100 ? "text-emerald-400" : "text-amber-400 animate-pulse"} />
                    </div>
                </div>
                
                <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 relative z-10">
                    <div className={`h-full ${project.color} transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
                </div>
                <p className="mt-4 text-xs text-slate-500 font-medium text-right relative z-10">
                    {progress === 100 ? "Proyecto Finalizado y Entregado 🚀" : "Trabajando en la siguiente fase..."}
                </p>
            </div>

            {/* Roadmap Timeline */}
            <div className="relative border-l border-white/10 ml-4 md:ml-10 space-y-12 pb-12">
                {tasks.map((task, index) => (
                    <div key={task.id} className="relative pl-8 md:pl-12 group">
                        {/* Dot Connector */}
                        <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'bg-[#050505] border-slate-600'}`}></div>
                        
                        <div className={`transition-all ${task.completed ? 'opacity-100' : 'opacity-40'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fase 0{index + 1}</span>
                                {task.completed && <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded uppercase">Completado</span>}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{task.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                                {task.description || "Fase estructural del desarrollo del proyecto."}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="mt-20 pt-10 border-t border-white/5 text-center text-slate-600 text-xs">
                <p>© 2026 FerDev Studio. Todos los derechos reservados.</p>
            </footer>
        </main>
    </div>
  );
}