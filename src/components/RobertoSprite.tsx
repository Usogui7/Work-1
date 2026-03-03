import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RobertoStats } from '../types';

interface RobertoSpriteProps {
  stats: RobertoStats;
  lastAction?: string;
}

export const RobertoSprite: React.FC<RobertoSpriteProps> = ({ stats, lastAction }) => {
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState("neutral");

  const brags = [
    "My EPFL degree really prepared me for this level of precision.",
    "As an architect, I appreciate the structural integrity of this task.",
    "I once designed a villa in Ouchy that was featured in 'Mundane Architecture Today'.",
    "Precision is key. That's what they taught us at the École Polytechnique Fédérale de Lausanne.",
    "I'm basically the Le Corbusier of brushing my teeth.",
    "This routine is as well-designed as the Rolex Learning Center.",
    "I could have been a starchitect, but I chose this humble life in Lausanne.",
    "Even my morning coffee follows the golden ratio. EPFL taught me that.",
    "The structural load of this conversation is quite high, don't you think?",
    "I graduated with honors. My thesis on 'Mundane Spaces' was legendary at EPFL.",
    "I'm not saying I'm the best architect in Switzerland, but my diploma says EPFL.",
    "My spatial awareness is so high I can find my socks in total darkness.",
    "I've optimized my walking path to the bar for maximum efficiency.",
    "The cantilever on this sandwich is structurally unsound, but delicious.",
    "I'm currently working at Badger. We do digital loyalty cards. It's... a pivot.",
    "Paulo is stressed. I told him he needs more symmetry in his life.",
    "Why design skyscrapers when you can design the 'Buy 10 Get 1 Free' coffee flow?",
    "My architectural background really helps me understand the 'structure' of a database.",
    "I'm basically overqualified for existence at this point.",
    "I've applied the golden ratio to my Badger spreadsheets. Paulo didn't notice.",
    "Lausanne is beautiful, but its urban planning lacks my specific touch.",
    "I once considered moving to Zurich, but the lack of hills was architecturally offensive.",
    "I'm not just an architect; I'm a curator of mundane experiences.",
    "Switzerland is too quiet. Sometimes I want to scream into the void, but the void has a noise ordinance.",
    "The structural integrity of this country is impeccable, but where is the soul? Where is the chaos?",
    "I'm thinking of designing a skyscraper made entirely of cigarette filters. A monument to my stress.",
    "EPFL didn't teach me how to deal with the overwhelming neutrality of the Swiss plateau.",
    "I'm a Swiss architect. I'm precise, I'm expensive, and I'm deeply bored.",
    "The golden ratio is everywhere in Lausanne, if you know where to look. I know where to look.",
    "I'm not smoking, I'm performing a thermal analysis of a tobacco-based structure.",
    "Sometimes I miss the chaos of... well, anywhere that isn't this organized.",
    "My architectural vision is too big for this small, perfect country.",
    "I need a cigarette. The smoke helps me visualize the airflow in a non-existent atrium.",
    "Is it just me, or is the lake looking particularly symmetrical today? It's unsettling.",
    "I'm tired of being Swiss. I want to be... I don't know, a cloud? Clouds don't have to pay rent in Lausanne.",
    "I've optimized my cigarette breaks to coincide with peak existential dread.",
    "The architecture of my life is a series of well-planned disappointments.",
    "I'm too humble to admit that I'm the only person in this city who understands the true meaning of a cantilever.",
  ];

  const compliments = [
    "Looking sharp, Roberto. Simply sharp.",
    "Excellence is a habit, and I am very habitual.",
    "Another task mastered. I'm unstoppable.",
    "Roberto, you've done it again. Pure genius.",
    "I'm so humble it's actually impressive.",
    "My modesty is my greatest design achievement.",
    "Just a simple man with a world-class education.",
  ];

  const complaints = [
    "This task is beneath my architectural talents.",
    "I should be designing skyscrapers, not doing push-ups.",
    "The ergonomics of this situation are appalling.",
    "I'm too talented for this level of mundanity.",
  ];

  useEffect(() => {
    if (lastAction) {
      const rand = Math.random();
      let pool = compliments;
      if (rand > 0.7) pool = brags;
      else if (rand > 0.4) pool = complaints;
      
      setMessage(pool[Math.floor(Math.random() * pool.length)]);
      
      const timer = setTimeout(() => setMessage(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

  useEffect(() => {
    if (stats.energy < 20) setMood("tired");
    else if (stats.hygiene < 20) setMood("stinky");
    else if (stats.social > 80) setMood("happy");
    else if (stats.money < 10) setMood("confused");
    else if (stats.social < 20) setMood("angry");
    else if (stats.fitness > 80) setMood("smug");
    else setMood("neutral");
  }, [stats]);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-6 mr-2 p-5 pixel-card bg-zinc-900 text-white border-white border-2 text-[12px] max-w-[260px] relative shadow-[12px_12px_0_rgba(0,0,0,0.8)] z-[110] leading-relaxed"
          >
            <div className="font-bold text-blue-400 border-b border-white/20 mb-2 pb-1 tracking-widest uppercase">ROBERTO SAYS:</div>
            <div className="font-medium">{message}</div>
            {/* Speech bubble tail */}
            <div className="absolute bottom-[-14px] right-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-white" />
            <div className="absolute bottom-[-10px] right-[42px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-zinc-900 z-10" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Roberto Sprite (Overhauled Pixel Style based on reference) */}
        <motion.div 
          animate={{ 
            y: mood === 'tired' ? [0, -1, 0] : [0, -4, 0],
            rotate: mood === 'happy' || mood === 'smug' ? [0, 2, -2, 0] : mood === 'angry' ? [-2, 2, -2] : 0
          }}
          transition={{ repeat: Infinity, duration: mood === 'tired' ? 4 : 2.5 }}
          className="w-24 h-28 relative"
        >
          {/* Main Body/Shirt */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-12 bg-[#2a6a8a] pixel-border" />
          
          {/* Neckline */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-8 h-4 bg-[#d9b89e]" />

          {/* Head */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-18 h-18 bg-[#d9b89e] pixel-border">
            {/* Detailed Hair based on reference */}
            <div className="absolute -top-4 -left-2 w-22 h-10 flex flex-wrap gap-0 overflow-visible">
              {/* Top hair mass */}
              <div className="absolute -top-2 left-2 w-16 h-6 bg-[#4e342e] pixel-border" />
              <div className="absolute top-0 -left-1 w-6 h-8 bg-[#4e342e] pixel-border" />
              <div className="absolute top-0 right-0 w-4 h-6 bg-[#4e342e] pixel-border" />
              {/* Strands */}
              <div className="absolute top-2 left-1 w-2 h-2 bg-[#3e2723]" />
              <div className="absolute top-1 right-3 w-2 h-2 bg-[#3e2723]" />
            </div>

            {/* Expressive Brown Eyes (Updated to Brown) */}
            <div className="absolute top-6 left-3 w-4 h-4 bg-white flex items-center justify-center pixel-border overflow-hidden">
              <motion.div 
                animate={mood === 'tired' ? { y: 2 } : mood === 'smug' ? { y: -1 } : { y: 0 }}
                className="w-2 h-2 bg-[#5d4037]" 
              /> {/* Brown Iris */}
            </div>
            <div className="absolute top-6 right-3 w-4 h-4 bg-white flex items-center justify-center pixel-border overflow-hidden">
              <motion.div 
                animate={mood === 'tired' ? { y: 2 } : mood === 'smug' ? { y: -1 } : { y: 0 }}
                className="w-2 h-2 bg-[#5d4037]" 
              /> {/* Brown Iris */}
            </div>
            
            {/* Eyebrows */}
            <motion.div 
              animate={mood === 'angry' ? { rotate: 20, y: 1 } : mood === 'confused' ? { y: -2 } : { rotate: 0, y: 0 }}
              className="absolute top-4 left-3 w-4 h-1 bg-[#2d1b18]" 
            />
            <motion.div 
              animate={mood === 'angry' ? { rotate: -20, y: 1 } : mood === 'confused' ? { y: -1 } : { rotate: 0, y: 0 }}
              className="absolute top-4 right-3 w-4 h-1 bg-[#2d1b18]" 
            />

            {/* Nose */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-2 h-3 bg-[#c4a484]" />

            {/* Mouth based on mood */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              {mood === 'tired' && <div className="w-6 h-1 bg-black/80" />}
              {mood === 'happy' && <div className="w-7 h-3 border-b-4 border-black/80 rounded-full" />}
              {mood === 'smug' && <div className="w-6 h-2 border-b-2 border-black/80 rounded-full" />}
              {mood === 'neutral' && <div className="w-6 h-[2px] bg-black/80" />}
              {mood === 'confused' && <div className="w-4 h-2 border-2 border-black/80 rounded-sm" />}
              {mood === 'angry' && <div className="w-6 h-2 bg-red-900/40 border-t-2 border-black/80" />}
              {mood === 'stinky' && (
                <div className="flex flex-col items-center">
                  <div className="w-4 h-1 bg-green-600/60" />
                  <div className="text-[6px] text-green-500 animate-bounce">~</div>
                </div>
              )}
            </div>
          </div>
          
          {/* EPFL Badge */}
          <div className="absolute bottom-4 right-2 w-5 h-4 bg-red-600 border border-white/40 flex items-center justify-center shadow-sm" title="EPFL Alum">
            <span className="text-[5px] text-white font-bold">EPFL</span>
          </div>
        </motion.div>
        
        {/* Mood Indicator */}
        <div className="absolute -bottom-4 right-0 bg-zinc-900 text-[10px] px-2 py-1 border-2 border-blue-400 text-blue-400 font-bold whitespace-nowrap shadow-xl uppercase tracking-tighter">
          {mood}
        </div>
      </div>
    </div>
  );
};
