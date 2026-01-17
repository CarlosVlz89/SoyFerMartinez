import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query,
  where,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  Briefcase,
  Zap,
  Calendar,
  ListTodo,
  Flag,
  Target,
  Clock,
  AlertCircle,
  Layout,
  Code2,
  ArrowRight,
  LayoutDashboard,
  Layers,
  Activity,
  Home,        // Importado
  ArrowLeft    // Importado
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';

// --- CONFIGURACIÓN DE INFRAESTRUCTURA ---
const firebaseConfig = {
  apiKey: "AIzaSyACs8tUrsJMAhMG7QPiBWMaKA63cpvlFl0",
  authDomain: "fer-martinez-dev.firebaseapp.com",
  projectId: "fer-martinez-dev",
  storageBucket: "fer-martinez-dev.firebasestorage.app",
  messagingSenderId: "957743340960",
  appId: "1:957743340960:web:b9bf3b3a158ea37f2858c5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'fer-dev-studio';

export default function DevDashboard({ onClose }) {
  // --- 1. ESTADOS DEL SISTEMA ---
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]); 
  const [activeProject, setActiveProject] = useState(null);
   
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const [allTasks, setAllTasks] = useState([]); 
  
  // Estados para QUICK ACTIONS
  const [qaTitle, setQaTitle] = useState('');
  const [qaDesc, setQaDesc] = useState('');
  const [qaPriority, setQaPriority] = useState('Media');
  const [qaStatus, setQaStatus] = useState('Pendiente');
  const [qaDeadline, setQaDeadline] = useState('');

  // Estados para ROADMAP
  const [roadmapInput, setRoadmapInput] = useState('');

  const [loading, setLoading] = useState(true);
  const [focusTask, setFocusTask] = useState(null);

  // --- 2. EFECTOS (SINCRONIZACIÓN) ---

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const projectsRef = collection(db, 'artifacts', appId, 'public', 'data', 'projects');
    const q = query(projectsRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projsData);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) {
        setAllTasks([]);
        return;
    }
    const tasksRef = collection(db, 'artifacts', appId, 'public', 'data', 'tasks');
    const q = query(tasksRef, where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllTasks(tasksData);
    });
    return () => unsubscribe();
  }, [user]);

  // --- 3. HELPERS DE DATOS ---

  const projectTasks = activeProject 
    ? allTasks.filter(t => t.projectId === activeProject.id) 
    : [];

  const roadmapTasks = projectTasks
    .filter(t => t.type === 'roadmap')
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.title.localeCompare(b.title));

  const quickTasks = projectTasks
    .filter(t => t.type === 'quick')
    .sort((a, b) => {
       const statusOrder = { 'En Proceso': 0, 'Pendiente': 1, 'Bloqueado': 2 };
       return (statusOrder[a.status] || 9) - (statusOrder[b.status] || 9);
    });

  const calculateProgress = (projectId) => {
      const pTasks = allTasks.filter(t => t.projectId === projectId && t.type === 'roadmap');
      if (pTasks.length === 0) return 0;
      const completed = pTasks.filter(t => t.completed).length;
      return Math.round((completed / pTasks.length) * 100);
  };

  const countPendingQuick = (projectId) => {
      return allTasks.filter(t => t.projectId === projectId && t.type === 'quick' && !t.completed).length;
  };

  // --- 4. FUNCIONES ---

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try { await signInWithPopup(auth, provider); } catch (err) { console.error(err); }
  };

  const handleLogout = async () => { try { await signOut(auth); } catch (err) { console.error(err); } };

  const addProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim() || !user) return;
    
    const colors = ['bg-pink-500', 'bg-blue-600', 'bg-teal-500', 'bg-indigo-500', 'bg-amber-500'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    const selectedColor = colors[randomIndex];

    try {
      const projectsRef = collection(db, 'artifacts', appId, 'public', 'data', 'projects');
      const docRef = await addDoc(projectsRef, {
        name: newProjectName,
        color: selectedColor,
        glow: `shadow-${selectedColor.split('-')[1]}-500/20`,
        createdAt: new Date().toISOString(),
        userId: user.uid,
        links: [] 
      });

      const tasksRef = collection(db, 'artifacts', appId, 'public', 'data', 'tasks');
      const masterPhases = [
        { title: '📥 Fase 1: Briefing y levantamiento de requerimientos' },
        { title: '🎨 Fase 2: Diseño de interfaz y UX' },
        { title: '⚙️ Fase 3: Configuración de base de datos (Firebase)' },
        { title: '🚀 Fase 4: Desarrollo de funcionalidades core' },
        { title: '🧪 Fase 5: Pruebas y despliegue final' }
      ];

      for (let i = 0; i < masterPhases.length; i++) {
        await addDoc(tasksRef, {
          title: masterPhases[i].title,
          description: 'Hito maestro del proyecto.',
          completed: false,
          priority: 'Alta',
          status: 'Pendiente',
          projectId: docRef.id,
          createdAt: new Date().toISOString(),
          userId: user.uid,
          type: 'roadmap',
          order: i 
        });
      }

      setNewProjectName('');
      setIsAddingProject(false);
    } catch (err) { console.error("Error al crear proyecto:", err); }
  };

  const deleteProject = async (projectId, projectName) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${projectName}"?`)) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', projectId));
      if (activeProject?.id === projectId) setActiveProject(null);
    } catch (err) { console.error("Error:", err); }
  };

  const addLink = async (e) => {
    e.preventDefault();
    if (!newLinkLabel.trim() || !newLinkUrl.trim() || !activeProject) return;
    const url = newLinkUrl.toLowerCase();
    const icon = url.includes('github') ? '💻' : url.includes('firebase') ? '🔥' : url.includes('drive') || url.includes('google') ? '📂' : '🔗';
    const newLink = { label: newLinkLabel, url: newLinkUrl, icon };
    try {
      const projectDoc = doc(db, 'artifacts', appId, 'public', 'data', 'projects', activeProject.id);
      const currentLinks = activeProject.links || [];
      await updateDoc(projectDoc, { links: [...currentLinks, newLink] });
      setNewLinkLabel('');
      setNewLinkUrl('');
      setIsAddingLink(false);
    } catch (err) { console.error(err); }
  };

  const deleteLink = async (index) => {
    if (!activeProject) return;
    const updatedLinks = [...activeProject.links];
    updatedLinks.splice(index, 1);
    try {
      const projectDoc = doc(db, 'artifacts', appId, 'public', 'data', 'projects', activeProject.id);
      await updateDoc(projectDoc, { links: updatedLinks });
    } catch (err) { console.error(err); }
  };

  const addQuickTask = async (e) => {
    e.preventDefault();
    if (!qaTitle.trim() || !user || !activeProject) return;
    try {
      const tasksRef = collection(db, 'artifacts', appId, 'public', 'data', 'tasks');
      await addDoc(tasksRef, {
        title: qaTitle,
        description: qaDesc,
        completed: false,
        priority: qaPriority,
        status: qaStatus,
        deadline: qaDeadline,
        projectId: activeProject.id,
        createdAt: new Date().toISOString(),
        userId: user.uid,
        type: 'quick'
      });
      setQaTitle('');
      setQaDesc('');
      setQaDeadline('');
      setQaStatus('Pendiente');
    } catch (err) { console.error(err); }
  };

  const addRoadmapTask = async (e) => {
    e.preventDefault();
    if (!roadmapInput.trim() || !user || !activeProject) return;
    try {
      const tasksRef = collection(db, 'artifacts', appId, 'public', 'data', 'tasks');
      await addDoc(tasksRef, {
        title: roadmapInput,
        completed: false,
        projectId: activeProject.id,
        createdAt: new Date().toISOString(),
        userId: user.uid,
        type: 'roadmap',
        order: 99 
      });
      setRoadmapInput('');
    } catch (err) { console.error(err); }
  };

  const toggleTask = async (task) => {
    try {
      const taskDoc = doc(db, 'artifacts', appId, 'public', 'data', 'tasks', task.id);
      await updateDoc(taskDoc, { completed: !task.completed });
    } catch (err) { console.error(err); }
  };

  const cycleStatus = async (task) => {
    if (task.completed) return;
    const statuses = ['Pendiente', 'En Proceso', 'Bloqueado'];
    const currentIdx = statuses.indexOf(task.status || 'Pendiente');
    const nextStatus = statuses[(currentIdx + 1) % statuses.length];
    try {
      const taskDoc = doc(db, 'artifacts', appId, 'public', 'data', 'tasks', task.id);
      await updateDoc(taskDoc, { status: nextStatus });
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (id) => {
    try {
      const taskDoc = doc(db, 'artifacts', appId, 'public', 'data', 'tasks', id);
      await deleteDoc(taskDoc);
    } catch (err) { console.error(err); }
  };

  const isOverdue = (date) => {
    if (!date) return false;
    return new Date(date) < new Date().setHours(0,0,0,0);
  };

  const projectProgress = activeProject ? calculateProgress(activeProject.id) : 0;

  const statusData = [
    { name: 'Pendientes', value: quickTasks.filter(t => !t.completed).length, color: '#6366f1' },
    { name: 'Completadas', value: quickTasks.filter(t => t.completed).length, color: '#10b981' },
  ].filter(d => d.value > 0);

  const priorityData = [
    { name: 'Alta', cantidad: quickTasks.filter(t => t.priority === 'Alta' && !t.completed).length, fill: '#ec4899' },
    { name: 'Media', cantidad: quickTasks.filter(t => t.priority === 'Media' && !t.completed).length, fill: '#f59e0b' },
    { name: 'Baja', cantidad: quickTasks.filter(t => t.priority === 'Baja' && !t.completed).length, fill: '#10b981' },
  ];

  if (loading) return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  // --- LOGIN SCREEN ---
  if (!user) return (
    <div className="fixed inset-0 z-[150] bg-[#050505] flex items-center justify-center p-4 overflow-hidden font-sans text-left">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[10%] right-[20%] w-[30vw] h-[30vw] bg-pink-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* NAV BAR LOGIN (NUEVO) */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
         <div className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-white">
             <Zap className="text-indigo-500" fill="currentColor" /> FerDev
         </div>
         {onClose && (
             <button 
                onClick={onClose} 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all"
             >
                <Home size={14} /> Volver al Sitio
             </button>
         )}
      </nav>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-6 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
               <Zap size={32} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">FerDev Studio</h1>
            <p className="text-slate-500 font-medium tracking-wide text-sm">Systematic Creativity & Intelligence</p>
          </div>
          <button onClick={handleGoogleLogin} className="w-full group relative flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-xl overflow-hidden">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition-all" alt="G" />
            <span>Iniciar Sesión</span>
            <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );

  // --- DASHBOARD ---
  return (
    <div className="fixed inset-0 z-[100] flex h-screen bg-[#050505] text-white font-sans overflow-hidden text-left">
      <div className="absolute top-0 left-[20%] w-[30%] h-[30%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[20%] w-[30%] h-[30%] bg-pink-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 hidden md:flex flex-col relative z-20 shrink-0">
        
        {/* BOTÓN VOLVER AL SITIO (NUEVO) */}
        {onClose && (
            <div className="px-8 pt-6">
                <button 
                    onClick={onClose} 
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group w-full"
                >
                    <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                        <ArrowLeft size={14} />
                    </div>
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
            <button onClick={() => setIsAddingProject(!isAddingProject)} className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-indigo-400 transition-colors">
              <Plus size={14} />
            </button>
          </div>

          {isAddingProject && (
            <form onSubmit={addProject} className="px-2 mb-4 animate-in fade-in slide-in-from-top-2">
              <input autoFocus type="text" placeholder="Nombre proyecto..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
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
                <button onClick={(e) => { e.stopPropagation(); deleteProject(proj.id, proj.name); }} className="absolute right-3 opacity-0 group-hover:opacity-100 p-1.5 text-slate-600 hover:text-red-400 transition-all rounded-lg hover:bg-red-500/10">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-4 mb-4 pt-4 border-t border-white/5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Recursos</span>
            {activeProject && (
              <button onClick={() => setIsAddingLink(!isAddingLink)} className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-indigo-400 transition-colors">
                <Plus size={14} />
              </button>
            )}
          </div>

          {isAddingLink && (
            <form onSubmit={addLink} className="px-2 mb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
              <input autoFocus type="text" placeholder="Nombre" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none" value={newLinkLabel} onChange={(e) => setNewLinkLabel(e.target.value)} />
              <input type="url" placeholder="URL" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} />
              <button type="submit" className="w-full py-2 bg-indigo-600 rounded-xl text-[9px] font-black uppercase">Guardar Link</button>
            </form>
          )}

          <div className="space-y-2 px-2">
            {activeProject?.links?.map((link, idx) => (
              <div key={idx} className="group relative flex items-center">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center gap-3 px-3 py-2.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest">
                  <span>{link.icon}</span> {link.label}
                </a>
                <button onClick={() => deleteLink(idx)} className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-400 transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-6">
          <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-[24px] border border-white/5 backdrop-blur-md">
            <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-white/20" />
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black truncate uppercase tracking-wider">{user.displayName}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-white" title="Cerrar Sesión"><LogOut size={14}/></button>
          </div>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 text-left">
        
        {/* CONDICIONAL: ¿HAY PROYECTO ACTIVO? */}
        {activeProject ? (
          <>
            <header className="h-28 bg-transparent border-b border-white/5 flex flex-col justify-center px-10 text-left shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-left">
                  <div className={`w-12 h-12 rounded-2xl ${activeProject.color} bg-opacity-10 flex items-center justify-center border border-white/10 shadow-inner`}>
                      <Briefcase size={22} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-black text-2xl tracking-tighter uppercase leading-none">{activeProject.name}</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic">
                      Status: {projectProgress === 100 ? 'Finalizado' : 'En Ejecución'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-right">
                   <div className="text-right">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Carga de Trabajo</span>
                      <span className="text-xl font-black text-white">{projectProgress}%</span>
                   </div>
                </div>
              </div>

              {/* BARRA DE PROGRESO */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full ${activeProject.color} transition-all duration-1000 ease-out`}
                  style={{ 
                    width: `${projectProgress}%`,
                    boxShadow: `0 0-15px ${activeProject.color === 'bg-pink-500' ? 'rgba(236,72,153,0.5)' : 'rgba(99,102,241,0.5)'}`
                  }}
                />
              </div>
            </header>
            
            <div className="flex flex-1 overflow-hidden">
                {/* --- ZONA CENTRAL: QUICK ACTIONS --- */}
                <div className="flex-1 overflow-y-auto p-10 bg-transparent text-left no-scrollbar">
                    <div className="max-w-4xl mx-auto text-left pb-20">
                    
                        {/* Banner de Foco */}
                        <div className={`mb-10 p-8 rounded-[40px] border transition-all duration-500 flex items-center justify-between ${focusTask ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/10'}`}>
                            <div className="text-left">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-2">Foco del Día</p>
                                <h3 className="text-2xl font-black text-white tracking-tight">{focusTask ? focusTask.title : "Selecciona una tarea rápida para enfocarte"}</h3>
                                {focusTask?.description && <p className="text-slate-400 text-sm mt-2 font-medium">{focusTask.description}</p>}
                            </div>
                            {focusTask && (
                                <button onClick={() => setFocusTask(null)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">Liberar</button>
                            )}
                        </div>
                    
                        {/* Formulario QUICK ACTIONS */}
                        <form onSubmit={addQuickTask} className="mb-12 text-left">
                            <div className="flex flex-col gap-4 bg-white/[0.02] p-8 rounded-[40px] border border-white/5 backdrop-blur-md">
                                <div className="flex items-center gap-2 mb-2">
                                     <ListTodo size={14} className="text-emerald-400" />
                                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Nueva Acción Rápida</span>
                                </div>
                                <div className="space-y-4 text-left">
                                    <input type="text" placeholder="¿Qué necesitas hacer hoy?" className="w-full bg-transparent text-xl font-black text-white placeholder-slate-600 focus:outline-none" value={qaTitle} onChange={(e) => setQaTitle(e.target.value)} />
                                    <textarea placeholder="Detalles operativos..." className="w-full bg-transparent text-sm text-slate-400 placeholder-slate-700 focus:outline-none resize-none min-h-[60px]" value={qaDesc} onChange={(e) => setQaDesc(e.target.value)} />
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                                    <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/5">
                                        {['Baja', 'Media', 'Alta'].map((p) => (
                                        <button key={p} type="button" onClick={() => setQaPriority(p)} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${qaPriority === p ? 'bg-white/20 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{p}</button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/5">
                                        {['Pendiente', 'En Proceso', 'Bloqueado'].map((s) => (
                                        <button key={s} type="button" onClick={() => setQaStatus(s)} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${qaStatus === s ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500 hover:text-slate-300'}`}>{s}</button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                        <Calendar size={14} className="text-emerald-400" />
                                        <input type="date" className="bg-transparent text-[10px] font-black uppercase text-slate-300 focus:outline-none [color-scheme:dark]" value={qaDeadline} onChange={(e) => setQaDeadline(e.target.value)} />
                                    </div>
                                    <button type="submit" className="ml-auto bg-emerald-500 text-black px-8 py-2.5 rounded-full font-black text-[10px] uppercase hover:bg-emerald-400 hover:scale-105 transition-all">Añadir Tarea</button>
                                </div>
                            </div>
                        </form>

                        {/* Lista QUICK ACTIONS */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden mb-12">
                            <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center text-left">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Quick Actions (Daily)</span>
                                <span className="text-[10px] font-bold bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-300 border border-white/5">{quickTasks.length} activas</span>
                            </div>
                            
                            <div className="divide-y divide-white/5">
                                {quickTasks.length === 0 ? (
                                    <div className="p-24 text-center">
                                        <CheckCircle className="mx-auto mb-6 text-white/5" size={80} />
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Bandeja limpia</p>
                                    </div>
                                ) : (
                                    quickTasks.map((task) => (
                                        <div key={task.id} className={`group flex items-start p-6 hover:bg-white/[0.02] transition-all border-l-4 ${task.completed ? 'opacity-40 border-transparent' : task.priority === 'Alta' ? 'border-pink-500/50' : 'border-emerald-500/50'}`}>
                                            <button onClick={() => toggleTask(task)} className={`w-6 h-6 mt-1 rounded-lg border flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 bg-transparent'}`}>
                                                {task.completed && <CheckCircle size={14} className="text-black" />}
                                            </button>

                                            <div className="flex flex-col flex-1 ml-4 text-left">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className={`font-bold text-slate-200 ${task.completed ? 'line-through text-slate-500' : ''}`}>{task.title}</span>
                                                    {!task.completed && (
                                                        <button 
                                                            onClick={() => cycleStatus(task)}
                                                            className={`text-[8px] font-black px-2 py-0.5 rounded-full border border-white/5 uppercase tracking-wider hover:scale-105 transition-transform ${task.status === 'En Proceso' ? 'bg-blue-500/20 text-blue-300' : task.status === 'Bloqueado' ? 'bg-red-500/20 text-red-300' : 'bg-slate-500/20 text-slate-400'}`}
                                                        >
                                                            {task.status || 'Pendiente'}
                                                        </button>
                                                    )}
                                                    {!task.completed && task.priority === 'Alta' && <Flag size={12} className="text-pink-500 fill-pink-500" />}
                                                </div>
                                                
                                                {task.description && <p className="text-xs text-slate-500 mb-2">{task.description}</p>}
                                                
                                                {task.deadline && !task.completed && (
                                                    <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest ${isOverdue(task.deadline) ? 'text-red-400 animate-pulse' : 'text-slate-600'}`}>
                                                        {isOverdue(task.deadline) ? <AlertCircle size={10} /> : <Clock size={10} />}
                                                        {new Date(task.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                        {isOverdue(task.deadline) && " (Vencida)"}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                                                {!task.completed && <button onClick={() => setFocusTask(task)} className="p-2 text-slate-500 hover:text-emerald-400"><Zap size={16} /></button>}
                                                <button onClick={() => deleteTask(task.id)} className="p-2 text-slate-600 hover:text-red-400"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 text-left">
                            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 h-[300px] flex flex-col text-left">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Estado Quick Actions</p>
                                <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">{statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke="none" />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }} /><Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} /></PieChart></ResponsiveContainer>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 h-[300px] flex flex-col text-left">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Prioridad Quick Actions</p>
                                <ResponsiveContainer width="100%" height="100%"><BarChart data={priorityData} layout="vertical" margin={{ left: -20, right: 20 }}><XAxis type="number" hide /><YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} /><Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} /><Bar dataKey="cantidad" radius={[0, 10, 10, 0]} barSize={18} /></BarChart></ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- PANEL DERECHO: ROADMAP --- */}
                <aside className="w-80 border-l border-white/5 bg-white/[0.01] flex flex-col shrink-0">
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Target size={16} className="text-indigo-400" />
                            <h3 className="text-sm font-black text-white uppercase tracking-wider">Roadmap</h3>
                        </div>
                        <p className="text-[9px] text-slate-500">Hitos del proyecto. Mueven el progreso.</p>
                    </div>

                    <div className="p-4">
                        <form onSubmit={addRoadmapTask} className="relative">
                            <input 
                                type="text" 
                                placeholder="+ Nuevo hito..." 
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-3 pr-8 py-3 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                                value={roadmapInput}
                                onChange={(e) => setRoadmapInput(e.target.value)}
                            />
                        </form>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 no-scrollbar">
                        {roadmapTasks.length === 0 ? (
                            <p className="text-center text-[10px] text-slate-600 italic mt-10">Sin hitos definidos</p>
                        ) : (
                            roadmapTasks.map(rt => (
                                <div key={rt.id} className="group flex items-center gap-3 p-3 bg-transparent rounded-xl border border-transparent hover:bg-white/5 transition-all">
                                    <button 
                                        onClick={() => toggleTask(rt)}
                                        className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${rt.completed ? 'bg-indigo-500 border-indigo-500' : 'border-indigo-500/30 hover:border-indigo-400'}`}
                                    >
                                        {rt.completed && <CheckCircle size={12} className="text-white" />}
                                    </button>
                                    <span className={`flex-1 text-xs font-bold ${rt.completed ? 'text-slate-600 line-through' : 'text-slate-300'}`}>
                                        {rt.title}
                                    </span>
                                    <button onClick={() => deleteTask(rt.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-opacity">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </aside>
            </div>
          </>
        ) : (
          
          // --- VISTA RESUMEN (PANORAMA GENERAL) ---
          <div className="flex-1 p-12 overflow-y-auto no-scrollbar">
             <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                   <h2 className="text-4xl font-black tracking-tighter mb-2">Bienvenido, {user.displayName.split(' ')[0]}</h2>
                   <p className="text-slate-500 font-medium">Aquí tienes un resumen ejecutivo de tu ecosistema.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {/* STATS CARDS */}
                   <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                         <Layers size={24} />
                      </div>
                      <div>
                         <p className="text-2xl font-black text-white">{projects.length}</p>
                         <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Proyectos Activos</p>
                      </div>
                   </div>
                   <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                         <Activity size={24} />
                      </div>
                      <div>
                         <p className="text-2xl font-black text-white">{allTasks.filter(t => t.type === 'quick' && !t.completed).length}</p>
                         <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Tareas Pendientes</p>
                      </div>
                   </div>
                </div>

                <h3 className="text-xl font-black mt-16 mb-6 tracking-tight flex items-center gap-2">
                   <Briefcase size={20} className="text-slate-500"/>
                   Tus Proyectos
                </h3>

                {projects.length === 0 ? (
                   <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center text-slate-500">
                      <p>No tienes proyectos activos. Crea uno en la barra lateral.</p>
                   </div>
                ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map(proj => {
                         const progress = calculateProgress(proj.id);
                         const pending = countPendingQuick(proj.id);
                         
                         return (
                            <button 
                               key={proj.id}
                               onClick={() => setActiveProject(proj)}
                               className="group relative bg-white/5 hover:bg-white/10 border border-white/10 p-8 rounded-[32px] text-left transition-all hover:-translate-y-1 hover:shadow-2xl"
                            >
                               <div className="flex justify-between items-start mb-6">
                                  <div className={`w-10 h-10 rounded-xl ${proj.color} shadow-lg shadow-current flex items-center justify-center`}>
                                     <Code2 size={20} className="text-white" />
                                  </div>
                                  <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-300">
                                     {progress}% Completo
                                  </div>
                               </div>
                               
                               <h4 className="text-xl font-black mb-1">{proj.name}</h4>
                               <p className="text-xs text-slate-500 font-medium mb-6">Última actualización: Hoy</p>
                               
                               {/* Mini Barra de Progreso */}
                               <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6">
                                  <div className={`h-full ${proj.color}`} style={{ width: `${progress}%` }} />
                               </div>

                               <div className="flex items-center gap-2 text-xs text-slate-400 font-bold group-hover:text-white transition-colors">
                                  <ListTodo size={14} />
                                  {pending} tareas pendientes
                                  <ArrowRight size={14} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                               </div>
                            </button>
                         )
                      })}
                   </div>
                )}
             </div>
          </div>
        )}

      </main>
    </div>
  );
}

function LogOut(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" x2="9" y1="12" y2="12"/>
    </svg>
  )
}