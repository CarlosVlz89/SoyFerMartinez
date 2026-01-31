import React from 'react';
import { Sparkles } from 'lucide-react';

const IASection = () => {
  return (
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
  );
};

export default IASection;