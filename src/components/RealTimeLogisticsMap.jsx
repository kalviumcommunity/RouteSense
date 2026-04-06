import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';

/**
 * RouteSense Pro: Working Map (Token-Free)
 * Using Leaflet with CartoDB Dark Matter for a premium look.
 */

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom animated agent icon
const createAgentIcon = () => L.divIcon({
    html: `<div style="background: #00F2FE; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px #00F2FE; border: 2px solid white;">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path></svg>
           </div>`,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const RealTimeLogisticsMap = ({ 
    pickup = [12.9698, 77.7500], // Whitefield, Bangalore
    drop = [12.8452, 77.6602]     // Electronic City, Bangalore
}) => {
    const [agentPos, setAgentPos] = useState(pickup);
    const [progress, setProgress] = useState(0);
    const [path, setPath] = useState([]);

    // Simple Linear Interpolation for demo movement
    useEffect(() => {
        // Mock route path (straight-ish line with some jitter)
        const steps = 100;
        const newPath = [];
        for (let i = 0; i <= steps; i++) {
            const ratio = i / steps;
            newPath.push([
                pickup[0] + (drop[0] - pickup[0]) * ratio + (Math.sin(i/5) * 0.002),
                pickup[1] + (drop[1] - pickup[1]) * ratio + (Math.cos(i/5) * 0.002)
            ]);
        }
        setPath(newPath);

        let step = 0;
        const interval = setInterval(() => {
            if (step < newPath.length) {
                setAgentPos(newPath[step]);
                setProgress(Math.round((step / newPath.length) * 100));
                step++;
            } else {
                step = 0; // Loop
            }
        }, 100);

        return () => clearInterval(interval);
    }, [pickup, drop]);

    return (
        <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden glass-card border-none text-white">
            <MapContainer 
                center={pickup} 
                zoom={11} 
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', background: '#0B0F19' }}
            >
                {/* Premium Dark Matter Tiles (No Token Required) */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* Route Line */}
                <Polyline 
                    positions={path} 
                    pathOptions={{ 
                        color: '#4FACFE', 
                        weight: 4, 
                        opacity: 0.6,
                        dashArray: '8, 8'
                    }} 
                />

                {/* Pickup/Drop Markers */}
                <Marker position={pickup}>
                    <Popup>Pickup: Whitefield Hub (Bangalore)</Popup>
                </Marker>
                <Marker position={drop}>
                    <Popup>Destination: Electronic City Depot</Popup>
                </Marker>

                {/* Animated Agent Marker */}
                {agentPos && <Marker position={agentPos} icon={createAgentIcon()} />}
            </MapContainer>

            {/* Live HUD Overlay */}
            <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 pointer-events-none">
                <div className="bg-[#0B0F19]/90 backdrop-blur-md p-4 rounded-lg border border-white/10 shadow-2xl flex items-center gap-4 pointer-events-auto">
                    <div className="bg-[#00F2FE]/20 p-2 rounded-md">
                        <Navigation className="text-[#00F2FE] w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Active Dispatch</div>
                        <div className="text-white font-bold text-sm">Agent: R-102 (Arjun)</div>
                    </div>
                </div>

                <div className="bg-[#0B0F19]/90 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-2xl flex justify-between gap-6 pointer-events-auto">
                    <div className="text-center">
                        <div className="text-[9px] text-slate-400 font-bold uppercase">Distance</div>
                        <div className="text-[#00F2FE] font-bold">12.4 km</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[9px] text-slate-400 font-bold uppercase">Transit</div>
                        <div className="text-white font-bold">{progress}%</div>
                    </div>
                </div>
            </div>

            {/* Traffic Legend */}
            <div className="absolute bottom-6 right-6 z-[1000] bg-[#0B0F19]/80 backdrop-blur-sm px-3 py-2 rounded-md border border-white/10 flex items-center gap-4 text-[10px] font-bold pointer-events-none">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Low</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Med</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Peak</div>
            </div>
        </div>
    );
};

export default RealTimeLogisticsMap;
