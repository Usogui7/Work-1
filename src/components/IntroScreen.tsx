import React from 'react';
import { motion } from 'motion/react';

interface IntroScreenProps {
  onContinue: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onContinue }) => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-900 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pixel-card max-w-lg bg-black/80 text-white p-8 border-4 border-white"
      >
        <h2 className="text-xl text-yellow-400 mb-6 border-b-4 border-yellow-400 pb-2">MEET ROBERTO</h2>
        
        <div className="space-y-4 text-xs leading-relaxed">
          <p>
            Roberto is a <span className="text-blue-400">truly humble</span> young man. 
            Despite being a <span className="text-green-400">brilliant architect</span> who graduated with honors from the prestigious <span className="text-red-500 font-bold">EPFL</span>, he never lets it get to his head. He's simply better than most people, and he knows it—humbly.
          </p>
          <p>
            He's currently living in Lausanne, designing structures that push the boundaries of modern engineering. However, his mind is so occupied with complex structural integrity and the <span className="text-yellow-400">Rolex Learning Center's</span> curves that he often forgets the basics of human existence.
          </p>
          <p className="text-yellow-200 italic border-l-2 border-yellow-400 pl-2">
            "I'm just a simple guy with a very complex degree from a world-class institution," he often says.
          </p>
          <p className="border-t border-white/20 pt-4">
            He needs <span className="text-yellow-400 font-bold uppercase">YOU</span> to run his life. Manage his hygiene, his work schedule, and his social interactions while he focuses on being the greatest architect Switzerland has ever seen.
          </p>
        </div>

        <button 
          onClick={onContinue}
          className="pixel-button w-full mt-8 bg-white text-black hover:bg-yellow-400"
        >
          START ROBERTO'S DAY
        </button>
      </motion.div>
    </div>
  );
};
