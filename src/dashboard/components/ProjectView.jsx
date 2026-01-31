import React, { useState, useRef, useEffect } from 'react';
import { 
  Briefcase, Zap, Calendar, ListTodo, Flag, Target, Clock, AlertCircle, 
  Trash2, CheckCircle, Plus, Edit2, Save, X, GripVertical, Layers, Archive, 
  Book, Palette, Key, FileText, Copy, LayoutTemplate
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function ProjectView({ 
  project, 
  tasks, 
  onAddTask, 
  onToggleTask, 
  onDeleteTask, 
  onCycleStatus,
  onUpdateTask,
  onReorderTasks,
  onUpdateProject // Nueva prop para guardar la wiki
}) {
  // --- ESTADOS DE VISTA ---
  const [activeView, setActiveView] = useState('board'); // 'board' | 'wiki'
  
  // Estados Tareas
  const [qaTitle, setQaTitle] = useState('');
  const [qaDesc, setQaDesc] = useState('');
  const [qaPriority, setQaPriority] = useState('Media');
  const [qaStatus, setQaStatus] = useState('Pendiente');
  const [qaDeadline, setQaDeadline] = useState('');
  const [roadmapInput, setRoadmapInput] = useState('');
  const [isAddingRoadmap, setIsAddingRoadmap] = useState(false);
  const [focusTask, setFocusTask] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('todo'); 

  // --- ESTADOS WIKI ---
  const [wikiNotes, setWikiNotes] = useState(project.wiki?.notes || '');
  const [newColor, setNewColor] = useState('#000000');
  const [newColorName, setNewColorName] = useState('');
  const [newCredKey, setNewCredKey] = useState('');
  const [newCredValue, setNewCredValue] = useState('');

  // Sincronizar wiki local con DB cuando cambia el proyecto
  useEffect(() => {
    setWikiNotes(project.wiki?.notes || '');
  }, [project.id]);

  // --- HANDLERS WIKI ---
  const saveWikiNotes = () => {
    onUpdateProject(project.id, { 'wiki.notes': wikiNotes });
  };

  const addColor = () => {
    if (newColorName) {
      const currentColors = project.wiki?.colors || [];
      onUpdateProject(project.id, { 'wiki.colors': [...currentColors, { name: newColorName, code: newColor }] });
      setNewColorName('');
    }
  };

  const deleteColor = (index) => {
    const currentColors = [...(project.wiki?.colors || [])];
    currentColors.splice(index, 1);
    onUpdateProject(project.id, { 'wiki.colors': currentColors });
  };

  const addCredential = () => {
    if (newCredKey && newCredValue) {
      const currentCreds = project.wiki?.credentials || [];
      onUpdateProject(project.id, { 'wiki.credentials': [...currentCreds, { key: newCredKey, value: newCredValue }] });
      setNewCredKey(''); setNewCredValue('');
    }
  };

  const deleteCredential = (index) => {
    const currentCreds = [...(project.wiki?.credentials || [])];
    currentCreds.splice(index, 1);
    onUpdateProject(project.id, { 'wiki.credentials': currentCreds });
  };

  // --- LÓGICA TAREAS ---
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [localQuickTasks, setLocalQuickTasks] = useState([]);

  const roadmapTasks = tasks
    .filter(t => t.type === 'roadmap')
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.title.localeCompare(b.title));

  useEffect(() => {
    const qt = tasks
      .filter(t => t.type === 'quick')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    setLocalQuickTasks(qt);
  }, [tasks]);

  const displayedTasks = localQuickTasks.filter(t => activeTab === 'todo' ? !t.completed : t.completed);

  const handleDragStart = (e, position) => { dragItem.current = position; e.target.classList.add('opacity-50'); };
  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
    const newList = [...displayedTasks];
    const dragItemContent = newList[dragItem.current];
    newList.splice(dragItem.current, 1);
    newList.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = position;
    dragOverItem.current = position;
  };
  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');
    dragItem.current = null;
    dragOverItem.current = null;
    if (activeTab === 'todo') onReorderTasks(displayedTasks); 
  };

  const projectProgress = roadmapTasks.length > 0 
    ? Math.round((roadmapTasks.filter(t => t.completed).length / roadmapTasks.length) * 100) : 0;

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const [y, m, d] = dateString.split('-');
    const deadline = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0,0,0,0);
    return deadline < today;
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-');
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (qaTitle.trim()) {
      onAddTask({ title: qaTitle, description: qaDesc, priority: qaPriority, status: qaStatus, deadline: qaDeadline, type: 'quick' });
      setQaTitle(''); setQaDesc(''); setQaDeadline(''); setQaStatus('Pendiente');
    }
  };

  const handleRoadmapSubmit = (e) => {
    e.preventDefault();
    if (roadmapInput.trim()) {
      onAddTask({ title: roadmapInput, type: 'roadmap', order: 99 });
      setRoadmapInput('');
      setIsAddingRoadmap(false);
    }
  };

  const startEditing = (task) => { setEditingId(task.id); setEditForm({ ...task }); };
  const cancelEditing = () => { setEditingId(null); setEditForm({}); };
  const saveEditing = () => { if (editForm.title.trim()) { onUpdateTask(editingId, editForm); setEditingId(null); } };

  const statusData = [ { name: 'Pendientes', value: localQuickTasks.filter(t => !t.completed).length, color: '#6366f1' }, { name: 'Completadas', value: localQuickTasks.filter(t => t.completed).length, color: '#10b981' } ].filter(d => d.value > 0);
  const priorityData = [ { name: 'Alta', cantidad: localQuickTasks.filter(t => t.priority === 'Alta' && !t.completed).length, fill: '#ec4899' }, { name: 'Media', cantidad: localQuickTasks.filter(t => t.priority === 'Media' && !t.completed).length, fill: '#f59e0b' }, { name: 'Baja', cantidad: localQuickTasks.filter(t => t.priority === 'Baja' && !t.completed).length, fill: '#10b981' } ];

  return (
    <div className="flex flex-col h-full overflow-hidden relative z-10 text-left">
        {/* --- HEADER --- */}
        <header className="h-24 bg-transparent flex flex-col justify-center px-10 text-left shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4 text-left">
              <div className={`w-10 h-10 rounded-xl ${project.color} bg-opacity-10 flex items-center justify-center border border-white/10 shadow-inner`}><Briefcase size={20} className="text-white" /></div>
              <div className="text-left">
                <h2 className="font-black text-2xl tracking-tighter uppercase leading-none">{project.name}</h2>
              </div>
            </div>
            
            {/* NAVEGACIÓN DE VISTAS */}
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                <button onClick={() => setActiveView('board')} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'board' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                    <LayoutTemplate size={14} /> Tablero
                </button>
                <button onClick={() => setActiveView('wiki')} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'wiki' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                    <Book size={14} /> Bitácora
                </button>
            </div>

            <div className="text-right">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Progreso Global</span>
                <span className="text-lg font-black text-white">{projectProgress}%</span>
            </div>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div className={`h-full ${project.color} transition-all duration-1000 ease-out`} style={{ width: `${projectProgress}%`, boxShadow: `0 0-15px rgba(255,255,255,0.3)` }} />
          </div>
        </header>

        {/* ======================= VISTA: TABLERO ======================= */}
        {activeView === 'board' && (
            <>
                {/* ROADMAP HORIZONTAL */}
                <div className="px-10 py-6 border-b border-white/5 bg-black/20 backdrop-blur-sm animate-in fade-in">
                    <div className="flex items-center gap-2 mb-4">
                        <Target size={14} className="text-indigo-400" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Roadmap & Hitos</h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {roadmapTasks.map((rt, index) => (
                            <div key={rt.id} className={`flex-shrink-0 w-64 p-4 rounded-2xl border transition-all ${rt.completed ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Fase 0{index + 1}</span>
                                    <button onClick={() => onToggleTask(rt)} className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${rt.completed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600 hover:border-indigo-400'}`}>
                                        {rt.completed && <CheckCircle size={12} className="text-white" />}
                                    </button>
                                </div>
                                {editingId === rt.id ? (
                                    <div className="flex gap-1"><input className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} autoFocus /><button onClick={saveEditing}><Save size={12} className="text-emerald-400" /></button></div>
                                ) : (
                                    <h4 className={`text-sm font-bold leading-tight ${rt.completed ? 'text-slate-500 line-through' : 'text-white'}`}>{rt.title}</h4>
                                )}
                                <div className="mt-3 flex justify-end gap-2 opacity-0 hover:opacity-100 transition-opacity">
                                    {!rt.completed && <button onClick={() => startEditing(rt)}><Edit2 size={12} className="text-indigo-400" /></button>}
                                    <button onClick={() => onDeleteTask(rt.id)}><Trash2 size={12} className="text-slate-600 hover:text-red-400" /></button>
                                </div>
                            </div>
                        ))}
                        {!isAddingRoadmap ? (
                            <button onClick={() => setIsAddingRoadmap(true)} className="flex-shrink-0 w-12 flex items-center justify-center rounded-2xl border border-dashed border-white/20 hover:border-indigo-400 hover:bg-white/5 transition-all text-slate-500 hover:text-indigo-400"><Plus size={20} /></button>
                        ) : (
                            <form onSubmit={handleRoadmapSubmit} className="flex-shrink-0 w-64 p-4 rounded-2xl bg-white/5 border border-indigo-500/50 animate-in fade-in zoom-in-95">
                                <input autoFocus type="text" placeholder="Nombre de la fase..." className="w-full bg-transparent text-sm font-bold text-white placeholder-slate-600 focus:outline-none mb-3" value={roadmapInput} onChange={(e) => setRoadmapInput(e.target.value)} />
                                <div className="flex justify-end gap-2"><button type="button" onClick={() => setIsAddingRoadmap(false)} className="p-1 text-slate-500 hover:text-white"><X size={14}/></button><button type="submit" className="px-3 py-1 bg-indigo-600 rounded-lg text-[9px] font-black uppercase text-white">Crear</button></div>
                            </form>
                        )}
                    </div>
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="flex-1 overflow-y-auto p-10 bg-transparent text-left no-scrollbar animate-in fade-in slide-in-from-bottom-4">
                    <div className="max-w-5xl mx-auto text-left pb-20">
                        {activeTab === 'todo' && focusTask && (
                        <div className="mb-10 p-6 rounded-[32px] border border-emerald-500/30 bg-emerald-500/10 transition-all duration-500 flex items-center justify-between">
                            <div><p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-1">Foco del Día</p><h3 className="text-xl font-bold text-white">{focusTask.title}</h3></div>
                            <button onClick={() => setFocusTask(null)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase">Liberar</button>
                        </div>
                        )}

                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                {activeTab === 'todo' && (
                                <form onSubmit={handleQuickSubmit} className="bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-3">
                                            <input type="text" placeholder="Nueva tarea rápida..." className="w-full bg-transparent text-lg font-bold text-white placeholder-slate-600 focus:outline-none" value={qaTitle} onChange={(e) => setQaTitle(e.target.value)} />
                                            <input type="text" placeholder="Detalles (opcional)..." className="w-full bg-transparent text-sm text-slate-400 placeholder-slate-700 focus:outline-none" value={qaDesc} onChange={(e) => setQaDesc(e.target.value)} />
                                        </div>
                                        <button type="submit" className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-black hover:scale-105 transition-all"><Plus size={24} /></button>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 overflow-x-auto">
                                        {['Baja', 'Media', 'Alta'].map((p) => <button key={p} type="button" onClick={() => setQaPriority(p)} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${qaPriority === p ? 'bg-white/20 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{p}</button>)}
                                        <div className="w-px h-4 bg-white/10" />
                                        <input type="date" className="bg-transparent text-[10px] font-black uppercase text-slate-500 focus:outline-none [color-scheme:dark]" value={qaDeadline} onChange={(e) => setQaDeadline(e.target.value)} />
                                    </div>
                                </form>
                                )}

                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden min-h-[400px]">
                                    <div className="p-4 border-b border-white/5 flex gap-4">
                                        <button onClick={() => setActiveTab('todo')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'todo' ? 'bg-white/10 text-white' : 'text-slate-500'}`}><Layers size={14} /> Pendientes</button>
                                        <button onClick={() => setActiveTab('done')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'done' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500'}`}><Archive size={14} /> Historial</button>
                                    </div>
                                    <div className="divide-y divide-white/5">
                                        {displayedTasks.length === 0 ? <div className="p-12 text-center text-slate-600 text-xs uppercase tracking-widest">Sin tareas aquí</div> : 
                                            displayedTasks.map((task, index) => (
                                                <div 
                                                key={task.id} 
                                                className={`group flex items-start p-5 hover:bg-white/[0.02] transition-all border-l-2 ${task.completed ? 'border-transparent opacity-50' : task.priority === 'Alta' ? 'border-pink-500' : 'border-emerald-500'} ${activeTab === 'todo' ? 'cursor-grab' : ''}`}
                                                draggable={activeTab === 'todo'}
                                                onDragStart={(e) => activeTab === 'todo' && handleDragStart(e, index)}
                                                onDragEnter={(e) => activeTab === 'todo' && handleDragEnter(e, index)}
                                                onDragEnd={handleDragEnd}
                                                onDragOver={(e) => e.preventDefault()}
                                                >
                                                    {activeTab === 'todo' && <div className="mr-3 mt-1 text-slate-700 group-hover:text-slate-500"><GripVertical size={14} /></div>}
                                                    {editingId === task.id ? (
                                                        <div className="flex-1 space-y-2"><input className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white font-bold" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} autoFocus /><div className="flex gap-2 justify-end"><button onClick={saveEditing}><Save size={14} className="text-emerald-400"/></button><button onClick={cancelEditing}><X size={14} className="text-slate-400"/></button></div></div>
                                                    ) : (
                                                        <>
                                                        <button onClick={() => onToggleTask(task)} className={`mt-0.5 mr-3 w-5 h-5 rounded border border-slate-600 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'hover:bg-white/10'}`}>{task.completed && <CheckCircle size={12} className="text-black" />}</button>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`text-sm font-bold ${task.completed ? 'line-through text-slate-600' : 'text-slate-200'}`}>{task.title}</span>
                                                                {!task.completed && <button onClick={() => onCycleStatus(task)} className="text-[8px] font-black px-2 py-0.5 rounded border border-white/5 uppercase text-slate-400 hover:text-white">{task.status || 'Pendiente'}</button>}
                                                                {!task.completed && task.priority === 'Alta' && <Flag size={10} className="text-pink-500 fill-pink-500" />}
                                                            </div>
                                                            {task.description && <p className="text-xs text-slate-500 mb-1">{task.description}</p>}
                                                            {task.deadline && !task.completed && (<div className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest ${isOverdue(task.deadline) ? 'text-red-400' : 'text-slate-600'}`}>{isOverdue(task.deadline) ? <AlertCircle size={10} /> : <Clock size={10} />}{formatDateDisplay(task.deadline)}</div>)}
                                                        </div>
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {!task.completed && <button onClick={() => startEditing(task)}><Edit2 size={14} className="text-slate-500 hover:text-white" /></button>}
                                                            {!task.completed && <button onClick={() => setFocusTask(task)}><Zap size={14} className="text-slate-500 hover:text-emerald-400" /></button>}
                                                            <button onClick={() => onDeleteTask(task.id)}><Trash2 size={14} className="text-slate-500 hover:text-red-400" /></button>
                                                        </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 h-64 flex flex-col"><p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Estado</p><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} innerRadius={40} outerRadius={60} paddingAngle={8} dataKey="value">{statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} /></PieChart></ResponsiveContainer></div>
                                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 h-64 flex flex-col"><p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Prioridad</p><ResponsiveContainer width="100%" height="100%"><BarChart data={priorityData} layout="vertical"><XAxis type="number" hide /><YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} width={30} /><Bar dataKey="cantidad" radius={[0, 10, 10, 0]} barSize={12} /></BarChart></ResponsiveContainer></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}

        {/* ======================= VISTA: BITÁCORA (WIKI) ======================= */}
        {activeView === 'wiki' && (
            <div className="flex-1 overflow-y-auto p-10 bg-transparent text-left no-scrollbar animate-in fade-in slide-in-from-right-4">
                <div className="max-w-4xl mx-auto space-y-8 pb-20">
                    
                    {/* SECCIÓN 1: PALETA DE COLORES */}
                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Palette size={20} className="text-indigo-400" />
                            <h3 className="text-lg font-black text-white uppercase tracking-wider">Identidad Visual</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {(project.wiki?.colors || []).map((col, idx) => (
                                <div key={idx} className="group relative bg-black/20 p-3 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                                    <div className="h-16 rounded-xl mb-3 shadow-inner" style={{ backgroundColor: col.code }} />
                                    <p className="text-xs font-bold text-white mb-0.5">{col.name}</p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] text-slate-500 font-mono uppercase">{col.code}</p>
                                        <button onClick={() => { navigator.clipboard.writeText(col.code) }} className="text-slate-600 hover:text-white"><Copy size={12} /></button>
                                    </div>
                                    <button onClick={() => deleteColor(idx)} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"><X size={10} /></button>
                                </div>
                            ))}
                            {/* Formulario Añadir Color */}
                            <div className="border border-dashed border-white/10 rounded-2xl p-4 flex flex-col justify-center items-center gap-2">
                                <div className="flex gap-2 w-full">
                                    <input type="color" className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
                                    <input type="text" placeholder="Nombre (ej. Primary)" className="flex-1 bg-transparent text-xs text-white border-b border-white/10 focus:outline-none" value={newColorName} onChange={(e) => setNewColorName(e.target.value)} />
                                </div>
                                <button onClick={addColor} disabled={!newColorName} className="w-full py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[9px] font-black uppercase text-white transition-all">Añadir</button>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: CREDENCIALES */}
                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Key size={20} className="text-amber-400" />
                            <h3 className="text-lg font-black text-white uppercase tracking-wider">Credenciales & Variables</h3>
                        </div>
                        <div className="space-y-3 mb-6">
                            {(project.wiki?.credentials || []).map((cred, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-3 bg-black/20 rounded-xl border border-white/5 group">
                                    <div className="w-1/3 text-xs font-bold text-slate-400 uppercase tracking-wider">{cred.key}</div>
                                    <div className="flex-1 font-mono text-xs text-emerald-400 bg-black/20 px-2 py-1 rounded select-all">{cred.value}</div>
                                    <button onClick={() => deleteCredential(idx)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 items-end p-4 bg-white/[0.02] rounded-xl border border-white/5">
                            <div className="flex-1 space-y-1">
                                <label className="text-[9px] text-slate-500 uppercase font-bold">Clave</label>
                                <input type="text" placeholder="ej. ADMIN_USER" className="w-full bg-transparent text-xs text-white border-b border-white/10 focus:border-white/30 focus:outline-none py-1" value={newCredKey} onChange={(e) => setNewCredKey(e.target.value)} />
                            </div>
                            <div className="flex-1 space-y-1">
                                <label className="text-[9px] text-slate-500 uppercase font-bold">Valor</label>
                                <input type="text" placeholder="Valor secreto..." className="w-full bg-transparent text-xs text-white border-b border-white/10 focus:border-white/30 focus:outline-none py-1" value={newCredValue} onChange={(e) => setNewCredValue(e.target.value)} />
                            </div>
                            <button onClick={addCredential} className="px-4 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-[10px] font-black uppercase hover:bg-amber-500 hover:text-black transition-all">Guardar</button>
                        </div>
                    </div>

                    {/* SECCIÓN 3: NOTAS TÉCNICAS */}
                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <FileText size={20} className="text-blue-400" />
                                <h3 className="text-lg font-black text-white uppercase tracking-wider">Notas de Ingeniería</h3>
                            </div>
                            <button onClick={saveWikiNotes} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white text-[10px] font-black uppercase tracking-widest transition-all">
                                <Save size={14} /> Guardar Cambios
                            </button>
                        </div>
                        <textarea 
                            className="flex-1 w-full bg-black/20 border border-white/5 rounded-2xl p-6 text-sm text-slate-300 font-mono leading-relaxed focus:outline-none focus:border-white/20 resize-none"
                            placeholder="Escribe aquí instrucciones de despliegue, recordatorios técnicos o notas de reuniones..."
                            value={wikiNotes}
                            onChange={(e) => setWikiNotes(e.target.value)}
                        />
                    </div>

                </div>
            </div>
        )}
    </div>
  );
}