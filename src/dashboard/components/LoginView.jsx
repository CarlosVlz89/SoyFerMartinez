import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../config/firebase'; // Importamos la config centralizada
import { Zap, Target, Code2, Layout, ArrowRight, Home } from 'lucide-react';

export default function LoginView({ onClose }) {
  
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try { await signInWithPopup(auth, provider); } catch (err) { console.error(err); }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-[#050505] flex items-center justify-center p-4 overflow-hidden font-sans text-left">
      {/* Fondos y efectos */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[10%] right-[20%] w-[30vw] h-[30vw] bg-pink-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Nav Login */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
         <div className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-white">
             <Zap className="text-indigo-500" fill="currentColor" /> FerDev
         </div>
         {onClose && (
             <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all">
                <Home size={14} /> Volver al Sitio
             </button>
         )}
      </nav>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-6 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
               <Zap size={32} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">FerDev Studio</h1>
            <p className="text-slate-500 font-medium tracking-wide text-sm">Systematic Creativity & Intelligence</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-10">
             <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5"><Target size={18} className="text-pink-400" /><span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Roadmap</span></div>
             <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5"><Code2 size={18} className="text-indigo-400" /><span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Dev</span></div>
             <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5"><Layout size={18} className="text-emerald-400" /><span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Focus</span></div>
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
}