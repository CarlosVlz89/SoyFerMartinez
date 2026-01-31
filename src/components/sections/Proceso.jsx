import React from 'react';

const Proceso = () => {
  return (
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
  );
};

export default Proceso;