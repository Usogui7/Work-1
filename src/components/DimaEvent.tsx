import React from 'react';
import { motion } from 'motion/react';
import { Coins, HeartOff, User } from 'lucide-react';

interface DimaEventProps {
  onPay: (response: string) => void;
  onIgnore: (response: string) => void;
}

export const DimaEvent: React.FC<DimaEventProps> = ({ onPay, onIgnore }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="pixel-card bg-zinc-900 border-yellow-500 max-w-md w-full p-6 flex flex-col items-center gap-6"
      >
        <div className="text-center">
          <h2 className="text-yellow-400 text-lg mb-2">A CHALLENGER APPEARS!</h2>
          <p className="text-[10px] text-white">A guy named Dima approaches you near the Rolex Learning Center.</p>
        </div>

        <div className="relative w-24 h-24 bg-zinc-800 pixel-border flex items-center justify-center overflow-hidden">
          {/* Dima Sprite */}
          <div className="w-12 h-16 bg-slate-700 relative pixel-border">
            {/* Head */}
            <div className="absolute -top-5 left-1 w-10 h-8 bg-orange-100 pixel-border">
              {/* Black Hair */}
              <div className="absolute -top-2 -left-1 w-12 h-4 bg-black" />
              {/* Little Beard */}
              <div className="absolute bottom-0 left-2 w-6 h-2 bg-black/80" />
              {/* Eyes */}
              <div className="absolute top-3 left-2 w-1 h-1 bg-black" />
              <div className="absolute top-3 right-2 w-1 h-1 bg-black" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-800 text-white p-3 text-[10px] relative pixel-card border-white/20">
          <div className="font-bold mb-1 text-yellow-400">DIMA SAYS:</div>
          "Hey Roberto! Long time no see. Listen, I'm a bit short on cash for the train to Geneva. Could you spare 20 CHF? You're a big-shot EPFL architect now, right?"
          <div className="absolute top-[-8px] left-4 w-3 h-3 bg-zinc-800 border-l-2 border-t-2 border-white/20 rotate-45" />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button 
            onClick={() => onPay("DIMA: 'THANKS ROBERTO! YOU'RE A REAL ONE. SEE YOU IN GENEVA!'")}
            className="pixel-button bg-green-600 text-white flex items-center justify-center gap-2 text-xs py-3"
          >
            <Coins size={14} /> GIVE 20 CHF (STAY HUMBLE)
          </button>
          <button 
            onClick={() => onIgnore("DIMA: 'OH... I SEE. THE EPFL FAME CHANGED YOU. IT'S COOL, I'LL WALK.'")}
            className="pixel-button bg-red-600 text-white flex items-center justify-center gap-2 text-xs py-3"
          >
            <HeartOff size={14} /> "SORRY, DIMA." (FEEL GUILTY)
          </button>
        </div>

        <div className="text-[8px] text-gray-500 italic text-center">
          Dima is known for his world-class guilt-tripping.
        </div>
      </motion.div>
    </div>
  );
};
