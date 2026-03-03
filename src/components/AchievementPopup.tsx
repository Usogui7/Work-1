import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';

interface AchievementPopupProps {
  achievement: string | null;
  onClear: () => void;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievement, onClear }) => {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClear, 2500);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClear]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-1/2 -translate-x-1/2 z-[300] w-full max-w-md px-4 pointer-events-none"
        >
          <div className="pixel-card bg-zinc-900 border-yellow-500 p-4 flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="bg-yellow-500 p-2 pixel-border">
              <Trophy size={20} className="text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-yellow-500 font-bold tracking-widest uppercase">Mundane Achievement Unlocked!</span>
              <span className="text-[10px] text-white font-bold leading-tight uppercase">
                {achievement}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
