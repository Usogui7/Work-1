import React from 'react';
import { motion } from 'motion/react';
import { Skull, RotateCcw, ShieldAlert } from 'lucide-react';

interface GameOverProps {
  reason: string;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ reason, onRestart }) => {
  const isPrison = reason.includes('PRISON');
  const isHomeless = reason.includes('HOMELESS');
  
  return (
    <div className={`h-screen w-screen flex flex-col items-center justify-center ${isPrison ? 'bg-slate-900' : isHomeless ? 'bg-amber-950' : 'bg-red-950'} text-white p-4 transition-colors duration-1000`}>
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`pixel-card ${isPrison ? 'border-blue-500' : isHomeless ? 'border-amber-500' : 'border-red-500'} bg-black flex flex-col items-center gap-8 p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]`}
      >
        {isPrison ? (
          <div className="relative">
            <ShieldAlert size={80} className="text-blue-500 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-white/20 rotate-45" />
              <div className="absolute w-full h-1 bg-white/20 -rotate-45" />
            </div>
          </div>
        ) : isHomeless ? (
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-500 rounded-full flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
          </div>
        ) : (
          <Skull size={80} className="text-red-500 animate-pulse" />
        )}
        
        <div className="text-center">
          <h1 className={`text-3xl ${isPrison ? 'text-blue-400' : isHomeless ? 'text-amber-400' : 'text-red-500'} mb-4 font-bold tracking-tighter`}>
            {isPrison ? 'PRISON ENDING' : isHomeless ? 'HOMELESS ENDING' : 'GAME OVER'}
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-[0.2em] max-w-xs leading-relaxed">
            {reason}
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <button 
            onClick={onRestart}
            className={`pixel-button ${isPrison ? 'bg-blue-600' : isHomeless ? 'bg-amber-600' : 'bg-red-600'} text-white flex items-center justify-center gap-2 hover:scale-105 transition-transform`}
          >
            <RotateCcw size={16} /> {isPrison ? 'SERVE TIME & RETRY' : isHomeless ? 'TRY TO FIND A JOB' : 'RETRY LIFE'}
          </button>
          
          <div className="text-[8px] text-gray-600 text-center italic">
            {isPrison ? "Even an EPFL degree can't build a way out of this." : isHomeless ? "The rent was too high, even for an architect." : "The mundane cycle ends here."}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
