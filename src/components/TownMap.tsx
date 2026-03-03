import React from 'react';
import { motion } from 'motion/react';
import { LocationType } from '../types';
import { Home, Briefcase, Beer, Dumbbell, Skull } from 'lucide-react';

interface TownMapProps {
  onSelectLocation: (loc: LocationType) => void;
  hour: number;
  unlockedLocations: LocationType[];
}

export const TownMap: React.FC<TownMapProps> = ({ onSelectLocation, hour, unlockedLocations }) => {
  const locations = [
    { id: 'HOME' as LocationType, name: 'HOME (AV. DE COUR)', icon: <Home />, x: '45%', y: '45%' },
    { id: 'WORK' as LocationType, name: 'OFFICE (EPFL)', icon: <Briefcase />, x: '20%', y: '20%' },
    { id: 'BAR' as LocationType, name: 'LE BAR (OUCHY)', icon: <Beer />, x: '60%', y: '48%' },
    { id: 'GYM' as LocationType, name: 'GYM (FLON)', icon: <Dumbbell />, x: '80%', y: '25%' },
    { id: 'CHALET' as LocationType, name: 'CHALET (ALPS)', icon: <Home />, x: '85%', y: '10%' },
    { id: 'ALLEY' as LocationType, name: 'DARK ALLEY', icon: <Skull />, x: '10%', y: '70%' },
  ];

  const isNight = hour < 6 || hour > 20;
  const isSunset = (hour >= 18 && hour <= 20) || (hour >= 5 && hour < 6);
  const mapBg = isNight ? 'bg-[#1a1a2e]' : isSunset ? 'bg-[#ff7e5f]' : 'bg-[#e0d5b8]';
  const skyBg = isNight ? 'bg-slate-950' : isSunset ? 'bg-orange-900' : 'bg-sky-400';
  const mountainColor = isNight ? 'border-b-slate-900' : isSunset ? 'border-b-orange-950' : 'border-b-slate-700';

  return (
    <div className={`h-screen w-screen flex flex-col items-center justify-center ${skyBg} transition-colors duration-1000 overflow-hidden relative`}>
      {/* Retro Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Background Elements (Mountains & Clouds) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Mountains with better gradients */}
        <div className="absolute bottom-[40%] w-full h-1/2 flex items-end justify-around opacity-40">
          <div className={`w-0 h-0 border-l-[200px] border-l-transparent border-r-[200px] border-r-transparent border-b-[300px] ${mountainColor} drop-shadow-2xl transition-colors duration-1000`} />
          <div className={`w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-b-[200px] ${isNight ? 'border-b-black' : 'border-b-slate-800'} -ml-20 drop-shadow-2xl transition-colors duration-1000`} />
          <div className={`w-0 h-0 border-l-[250px] border-l-transparent border-r-[250px] border-r-transparent border-b-[350px] ${isNight ? 'border-b-slate-950' : 'border-b-slate-900'} -ml-40 drop-shadow-2xl transition-colors duration-1000`} />
        </div>

        {/* Clouds with soft glow */}
        <motion.div 
          animate={{ x: [-20, 20, -20] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-12 bg-white/60 rounded-full blur-xl shadow-[0_0_20px_rgba(255,255,255,0.5)]" 
        />
        <motion.div 
          animate={{ x: [20, -20, 20] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-48 h-16 bg-white/40 rounded-full blur-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)]" 
        />
      </div>

      <div className="z-10 mt-24 mb-4 text-center">
        <motion.h2 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl text-white drop-shadow-[6px_6px_0_rgba(0,0,0,1)] font-bold tracking-[0.2em] uppercase italic"
        >
          Lausanne
        </motion.h2>
        <div className="text-[10px] text-yellow-400 blink font-bold tracking-widest mt-2 bg-black/40 px-4 py-1 pixel-border">
          SELECT DESTINATION
        </div>
      </div>

      <div className={`w-[90%] max-w-5xl aspect-video relative border-[12px] border-zinc-900 rounded-xl overflow-hidden ${mapBg} shadow-[30px_30px_0_rgba(0,0,0,0.4)] transform perspective-1000 rotateX-12 group transition-colors duration-1000`}>
        {/* Terrain Details inspired by the map */}
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          {/* Main Roads with better styling */}
          <div className="absolute top-[35%] left-0 w-full h-8 bg-zinc-800/30 -rotate-2 border-y-2 border-zinc-900/10" />
          <div className="absolute top-[60%] left-0 w-full h-8 bg-zinc-800/30 rotate-3 border-y-2 border-zinc-900/10" />
          <div className="absolute top-0 left-[35%] w-8 h-full bg-zinc-800/30 rotate-12 border-x-2 border-zinc-900/10" />
          <div className="absolute top-0 left-[65%] w-8 h-full bg-zinc-800/30 -rotate-6 border-x-2 border-zinc-900/10" />
          
          {/* Street Names with better typography */}
          <div className="absolute top-[28%] left-[42%] text-[10px] text-black/40 font-bold uppercase rotate-12 tracking-tighter">Rue de Genève</div>
          <div className="absolute top-[52%] left-[12%] text-[10px] text-black/40 font-bold uppercase -rotate-2 tracking-tighter">Avenue de Morges</div>
          <div className="absolute bottom-[38%] left-[38%] text-[10px] text-black/40 font-bold uppercase rotate-45 tracking-tighter">Avenue de Cour</div>
          <div className="absolute bottom-[28%] right-[22%] text-[10px] text-black/40 font-bold uppercase -rotate-12 tracking-tighter">Avenue d'Ouchy</div>
          
          {/* Parks with better color */}
          <div className="absolute bottom-[45%] left-[48%] w-32 h-20 bg-emerald-600/20 rounded-full blur-xl" />
          <div className="absolute top-[25%] right-[18%] w-40 h-28 bg-emerald-600/20 rounded-full blur-xl" />
        </div>

        {/* Lake Geneva (Léman) with better animation */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[#2c3e50] to-[#4a90e2]/90 border-t-8 border-zinc-900/20 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-60">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div 
                key={i} 
                animate={{ x: [-20, 20, -20], opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: Math.random() * 5 + 3, ease: "easeInOut" }}
                className="absolute h-[3px] bg-white/40 rounded-full" 
                style={{ 
                  width: Math.random() * 100 + 50 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }} 
              />
            ))}
          </div>
          <span className="text-xl text-white font-bold tracking-[1em] z-10 uppercase opacity-20 italic">Lac Léman</span>
        </div>

        {locations.filter(loc => (unlockedLocations || []).includes(loc.id)).map((loc) => (
          <motion.button
            key={loc.id}
            whileHover={{ scale: 1.15, zIndex: 50, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelectLocation(loc.id)}
            className="absolute flex flex-col items-center gap-1 group/loc transition-all"
            style={{ left: loc.x, top: loc.y }}
          >
            <div className="p-2.5 bg-zinc-900 text-white rounded-full shadow-[4px_4px_0_rgba(0,0,0,0.2)] border-2 border-zinc-800 group-hover/loc:border-yellow-500 group-hover/loc:bg-black transition-colors">
              {React.cloneElement(loc.icon as React.ReactElement, { size: 20 })}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-black text-zinc-800 uppercase tracking-tighter group-hover/loc:text-black">
                {loc.name.split(' (')[0]}
              </span>
              <span className="text-[6px] text-zinc-500 font-bold uppercase tracking-widest group-hover/loc:text-zinc-700">
                {loc.name.includes('(') ? loc.name.split('(')[1].replace(')', '') : ''}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
      
      <div className="mt-8 text-[8px] text-white/40 uppercase tracking-[0.2em]">
        Lausanne - The Mundane Capital
      </div>
    </div>
  );
};
