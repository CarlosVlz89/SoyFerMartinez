import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../config/firebase'; 

import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import SummaryView from './components/SummaryView';
import ProjectView from './components/ProjectView';

const appId = 'fer-dev-studio';

export default function DevDashboard({ onClose }) {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]); 
  const [activeProject, setActiveProject] = useState(null);
  const [allTasks, setAllTasks] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- EFECTOS (IGUAL QUE ANTES) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'projects'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
      if (activeProject) {
        const updatedActive = data.find(p => p.id === activeProject.id);
        if (updatedActive) setActiveProject(updatedActive);
      }
    });
    return () => unsubscribe();
  }, [user, activeProject?.id]);

  useEffect(() => {
    if (!user) { setAllTasks([]); return; }
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'tasks'), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  // --- HANDLERS GENERALES ---
  const handleLogout = async () => { try { await signOut(auth); } catch (err) { console.error(err); } };

  const handleAddProject = async (name) => {
    const colors = ['bg-pink-500', 'bg-blue-600', 'bg-teal-500', 'bg-indigo-500', 'bg-amber-500'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    try {
      // Agregamos campo 'wiki' vacío al crear
      const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'projects'), {
        name, color, glow: `shadow-${color.split('-')[1]}-500/20`, createdAt: new Date().toISOString(), userId: user.uid, links: [], wiki: { notes: '', colors: [], credentials: [] }
      });
      const phases = ['📥 Fase 1: Briefing', '🎨 Fase 2: Diseño', '⚙️ Fase 3: Configuración', '🚀 Fase 4: Desarrollo', '🧪 Fase 5: Pruebas'];
      const tasksRef = collection(db, 'artifacts', appId, 'public', 'data', 'tasks');
      phases.forEach(async (title, i) => {
        await addDoc(tasksRef, { title, completed: false, priority: 'Alta', status: 'Pendiente', projectId: docRef.id, createdAt: new Date().toISOString(), userId: user.uid, type: 'roadmap', order: i });
      });
    } catch (err) { console.error(err); }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("¿Eliminar proyecto?")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', id));
      const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'tasks'), where("projectId", "==", id));
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      snap.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      if (activeProject?.id === id) setActiveProject(null);
    } catch (err) { console.error(err); }
  };

  // --- HANDLERS RECURSOS ---
  const handleAddLink = async (label, url) => {
    if (!activeProject) return;
    const icon = url.includes('github') ? '💻' : url.includes('firebase') ? '🔥' : url.includes('drive') || url.includes('google') ? '📂' : '🔗';
    const newLink = { label, url, icon };
    try {
      const projectRef = doc(db, 'artifacts', appId, 'public', 'data', 'projects', activeProject.id);
      const currentLinks = activeProject.links || [];
      await updateDoc(projectRef, { links: [...currentLinks, newLink] });
    } catch (err) { console.error(err); }
  };

  const handleDeleteLink = async (index) => {
    if (!activeProject) return;
    try {
      const projectRef = doc(db, 'artifacts', appId, 'public', 'data', 'projects', activeProject.id);
      const updatedLinks = [...activeProject.links];
      updatedLinks.splice(index, 1);
      await updateDoc(projectRef, { links: updatedLinks });
    } catch (err) { console.error(err); }
  };

  // --- NUEVO: HANDLER PARA ACTUALIZAR INFO DEL PROYECTO (WIKI) ---
  const handleUpdateProject = async (projectId, data) => {
    try {
      const projectRef = doc(db, 'artifacts', appId, 'public', 'data', 'projects', projectId);
      await updateDoc(projectRef, data);
    } catch (err) { console.error("Error updating project:", err); }
  };

  // --- HANDLERS TAREAS (IGUAL QUE ANTES) ---
  const handleAddTask = async (taskData) => {
    try {
      const currentTasks = allTasks.filter(t => t.projectId === activeProject.id);
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tasks'), {
        ...taskData, projectId: activeProject.id, createdAt: new Date().toISOString(), userId: user.uid, completed: false, order: currentTasks.length
      });
    } catch (err) { console.error(err); }
  };
  const handleToggleTask = async (task) => { try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tasks', task.id), { completed: !task.completed }); } catch (err) { console.error(err); } };
  const handleDeleteTask = async (id) => { try { await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tasks', id)); } catch (err) { console.error(err); } };
  const handleCycleStatus = async (task) => {
    const statuses = ['Pendiente', 'En Proceso', 'Bloqueado'];
    const next = statuses[(statuses.indexOf(task.status || 'Pendiente') + 1) % statuses.length];
    try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tasks', task.id), { status: next }); } catch (err) { console.error(err); }
  };
  const handleUpdateTask = async (taskId, updatedFields) => { try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tasks', taskId), updatedFields); } catch (err) { console.error(err); } };
  const handleReorderTasks = async (reorderedTasks) => {
    try {
      const batch = writeBatch(db);
      reorderedTasks.forEach((task, index) => {
        const taskRef = doc(db, 'artifacts', appId, 'public', 'data', 'tasks', task.id);
        batch.update(taskRef, { order: index });
      });
      await batch.commit();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="fixed inset-0 flex items-center justify-center bg-[#050505] text-white">Cargando...</div>;
  if (!user) return <LoginView onClose={onClose} />;

  return (
    <div className="fixed inset-0 z-[100] flex h-screen bg-[#050505] text-white font-sans overflow-hidden text-left">
      <div className="absolute top-0 left-[20%] w-[30%] h-[30%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Sidebar 
        user={user} 
        projects={projects} 
        activeProject={activeProject} 
        setActiveProject={setActiveProject} 
        onAddProject={handleAddProject} 
        onDeleteProject={handleDeleteProject}
        onAddLink={handleAddLink}
        onDeleteLink={handleDeleteLink}
        onLogout={handleLogout}
        onClose={onClose}
      />

      <main className="flex-1 overflow-hidden relative z-10">
        {!activeProject ? (
          <SummaryView user={user} projects={projects} allTasks={allTasks} setActiveProject={setActiveProject} />
        ) : (
          <ProjectView 
            project={activeProject} 
            tasks={allTasks.filter(t => t.projectId === activeProject.id)}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onCycleStatus={handleCycleStatus}
            onUpdateTask={handleUpdateTask}
            onReorderTasks={handleReorderTasks}
            onUpdateProject={handleUpdateProject} // <--- NUEVA PROP
          />
        )}
      </main>
    </div>
  );
}