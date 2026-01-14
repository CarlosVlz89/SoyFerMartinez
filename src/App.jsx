import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Code2, 
  Target, 
  BrainCircuit, 
  Database, 
  Github, 
  Linkedin, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Layers,
  Terminal,
  Cpu,
  TrendingUp,
  Layout
} from 'lucide-react';

/**
 * ARCHIVO: src/App.jsx
 * Marca Personal: SoyFerMartinez
 * Enfoque: Disciplina, Estrategia de Negocio y Desarrollo Aumentado por IA.
 */
const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('all');
  const [scrolled, setScrolled] = useState(false);

  // Manejo de interactividad: Seguimiento de mouse y scroll
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleScroll = () => setScrolled(window.scrollY > 50);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const projects = [
    {
      id: 1,
      title: "Ballet Fit Management System",
      category: "dev",
      subtitle: "Product Strategy & Development",
      description: "Más que una PWA, fue un proceso de consultoría. Identifiqué las necesidades críticas del estudio para digitalizar asistencias y créditos, creando una herramienta práctica que evoluciona con el negocio.",
      tech: ["React", "Firebase", "Product Discovery", "UX Logic"],
      impact: "Digitalización 100% operativa."
    },
    {
      id: 2,
      title: "Marketing & Conversion",
      category: "marketing",
      subtitle: "Estrategia Basada en Datos",
      description: "Análisis de funnels y optimización de presencia digital. Aplico mi formación en marketing para asegurar que cada desarrollo tenga un objetivo comercial claro.",
      tech: ["Conversion Rate", "Strategy", "User Behavior"],
      impact: "Enfoque en ROI y crecimiento."
    },
    {
      id: 3,
      title: "Data Insights for Business",
      category: "data",
      subtitle: "Análisis con R & SQL",
      description: "Transformación de datos económicos complejos en visualizaciones que permiten tomar decisiones. Uso de IA para acelerar la limpieza y el procesamiento de información.",
      tech: ["R Language", "SQL", "Predictive Logic"],
      impact: "Automatización de reportes."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      
      {/* Resplandor de fondo interactivo */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-500"
        style={{
          background: `radial-gradient(800px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.12), transparent 80%)`
        }}
      />

      {/* Navegación adaptable */}
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
            <a href="mailto:hola@soyfermartinez.com" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 font-bold">
              Contacto
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
              <button className="px-10 py-5 bg-white text-black hover:bg-indigo-500 hover:text-white rounded-2xl font-black transition-all flex items-center gap-3 group">
                VER PROYECTOS
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-8 px-8 border-l border-white/10">
                <Linkedin size={24} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
                <Github size={24} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso / Metodología */}
      <section id="proceso" className="py-32 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Mi enfoque de Desarrollo</h2>
              <p className="text-lg text-slate-400 mb-12 leading-relaxed">
                No construyo por construir. Mi formación en marketing me permite analizar el momento del negocio y proponer la tecnología que mejor se adapte a sus objetivos actuales y futuros.
              </p>
              <div className="space-y-6">
                {[
                  { title: "Entender el Negocio", desc: "Inmersión en los procesos para identificar cuellos de botella." },
                  { title: "Solución Práctica (MVP)", desc: "Construcción de lo esencial para empezar a generar valor rápido." },
                  { title: "Iteración Continua", desc: "Mejora basada en el uso real y el feedback de los usuarios." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-all">
                    <div className="text-indigo-500 font-black text-2xl">0{i+1}</div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{step.title}</h4>
                      <p className="text-sm text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-tr from-indigo-900/40 to-transparent rounded-full blur-[120px] absolute -z-10 animate-pulse"></div>
              <div className="bg-[#0f172a]/50 backdrop-blur-sm border border-white/10 p-8 rounded-[40px] shadow-2xl relative">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="font-mono text-sm space-y-4">
                  <p className="text-indigo-400"># SoyFerMartinez.config</p>
                  <p className="text-slate-300">{"{"}</p>
                  <p className="pl-6 text-slate-300">approach: <span className="text-emerald-400">"Business-First"</span>,</p>
                  <p className="pl-6 text-slate-300">discipline: <span className="text-emerald-400">100</span>,</p>
                  <p className="pl-6 text-slate-300">tools: [<span className="text-amber-400">"React", "Firebase", "Gemini_IA"</span>],</p>
                  <p className="pl-6 text-slate-300">mission: <span className="text-indigo-400">"Build for growth"</span></p>
                  <p className="text-slate-300">{"}"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portafolio */}
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
            {projects.filter(p => activeTab === 'all' || p.category === activeTab).map(project => (
              <div key={project.id} className="group flex flex-col h-full">
                <div className="relative mb-6 overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-white/5 aspect-[4/3] flex items-center justify-center">
                   {project.category === 'dev' ? <Layout size={80} className="text-indigo-500/20 group-hover:scale-110 transition-transform duration-500" /> : 
                    project.category === 'data' ? <TrendingUp size={80} className="text-emerald-500/20 group-hover:scale-110 transition-transform duration-500" /> : 
                    <Target size={80} className="text-amber-500/20 group-hover:scale-110 transition-transform duration-500" />}
                   
                   <div className="absolute top-6 right-6">
                      <div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
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
            ))}
          </div>
        </div>
      </section>

      {/* IA Section */}
      <section className="py-40 bg-indigo-600 rounded-[80px] mx-4 mb-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center text-white">
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center animate-bounce">
              <Sparkles size={40} />
            </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter leading-none">
            La IA como mi motor de ejecución.
          </h2>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-16 leading-relaxed font-light">
            Utilizo Gemini para multiplicar mi capacidad técnica. Esto me permite centrarme en lo que realmente importa: la <span className="font-bold underline decoration-indigo-300 underline-offset-8">estrategia de tu producto</span> y la experiencia del usuario.
          </p>
          <div className="flex flex-wrap justify-center gap-12">
            <div>
              <div className="text-6xl font-black mb-2">36</div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Años de Disciplina</div>
            </div>
            <div className="w-px h-16 bg-white/20 hidden md:block" />
            <div>
              <div className="text-6xl font-black mb-2">01</div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Visión de Producto</div>
            </div>
            <div className="w-px h-16 bg-white/20 hidden md:block" />
            <div>
              <div className="text-6xl font-black mb-2">∞</div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Curiosidad Infinita</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20 mb-32">
            <div className="max-w-md">
              <div className="text-4xl font-black text-white mb-8">Soy<span className="text-indigo-500">FerMartinez</span></div>
              <p className="text-slate-500 text-lg font-light leading-relaxed">Digital Strategist & Developer. Construyendo el futuro de los negocios digitales con datos, código y estrategia.</p>
            </div>
            <div className="space-y-6">
              <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Contacto</div>
              <a href="mailto:hola@soyfermartinez.com" className="text-3xl md:text-5xl font-medium text-white hover:text-indigo-400 transition-colors block">
                hola@soyfermartinez.com
              </a>
              <div className="flex gap-10 pt-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">LinkedIn</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">GitHub</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Instagram</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6 text-[10px] font-black uppercase tracking-widest text-slate-700">
            <div>Zapopan, Jalisco, México</div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <span>© 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;