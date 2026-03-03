import React from 'react';
import { motion } from 'motion/react';
import { RobertoStats } from '../types';
import { AlertCircle, Zap, Heart, DollarSign } from 'lucide-react';

interface RandomEventProps {
  stats: RobertoStats;
  onAction: (deltas: Partial<RobertoStats>) => void;
}

interface EventData {
  title: string;
  description: string;
  icon: React.ReactNode;
  options: {
    text: string;
    deltas: Partial<RobertoStats>;
  }[];
}

const EVENTS: EventData[] = [
  {
    title: "ELECTRICITY BILL",
    description: "The bill has arrived. It's higher than expected. Pay it or face the consequences.",
    icon: <Zap className="text-yellow-400" />,
    options: [
      { text: "PAY 50 CHF", deltas: { money: -50 } },
      { text: "IGNORE IT (-20 HYG)", deltas: { hygiene: -20 } }
    ]
  },
  {
    title: "SURPRISE INSPECTION",
    description: "Paulo is checking the office. He looks like he's about to explode.",
    icon: <AlertCircle className="text-red-500" />,
    options: [
      { text: "SHOW HIM BLUEPRINTS (+10 REP)", deltas: { reputation: 10, energy: -10 } },
      { text: "HIDE IN THE TOILET (-5 REP)", deltas: { reputation: -5, social: -10 } }
    ]
  },
  {
    title: "MOM CALLS",
    description: "Your mom is calling from Ecuador. She wants to know if you're eating enough.",
    icon: <Heart className="text-pink-400" />,
    options: [
      { text: "TALK FOR AN HOUR (+20 SOC)", deltas: { social: 20, energy: -5 } },
      { text: "SEND A TEXT (+5 SOC)", deltas: { social: 5 } }
    ]
  },
  {
    title: "FOUND A COIN",
    description: "You found a shiny coin on the sidewalk near the Flon.",
    icon: <DollarSign className="text-green-400" />,
    options: [
      { text: "PICK IT UP (+5 CHF)", deltas: { money: 5 } },
      { text: "LEAVE IT (HUMILITY +10)", deltas: { social: 10 } }
    ]
  }
];

export const RandomEvent: React.FC<RandomEventProps> = ({ stats, onAction }) => {
  const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];

  return (
    <div className="h-screen w-screen bg-black/90 flex items-center justify-center p-4 z-[300]">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="pixel-card max-w-md w-full bg-zinc-900 border-4 border-white p-8 flex flex-col items-center gap-6 shadow-[16px_16px_0_rgba(0,0,0,1)]"
      >
        <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center border-2 border-white/20">
          {event.icon}
        </div>
        
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">{event.title}</h2>
        <p className="text-center text-sm text-gray-400 leading-relaxed italic">"{event.description}"</p>
        
        <div className="flex flex-col gap-3 w-full mt-4">
          {event.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAction(opt.deltas)}
              className="pixel-button w-full text-xs p-4 hover:bg-white hover:text-black transition-all"
            >
              {opt.text}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
