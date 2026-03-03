import React from 'react';
import { motion } from 'motion/react';

interface TitleScreenProps {
  onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  return (
    <div 
      className="h-screen w-screen flex flex-col items-center justify-center bg-blue-900 overflow-hidden relative"
      onClick={onStart}
    >
      {/* Retro Sky/Sun */}
      <div className="absolute top-20 w-64 h-64 bg-orange-500 rounded-full blur-xl opacity-50" />
      
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: 'spring' }}
        className="z-10 text-center"
      >
        <h1 className="text-4xl md:text-6xl text-yellow-400 mb-4 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
          ROB'S
        </h1>
        <h2 className="text-2xl md:text-4xl text-white mb-12 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
          ROUTINE
        </h2>
        
        <div className="text-white text-sm md:text-lg blink cursor-pointer">
          PRESS START / CLICK TO BEGIN
        </div>
      </motion.div>

      {/* Pixelated Ground */}
      <div className="absolute bottom-0 w-full h-32 bg-green-800 border-t-8 border-green-900" />
      
      {/* Roberto Silhouette */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-16 h-24 bg-black opacity-30" />
    </div>
  );
};
