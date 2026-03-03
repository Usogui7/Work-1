import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RobertoStats } from '../types';
import { Shield, DollarSign, Briefcase, XCircle } from 'lucide-react';

interface ArmyEventProps {
  stats: RobertoStats;
  onTalkWayOut: (excuseId: string) => void;
  onPayWayOut: () => void;
  onGoWithArmy: (days: number) => void;
  onDecline: () => void;
}

const EXCUSES = [
  { id: 'flat_foot', text: "I have a structurally unsound flat foot." },
  { id: 'architect', text: "I'm the only architect who can save the Rolex Learning Center from collapse." },
  { id: 'allergy', text: "I have a severe, life-threatening allergy to camouflage patterns." },
  { id: 'startup', text: "I'm in the middle of a critical startup pivot. The Badger loyalty cards depend on me!" },
  { id: 'mornings', text: "I have a deep-seated moral objection to waking up before 10 AM." }
];

export const ArmyEvent: React.FC<ArmyEventProps> = ({ 
  stats, onTalkWayOut, onPayWayOut, onGoWithArmy, onDecline 
}) => {
  const [view, setView] = useState<'MAIN' | 'EXCUSES'>('MAIN');
  const availableExcuses = EXCUSES.filter(e => !stats.armyExcusesUsed.includes(e.id));

  return (
    <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center p-4">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="pixel-card w-full max-w-2xl bg-zinc-900 border-green-800 border-4 p-8 relative overflow-hidden flex flex-col items-center"
      >
        {/* Army Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="grid grid-cols-8 gap-2 p-4">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="w-8 h-8 bg-green-500 rotate-45" />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 w-full">
          <div className="flex justify-center items-center gap-4 mb-2">
            <div className="flex -space-x-4">
              <SoldierSprite color="bg-green-900" />
              <SoldierSprite color="bg-green-800" delay={0.1} />
              <SoldierSprite color="bg-green-950" delay={0.2} />
            </div>
          </div>

          <div className="text-center space-y-4 max-w-lg">
            <h2 className="text-green-500 text-3xl font-bold tracking-tighter uppercase italic drop-shadow-lg">CONSCRIPTION NOTICE</h2>
            <div className="bg-black/40 p-6 pixel-border border-green-900/50">
              <p className="text-white text-xs italic leading-relaxed text-center">
                "Citizen Roberto! The Swiss Confederation requires your architectural expertise... for digging trenches. 
                Your service starts NOW. Do not resist the call of duty."
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {view === 'MAIN' ? (
              <motion.div 
                key="main"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
              >
                <button 
                  disabled={availableExcuses.length === 0}
                  onClick={() => setView('EXCUSES')}
                  className="pixel-button flex flex-col items-center justify-center gap-3 p-6 group disabled:opacity-50 min-h-[100px]"
                >
                  <Shield className={`text-blue-400 w-8 h-8 ${availableExcuses.length > 0 ? 'group-hover:animate-bounce' : ''}`} />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest">TALK YOUR WAY OUT</span>
                    <span className="text-[7px] text-gray-500 italic mt-1 text-center">
                      {availableExcuses.length > 0 ? 'Requires a unique excuse' : 'NO EXCUSES LEFT'}
                    </span>
                  </div>
                </button>

                <button 
                  disabled={stats.money < 100}
                  onClick={onPayWayOut}
                  className="pixel-button flex flex-col items-center justify-center gap-3 p-6 group disabled:opacity-50 min-h-[100px]"
                >
                  <DollarSign className="text-yellow-400 w-8 h-8 group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest">PAY FOR EXEMPTION (100 CHF)</span>
                    <span className="text-[7px] text-gray-500 italic mt-1">Hire a 'consultant'</span>
                  </div>
                </button>

                <button 
                  onClick={() => onGoWithArmy(Math.floor(Math.random() * 5) + 2)}
                  className="pixel-button flex flex-col items-center justify-center gap-3 p-6 group bg-green-900/20 min-h-[100px]"
                >
                  <Briefcase className="text-green-400 w-8 h-8 group-hover:rotate-12 transition-transform" />
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest">SERVE YOUR COUNTRY</span>
                    <span className="text-[7px] text-gray-500 italic mt-1">Lose 2-6 days of progress</span>
                  </div>
                </button>

                <button 
                  onClick={onDecline}
                  className="pixel-button flex flex-col items-center justify-center gap-3 p-6 group bg-red-900/20 border-red-500 min-h-[100px]"
                >
                  <XCircle className="text-red-500 w-8 h-8 group-hover:scale-125 transition-transform" />
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest">DECLINE SERVICE</span>
                    <span className="text-[7px] text-red-400 italic font-bold mt-1">WARNING: PRISON SENTENCE</span>
                  </div>
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="excuses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-3 w-full max-w-md"
              >
                <div className="text-[9px] text-blue-400 uppercase font-bold text-center mb-4 tracking-widest">Select your excuse</div>
                {availableExcuses.length > 0 ? (
                  availableExcuses.map(excuse => (
                    <button 
                      key={excuse.id}
                      onClick={() => onTalkWayOut(excuse.id)}
                      className="pixel-button text-center text-[9px] p-4 hover:bg-zinc-800 transition-all border-white/10 hover:border-white/40"
                    >
                      "{excuse.text}"
                    </button>
                  ))
                ) : (
                  <div className="text-center p-6 border-2 border-dashed border-red-500 text-red-500 text-[10px] font-bold uppercase">
                    YOU HAVE RUN OUT OF EXCUSES.
                  </div>
                )}
                <button 
                  onClick={() => setView('MAIN')}
                  className="text-[8px] text-gray-500 hover:text-white mt-4 uppercase underline text-center tracking-widest w-full"
                >
                  Go Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const SoldierSprite = ({ color, delay = 0 }: { color: string, delay?: number }) => (
  <motion.div 
    animate={{ y: [0, -4, 0] }}
    transition={{ duration: 2, repeat: Infinity, delay }}
    className="w-16 h-24 relative flex flex-col items-center"
  >
    {/* Helmet */}
    <div className={`w-10 h-6 ${color} pixel-border z-20`} />
    {/* Head */}
    <div className="w-8 h-8 bg-orange-100 pixel-border -mt-1 relative z-10">
      <div className="absolute top-3 left-1 w-1.5 h-1.5 bg-black" />
      <div className="absolute top-3 right-1 w-1.5 h-1.5 bg-black" />
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-black/20" />
    </div>
    {/* Body */}
    <div className={`w-12 h-14 ${color} pixel-border -mt-1 relative`}>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-black/40" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-black/40" />
    </div>
  </motion.div>
);
