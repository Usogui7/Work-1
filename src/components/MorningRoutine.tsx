import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MorningStep } from '../types';
import { User, Scissors, Droplets, Zap, Shirt, LogOut } from 'lucide-react';

interface MorningRoutineProps {
  onComplete: () => void;
  updateStats: (updates: any) => void;
}

export const MorningRoutine: React.FC<MorningRoutineProps> = ({ onComplete, updateStats }) => {
  const [step, setStep] = useState<MorningStep>('WAKE_UP');
  const [progress, setProgress] = useState(0);
  const [pushups, setPushups] = useState(0);

  const nextStep = () => {
    setProgress(0);
    if (step === 'WAKE_UP') {
      updateStats({}, 'wake');
      setStep('BRUSH_TEETH');
    }
    else if (step === 'BRUSH_TEETH') { 
      updateStats({ hygiene: 10 }, 'brush_teeth'); 
      setStep('COMB_HAIR'); 
    }
    else if (step === 'COMB_HAIR') { 
      updateStats({ hygiene: 5 }, 'comb'); 
      setStep('FLOSS'); 
    }
    else if (step === 'FLOSS') { 
      updateStats({ hygiene: 10 }, 'floss'); 
      setStep('PUSH_UPS'); 
    }
    else if (step === 'PUSH_UPS') { 
      updateStats({ fitness: 5, energy: -10 }, 'push_ups'); 
      setStep('GET_DRESSED'); 
    }
    else if (step === 'GET_DRESSED') {
      updateStats({}, 'get_dressed');
      setStep('READY');
    }
  };

  const handleAction = () => {
    if (step === 'PUSH_UPS') {
      const nextPushups = pushups + 1;
      setPushups(nextPushups);
      if (nextPushups >= 10) {
        nextStep();
      }
    } else {
      const nextProgress = progress + 20;
      if (nextProgress >= 100) {
        setProgress(0);
        nextStep();
      } else {
        setProgress(nextProgress);
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-zinc-900 flex flex-col items-center justify-center p-4">
      <div className="pixel-card w-full max-w-md relative min-h-[400px] flex flex-col items-center justify-between">
        <div className="text-center w-full">
          <h2 className="text-lg mb-2 text-yellow-400">MORNING ROUTINE</h2>
          <div className="h-2 w-full bg-gray-800 border-2 border-white mb-4">
            <div 
              className="h-full bg-green-500 transition-all duration-200" 
              style={{ width: `${(pushups / 10) * 100 || progress}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            {step === 'WAKE_UP' && (
              <>
                <div className="text-center">Roberto is awake. Barely.</div>
                <User size={64} className="text-blue-400" />
                <button onClick={nextStep} className="pixel-button">GET UP</button>
              </>
            )}

            {step === 'BRUSH_TEETH' && (
              <>
                <div className="text-center">Brush those pearly whites.</div>
                <Droplets size={64} className="text-blue-200" />
                <button onClick={handleAction} className="pixel-button">BRUSH BRUSH</button>
              </>
            )}

            {step === 'COMB_HAIR' && (
              <>
                <div className="text-center">Tame the morning mane.</div>
                <Scissors size={64} className="text-yellow-600" />
                <button onClick={handleAction} className="pixel-button">COMB COMB</button>
              </>
            )}

            {step === 'FLOSS' && (
              <>
                <div className="text-center">Dentists love this one trick.</div>
                <div className="w-16 h-1 bg-white" />
                <button onClick={handleAction} className="pixel-button">FLOSS FLOSS</button>
              </>
            )}

            {step === 'PUSH_UPS' && (
              <>
                <div className="text-center">Gains. Mundane gains. ({pushups}/10, -10 NRG)</div>
                <Zap size={64} className="text-orange-500" />
                <button onClick={handleAction} className="pixel-button">PUSH UP!</button>
              </>
            )}

            {step === 'GET_DRESSED' && (
              <>
                <div className="text-center">Put on the uniform of life.</div>
                <Shirt size={64} className="text-indigo-400" />
                <button onClick={nextStep} className="pixel-button">DRESS UP</button>
              </>
            )}

            {step === 'READY' && (
              <>
                <div className="text-center">Roberto is ready to face Lausanne.</div>
                <LogOut size={64} className="text-red-400" />
                <button onClick={onComplete} className="pixel-button">LEAVE APARTMENT</button>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="text-[10px] text-gray-500 mt-4">
          {step === 'PUSH_UPS' ? 'TAP REPEATEDLY' : 'CLICK TO PROGRESS'}
        </div>
      </div>
    </div>
  );
};
