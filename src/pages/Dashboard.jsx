import React, { useState, useEffect } from 'react';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  LayoutDashboard, 
  Truck, 
  BarChart3, 
  Settings,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  ChevronRight,
  Zap,
  MoreVertical,
  Navigation
} from 'lucide-react';
import RealTimeLogisticsMap from '../components/RealTimeLogisticsMap';

function Dashboard() {
  const [currentTab, setCurrentTab] = useState('Live Operations');
  const [recalculatingIds, setRecalculatingIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [fleet, setFleet] = useState([
    { id: 'R1', name: 'Arjun Mehta', status: 'In Transit', score: 98, task: 'Whitefield Hub', destination: 'Indiranagar', eta: '12m', distance: '4.2km' },
    { id: 'R2', name: 'Priya Sharma', status: 'Delayed', score: 82, task: 'Electronic City', destination: 'HSR Layout', eta: '28m', distance: '7.1km' },
    { id: 'R3', name: 'Kabir Singh', status: 'Idle', score: 91, task: 'HSR Layout Hub', destination: 'None', eta: '-', distance: '-' }
  ]);

  const handleRecalculate = (id) => {
    setRecalculatingIds(prev => new Set(prev).add(id));
    
    // Simulate AI Processing
    setTimeout(() => {
      setFleet(prev => prev.map(f => {
        if (f.id === id) {
          // Improve ETA/Dist slightly
          const currentEta = parseInt(f.eta);
          return { 
            ...f, 
            eta: isNaN(currentEta) ? f.eta : `${Math.max(2, currentEta - 3)}m`,
            score: Math.min(100, f.score + 1)
          };
        }
        return f;
      }));
      setRecalculatingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setToast({ message: `AI Optimization complete for agent ${id}. Route improved by 3m.`, type: 'success' });
      setTimeout(() => setToast(null), 4000);
    }, 2000);
  };

  const stats = [
    { label: 'Total Deliveries', value: '2,842', trend: '+14%', icon: Package, color: 'blue' },
    { label: 'Completed Today', value: '1,965', trend: '69%', icon: CheckCircle2, color: 'emerald' },
    { label: 'Delayed Routes', value: '42', trend: 'Critical', icon: AlertTriangle, color: 'red' },
    { label: 'Network Efficiency', value: '94.8%', trend: 'On Target', icon: TrendingUp, color: 'cyan' }
  ];

  const renderActiveRoutes = () => (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Active Trip Management</h1>
          <p className="text-slate-500 text-sm mt-1">Monitoring {fleet.filter(f => f.status !== 'Idle').length} live journeys across Bangalore Hubs.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">Export Logs</button>
          <button className="bg-[#00F2FE] text-black px-4 py-2 rounded-xl text-sm font-black primary-glow hover:scale-105 transition-transform">Add Temporary Node</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {fleet.filter(f => f.status !== 'Idle').map((trip, i) => (
          <div key={i} className="glass-card p-6 border-white/5 hover:border-[#00F2FE]/30 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4FACFE] to-[#00F2FE] flex items-center justify-center font-black text-black text-sm">
                  {trip.name.charAt(0)}
                </div>
                  <div className="text-sm font-medium text-white tracking-tight">{trip.name}</div>
                  <div className="text-[10px] text-slate-500 font-normal uppercase tracking-[0.2em] leading-none mt-1 tech-font">Shipment ID: {trip.id}-BGL9</div>
              </div>
              <button className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-white/5">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]"></div>
                  <div className="w-[1px] h-6 bg-white/10"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]"></div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="text-[9px] text-slate-600 font-normal uppercase tracking-tighter text-slate-500">Current Hub</div>
                    <div className="text-xs font-normal text-white/80">{trip.task}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-600 font-normal uppercase tracking-tighter text-slate-500">Next Destination</div>
                    <div className="text-xs font-normal text-white/80">{trip.destination}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-6">
                <div>
                  <div className="text-[9px] text-slate-600 font-normal uppercase tracking-widest mb-1 tech-font">Live ETA</div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#00F2FE]" />
                    <span className="text-sm font-normal text-white tech-font tabular-nums">{trip.eta}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-600 font-normal uppercase tracking-widest mb-1 tech-font">Dist. Left</div>
                  <div className="flex items-center gap-2">
                    <Navigation size={14} className="text-emerald-400" />
                    <span className="text-sm font-normal text-white tech-font tabular-nums">{trip.distance}</span>
                  </div>
                </div>
            </div>

            <button 
              onClick={() => handleRecalculate(trip.id)}
              disabled={recalculatingIds.has(trip.id)}
              className={`w-full py-3 rounded-xl text-[11px] font-medium uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
                recalculatingIds.has(trip.id) 
                ? 'bg-white/5 text-slate-500 cursor-not-allowed' 
                : 'bg-[#00F2FE]/10 border border-[#00F2FE]/20 text-[#00F2FE] hover:bg-[#00F2FE]/20'
              }`}
            >
                <Zap size={14} className={`fill-current ${recalculatingIds.has(trip.id) ? 'animate-pulse' : ''}`} /> 
                {recalculatingIds.has(trip.id) ? 'Analyzing Real-Time Data...' : 'Recalculate AI Path'}
            </button>
          </div>
        ))}
      </div>

      {/* Analytics Insight */}
      <div className="glass-card p-8 bg-gradient-to-br from-[#00F2FE]/5 to-transparent border-white/5">
         <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-[#00F2FE]" />
            <span className="text-sm font-medium uppercase tracking-widest text-white">Route Network Intelligence</span>
         </div>
         <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-normal">
            Our neural engine is analyzing <span className="text-white font-medium">Bangalore Metro</span> traffic patterns. 
            Currently, 86% of routes are optimized. Recommendation: Shift <span className="text-[#00F2FE] font-medium">Node Priya (R2)</span> to peripheral road to avoid HSR congestion.
         </p>
      </div>
    </div>
  );

  const renderLiveOperations = () => (
    <div className="animate-fade-in">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Dispatch Overview</h1>
            <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              Live Server Sync Active
            </div>
          </div>
          <button className="bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-black font-bold py-2.5 px-6 rounded-xl hover:scale-105 transition-transform primary-glow">
            Optimize All Routes
          </button>
        </header>

        {/* Top Status KPIs */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-6 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-widest">{stat.label}</span>
                <stat.icon size={18} className="opacity-60 text-[#00F2FE]" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className={`text-[10px] font-bold ${stat.trend.includes('+') || stat.trend.includes('%') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.trend}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 xl:col-span-8 flex flex-col gap-8">
            <div className="glass-card overflow-hidden h-[550px]">
              <RealTimeLogisticsMap />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Traffic Intensity Curve</h3>
                <div className="space-y-4">
                  {[
                    { time: '08:00 - 10:00', level: 'Moderate', color: 'orange' },
                    { time: '16:00 - 19:00', level: 'Peak Congestion', color: 'red' },
                    { time: '20:00 - 23:00', level: 'Optimal', color: 'emerald' }
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                      <span className="text-sm font-semibold">{p.time}</span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded bg-${p.color}-500/10 text-${p.color}-400 uppercase`}>{p.level}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-6">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Dispatch Efficiency</h3>
                 <div className="h-24 bg-gradient-to-r from-[#00F2FE]/5 to-[#4FACFE]/20 rounded-xl relative overflow-hidden border border-[#00F2FE]/20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,242,254,0.1),transparent_50%)]"></div>
                    <div className="absolute bottom-4 left-6 flex items-baseline gap-2">
                       <span className="text-4xl font-black text-[#00F2FE]">14m</span>
                       <span className="text-xs font-bold text-slate-400">Avg. Saving per Route</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 xl:col-span-4 flex flex-col gap-8">
            <div className="glass-card p-6 border-white/5 flex-1 min-h-[400px]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center justify-between">
                Active Fleet
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-white font-normal lowercase">{fleet.filter(f => f.status === 'In Transit').length} active</span>
              </h3>
              <div className="space-y-4">
                {fleet.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors rounded-xl border border-transparent hover:border-white/5 cursor-pointer">
                    <div className={`w-2 h-2 rounded-full ${r.status === 'In Transit' ? 'bg-emerald-500' : r.status === 'Delayed' ? 'bg-rose-500' : 'bg-slate-500'}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{r.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{r.task}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-black ${r.score > 90 ? 'text-emerald-400' : 'text-orange-400'}`}>{r.score}</div>
                      <div className="text-[9px] text-slate-600 font-bold uppercase">Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Urgent Alerts</h3>
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex gap-3">
                <AlertTriangle size={20} className="text-rose-400 flex-shrink-0" />
                <div>
                   <div className="text-xs font-bold text-rose-400">Roadblock: Outer Ring Rd</div>
                   <div className="text-[10px] text-rose-400/70 mt-1">Flyover work started 12m ago. Affecting 6 routes.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Performance Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Measuring hub-to-hub efficiency and driver performance metrics across the Bangalore network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 bg-gradient-to-br from-[#10B981]/5 to-transparent border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-emerald-400" />
            <span className="text-[10px] font-normal uppercase tracking-[0.2em] text-white tech-font">Net Throughput</span>
          </div>
          <div className="text-4xl font-medium tech-font mb-2">94.2<span className="text-lg text-emerald-400 ml-1">%</span></div>
          <p className="text-slate-500 text-xs leading-relaxed">System performance is tracking <span className="text-emerald-400 font-medium">+4.2%</span> above the quarterly baseline.</p>
        </div>
        
        <div className="glass-card p-6 border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-[#00F2FE]" />
            <span className="text-[10px] font-normal uppercase tracking-[0.2em] text-white tech-font">Daily Load Balanced</span>
          </div>
          <div className="flex items-end gap-1 h-12 mb-4">
            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-[#00F2FE]/20 hover:bg-[#00F2FE] transition-colors" style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <p className="text-slate-500 text-xs">Peak efficiency detected at <span className="text-white tech-font italic">11:42 AM</span> today.</p>
        </div>

        <div className="glass-card p-6 border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={18} className="text-amber-400" />
            <span className="text-[10px] font-normal uppercase tracking-[0.2em] text-white tech-font">Mean Service Time</span>
          </div>
          <div className="text-4xl font-medium tech-font mb-2">18.4<span className="text-lg text-slate-600 ml-1">min</span></div>
          <p className="text-slate-500 text-xs">Reduction of <span className="text-amber-400 font-medium">1.2m</span> achieved via AI reroute pathing.</p>
        </div>
      </div>

      <div className="glass-card p-8 border-white/5 overflow-hidden relative">
        <h3 className="text-sm font-medium uppercase tracking-widest text-slate-500 mb-8">Agent Efficiency leaderboard</h3>
        <div className="space-y-6">
          {fleet.sort((a, b) => b.score - a.score).map((rider, i) => (
            <div key={i} className="flex items-center gap-6 group">
              <span className="text-slate-700 font-black tech-font w-4">{i + 1}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">{rider.name}</span>
                  <span className="text-xs font-normal text-[#00F2FE] tech-font">{rider.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00F2FE] transition-all duration-1000" style={{ width: `${rider.score}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSystemConfig = () => (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">System Configuration</h1>
        <p className="text-slate-500 text-sm mt-1">Manage network nodes, AI optimization profiles, and core system parameters.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="glass-card p-8 border-white/5 space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-white">Advanced AI Pathing</h4>
                <p className="text-xs text-slate-500 mt-1 italic">Real-time neural network rerouting for metropolitan congestion.</p>
              </div>
              <div className="relative w-12 h-6 bg-[#00F2FE] rounded-full p-1 cursor-pointer">
                <div className="w-4 h-4 bg-black rounded-full ml-auto"></div>
              </div>
            </div>

            <div className="flex justify-between items-center opacity-50">
              <div>
                <h4 className="text-sm font-medium text-white">Auto-Dispatch Protocol v4</h4>
                <p className="text-xs text-slate-500 mt-1 italic">Automated load balancing between Bangalore North and South Hubs.</p>
              </div>
              <div className="relative w-12 h-6 bg-white/10 rounded-full p-1 cursor-not-allowed">
                <div className="w-4 h-4 bg-slate-700 rounded-full"></div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <label className="text-[10px] font-normal uppercase tracking-[0.2em] text-slate-600 block mb-4 tech-font">Optimization Profile</label>
              <div className="flex gap-4">
                {['Fuel Efficiency', 'Time Priority', 'Balanced'].map((mode, i) => (
                  <div key={i} className={`px-6 py-3 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                    mode === 'Balanced' ? 'bg-[#00F2FE]/10 border-[#00F2FE]/30 text-[#00F2FE]' : 'border-white/5 text-slate-500 hover:border-white/10'
                  }`}>
                    {mode}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-8 border-white/5">
             <h4 className="text-sm font-medium text-white mb-6">Active Node Map [Bangalore Grid]</h4>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Whitefield', 'Electronic City', 'HSR Layout', 'Indiranagar', 'Koramangala', 'Hebbal', 'JP Nagar', 'MG Road'].map((hub, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-[#00F2FE]/30 transition-colors">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                     <span className="text-[10px] font-medium text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">{hub}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <div className="glass-card p-6 border-white/5 bg-gradient-to-br from-[#00F2FE]/5 to-transparent">
             <h4 className="text-[10px] font-normal uppercase tracking-[0.2em] text-white mb-6 tech-font">Core API Status</h4>
             <div className="space-y-4">
               {[
                 { label: 'Leaflet Raster engine', status: 'Online', delay: '14ms' },
                 { label: 'Mapbox Vector Node', status: 'Standby', delay: '0ms' },
                 { label: 'Socket.io WebSocket', status: 'Live', delay: '8ms' },
                 { label: 'RouteSense AI Core', status: 'Active', delay: '112ms' }
               ].map((api, i) => (
                 <div key={i} className="flex justify-between items-center text-[10px]">
                   <span className="text-slate-500 font-medium">{api.label}</span>
                   <span className="text-emerald-400 font-black tech-font uppercase">{api.status}</span>
                 </div>
               ))}
             </div>
          </div>

          <button className="w-full bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#EF4444]/20 transition-all">
             Emergency System Purge
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-[#F8FAFC] font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-card rounded-none border-t-0 border-b-0 border-l-0 border-r border-white/5 p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-gradient-to-br from-[#4FACFE] to-[#00F2FE] p-2 rounded-xl text-black">
            <Package size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">RouteSense</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Live Operations' },
            { icon: Truck, label: 'Active Routes' },
            { icon: BarChart3, label: 'Performance' },
            { icon: Settings, label: 'System Config' }
          ].map((item, i) => (
            <div 
              key={i}
              onClick={() => setCurrentTab(item.label)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                currentTab === item.label 
                  ? 'bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-semibold">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 glass-card bg-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4FACFE] to-[#00F2FE] flex items-center justify-center font-bold text-black text-sm">AM</div>
            <div>
              <div className="text-sm font-bold">Arjun Mehta</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fleet Manager</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {currentTab === 'Active Routes' ? renderActiveRoutes() : 
         currentTab === 'Performance' ? renderPerformance() :
         currentTab === 'System Config' ? renderSystemConfig() :
         renderLiveOperations()}
      </main>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
           <div className={`glass-card px-8 py-4 border-[#00F2FE]/30 shadow-2xl flex items-center gap-4 bg-[#0B0F19]/90 backdrop-blur-xl ${toast.type === 'success' ? 'border-[#00F2FE]/30' : 'border-rose-500/30'}`}>
              <div className="w-2 h-2 rounded-full bg-[#00F2FE] animate-ping"></div>
              <span className="text-sm font-medium text-white tech-font">{toast.message}</span>
           </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
