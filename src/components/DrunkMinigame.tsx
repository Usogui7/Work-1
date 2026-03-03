import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';

interface DrunkMinigameProps {
  onSuccess: () => void;
  onFail: () => void;
}

export const DrunkMinigame: React.FC<DrunkMinigameProps> = ({ onSuccess, onFail }) => {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 0.1);
        // Passive drain
        setProgress(prev => Math.max(0, prev - 0.5));
      }, 100);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && !isFinished) {
      setIsFinished(true);
      onFail();
    }
  }, [timeLeft, isFinished, onFail]);

  const handleClick = () => {
    if (isFinished) return;
    const nextProgress = progress + 5;
    if (nextProgress >= 100) {
      setIsFinished(true);
      onSuccess();
    } else {
      setProgress(nextProgress);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="pixel-card w-full max-w-md bg-zinc-900 border-red-500 border-4 p-8 flex flex-col items-center gap-8 shadow-[20px_20px_0_rgba(255,0,0,0.3)]">
        <div className="text-center">
          <h2 className="text-2xl text-red-500 font-bold mb-2 animate-pulse uppercase">WAKE UP ROBERTO!</h2>
          <p className="text-[10px] text-gray-400">HE'S PASSING OUT FROM THE CRAFT BEER!</p>
        </div>

        <div className="w-full h-8 bg-zinc-800 border-2 border-white relative overflow-hidden">
          <motion.div 
            className="h-full bg-yellow-500"
            animate={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
            CONSCIOUSNESS: {Math.round(progress)}%
          </div>
        </div>

        <div className="text-4xl font-bold text-white tabular-nums">
          {timeLeft.toFixed(1)}s
        </div>

        <button 
          onClick={handleClick}
          className="pixel-button bg-red-600 hover:bg-red-500 text-white p-8 w-full flex flex-col items-center gap-2 transform active:scale-95 transition-transform"
        >
          <Zap size={32} className="animate-bounce" />
          <span className="text-xl font-bold">CLICK REPEATEDLY!</span>
        </button>

        <div className="text-[8px] text-gray-500 uppercase tracking-widest">
          Failure is not an option for an EPFL Alum.
        </div>
      </div>
    </div>
  );
};
