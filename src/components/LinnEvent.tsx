import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Heart, MessageSquare } from 'lucide-react';

interface LinnEventProps {
  onComplete: (deltas: any, response: string) => void;
}

export const LinnEvent: React.FC<LinnEventProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const dialogue = [
    {
      text: "Your phone vibrates. It's Linn. Your ex. The one who said your obsession with the Rolex Learning Center was 'unhealthy'.",
      options: [
        { text: "ANSWER THE CALL", next: 1 },
        { text: "IGNORE (FEEL HOLLOW)", action: () => onComplete({ social: -10, energy: -5 }, "ROBERTO: 'I CAN'T DEAL WITH THIS RIGHT NOW.'") }
      ]
    },
    {
      text: "Linn: 'Roberto? I... I saw your LinkedIn post about Badger. Are you really doing a startup with Paulo? In Lausanne?'",
      options: [
        { text: "IT'S ABOUT DISRUPTING LOYALTY, LINN.", next: 2 },
        { text: "I'M JUST TRYING TO BUILD SOMETHING REAL.", next: 2 }
      ]
    },
    {
      text: "Linn: 'You always wanted to build something real. But you're still in that same apartment, aren't you? Still smoking on the balcony and staring at the lake?'",
      options: [
        { text: "THE LAKE HAS PERFECT SYMMETRY, LINN.", next: 3 },
        { text: "I'VE CHANGED. I'M A COFOUNDER NOW.", next: 3 }
      ]
    },
    {
      text: "Linn: 'Maybe. I just... I miss the way you used to talk about architecture before the startup jargon took over. Take care of yourself, Rob.'",
      options: [
        { text: "YOU TOO, LINN.", action: () => onComplete({ social: 20, energy: -15 }, "ROBERTO: 'THAT WAS... HEAVY. I NEED A CIGARETTE.'") }
      ]
    }
  ];

  const current = dialogue[step];

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="pixel-card max-w-md w-full bg-zinc-900 border-4 border-pink-500 p-8 flex flex-col items-center gap-6 shadow-[16px_16px_0_rgba(0,0,0,1)]"
      >
        <div className="w-16 h-16 bg-pink-900/40 rounded-full flex items-center justify-center border-2 border-pink-500/50">
          <Phone className="text-pink-400" />
        </div>
        
        <h2 className="text-xl font-bold text-pink-400 tracking-widest uppercase">CALL FROM LINN</h2>
        <p className="text-center text-sm text-gray-300 leading-relaxed italic">"{current.text}"</p>
        
        <div className="flex flex-col gap-3 w-full mt-4">
          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => {
                if (opt.action) {
                  opt.action();
                } else if (opt.next !== undefined) {
                  setStep(opt.next);
                }
              }}
              className="pixel-button w-full text-xs p-4 hover:bg-pink-500 hover:text-white transition-all"
            >
              {opt.text}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
