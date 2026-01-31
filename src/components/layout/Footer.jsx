import React from 'react';

const Footer = () => {
  return (
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
  );
};

export default Footer;