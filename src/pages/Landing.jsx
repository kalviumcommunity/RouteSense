import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Shield, Zap, Globe, BarChart3 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-12 py-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#4FACFE] to-[#00F2FE] p-2 rounded-xl text-black">
            <Package size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight tracking-[-0.04em]">RouteSense</span>
        </div>
        <div className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/signin" className="px-6 py-2.5 text-sm font-bold hover:text-[#00F2FE] transition-colors">Sign In</Link>
            <Link to="/signup" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-black hover:scale-105 transition-transform">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-12 pt-16 pb-32 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#00F2FE]/5 rounded-full blur-[120px] -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.2em] text-[#00F2FE] mb-8 animate-fade-in">
          <Zap size={12} /> AI-Powered Route Optimization
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black leading-[1.05] tracking-[-0.05em] mb-8 max-w-4xl">
          The Future of <span className="bg-gradient-to-r from-[#4FACFE] via-[#00F2FE] to-[#10B981] bg-clip-text text-transparent">Logistics</span> is Here.
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12">
          RouteSense uses advanced AI to optimize your fleet in real-time, saving 20% in fuel costs and reducing delivery times across India's busiest cities.
        </p>


      </section>

      {/* Features Grid */}
      <section id="features" className="px-12 py-32 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Zap, title: "Real-time AI", desc: "Our engine predicts traffic before it happens using historical and live data." },
            { icon: Shield, title: "Secure Fleet", desc: "Automated tracking and geofencing to protect your assets at all times." },
            { icon: Globe, title: "Pan-India Coverage", desc: "Dedicated maps and hubs covering all major metros including Bangalore, Delhi, and Mumbai." }
          ].map((f, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#00F2FE]/10 flex items-center justify-center text-[#00F2FE]">
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-bold">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-12 py-16 text-center border-t border-white/5">
        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">© 2026 RouteSense Pro. Built with ❤️ for Bharat Logistics.</div>
      </footer>
    </div>
  );
};

export default Landing;
