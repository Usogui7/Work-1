import React from 'react';
import { motion } from 'motion/react';

import { RobertoStats } from '../types';

interface MenuProps {
  onNewGame: () => void;
  onLoadGame: (slot: number) => void;
  onSaveGame: (slot: number) => void;
  currentStats?: RobertoStats;
}

const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="flex flex-col gap-1 bg-black/80 p-1 pixel-border">
    <div className="flex justify-between items-center px-1">
      <span className="text-[7px] text-white font-bold">{label}</span>
      <span className="text-[7px] text-white/50">{Math.round(value)}</span>
    </div>
    <div className="h-1.5 bg-gray-800 border border-white/10">
      <div 
        className={`h-full ${color} transition-all duration-500`} 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  </div>
);

export const Menu: React.FC<MenuProps> = ({ onNewGame, onLoadGame, onSaveGame, currentStats }) => {
  const [view, setView] = React.useState<'MAIN' | 'SAVE' | 'LOAD'>('MAIN');

  const slots = [1, 2, 3];

  const getSlotInfo = (slot: number) => {
    const saved = localStorage.getItem(`robs_routine_save_${slot}`);
    if (!saved) return 'EMPTY';
    const data = JSON.parse(saved);
    return `DAY ${data.day} - ${data.money} CHF`;
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-black">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="pixel-card w-80 flex flex-col gap-4"
      >
        <h2 className="text-xl text-center text-white mb-2 border-b-4 border-white pb-2">
          {view === 'MAIN' ? 'MAIN MENU' : view === 'SAVE' ? 'SAVE GAME' : 'LOAD GAME'}
        </h2>

        {currentStats && (
          <div className="grid grid-cols-2 gap-1 mb-4">
            <StatBar label="NRG" value={currentStats.energy} color="bg-yellow-500" />
            <StatBar label="HYG" value={currentStats.hygiene} color="bg-blue-500" />
            <StatBar label="FIT" value={currentStats.fitness} color="bg-red-500" />
            <StatBar label="SOC" value={currentStats.social} color="bg-green-500" />
          </div>
        )}
        
        {view === 'MAIN' && (
          <>
            <button onClick={onNewGame} className="pixel-button w-full">NEW GAME</button>
            <button onClick={() => setView('SAVE')} className="pixel-button w-full">SAVE GAME</button>
            <button onClick={() => setView('LOAD')} className="pixel-button w-full">LOAD GAME</button>
          </>
        )}

        {(view === 'SAVE' || view === 'LOAD') && (
          <div className="flex flex-col gap-2">
            {slots.map(slot => (
              <button 
                key={slot}
                onClick={() => {
                  if (view === 'SAVE') onSaveGame(slot);
                  else onLoadGame(slot);
                  setView('MAIN');
                }}
                className="pixel-button w-full text-[10px] flex flex-col items-start p-2"
              >
                <span className="font-bold">SLOT {slot}</span>
                <span className="text-[8px] opacity-60">{getSlotInfo(slot)}</span>
              </button>
            ))}
            <button onClick={() => setView('MAIN')} className="pixel-button w-full mt-2 bg-red-900/40">BACK</button>
          </div>
        )}
        
        <div className="text-[8px] text-gray-500 text-center mt-2">
          v1.1.0 - LAUSANNE EDITION
        </div>
      </motion.div>
    </div>
  );
};
