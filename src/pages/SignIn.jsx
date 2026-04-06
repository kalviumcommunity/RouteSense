import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight, Eye, EyeOff } from 'lucide-react';

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    // In a real app, you'd authenticate here. For demo, we just go to dashboard.
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col items-center justify-center font-sans p-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00F2FE]/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="flex flex-col items-center gap-6 mb-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#4FACFE] to-[#00F2FE] p-2 rounded-xl text-black">
            <Package size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight tracking-[-0.04em]">RouteSense</span>
        </Link>
        <h2 className="text-4xl font-black tracking-[-0.05em]">Welcome Back.</h2>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed">Manager Portal Access</p>
      </div>

      <div className="w-full max-w-sm glass-card p-10 flex flex-col gap-6">
        <form onSubmit={handleSignIn} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase text-slate-500 tracking-widest pl-2">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="name@company.com" 
              className="bg-white/5 border border-white/10 p-4 rounded-xl text-sm focus:outline-none focus:border-[#00F2FE]/50 transition-colors"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center pr-2">
              <label className="text-[11px] font-bold uppercase text-slate-500 tracking-widest pl-2">Password</label>
              <a href="#" className="text-[10px] uppercase text-[#00F2FE] font-bold">Forgot?</a>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••" 
                className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-xl text-sm focus:outline-none focus:border-[#00F2FE]/50 transition-colors"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-black p-4 rounded-xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform primary-glow">
            Sign In <ArrowRight size={18} />
          </button>
        </form>



        <div className="text-center text-xs text-slate-500 font-bold uppercase tracking-widest mt-4">
          Don't have an account? <Link to="/signup" className="text-[#00F2FE] hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
