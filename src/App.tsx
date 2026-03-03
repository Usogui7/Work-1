import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { Menu } from './components/Menu';
import { IntroScreen } from './components/IntroScreen';
import { MorningRoutine } from './components/MorningRoutine';
import { TownMap } from './components/TownMap';
import { LocationView } from './components/LocationView';
import { InventoryUI } from './components/InventoryUI';
import { GameOver } from './components/GameOver';
import { RobertoSprite } from './components/RobertoSprite';
import { DimaEvent } from './components/DimaEvent';
import { LinnEvent } from './components/LinnEvent';
import { DrunkMinigame } from './components/DrunkMinigame';
import { ArmyEvent } from './components/ArmyEvent';
import { RandomEvent } from './components/RandomEvent';
import { AchievementPopup } from './components/AchievementPopup';
import { GameState, RobertoStats, INITIAL_STATS, LocationType, Item, DAYS_OF_WEEK, MONTHS, WorkProject, NPCS } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Calendar, Menu as MenuIcon, Save, LogIn, Smartphone, ArrowLeft } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [stats, setStats] = useState<RobertoStats>(INITIAL_STATS);
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');
  const [lastAction, setLastAction] = useState<string | undefined>();
  const [achievement, setAchievement] = useState<string | null>(null);
  
  const audioCtx = useRef<AudioContext | null>(null);

  const condescendingAchievements: Record<string, string> = {
    'brush_teeth': "BIG MAN BRUSHED HIS TEETH! SO HYGIENIC!",
    'get_dressed': "WOW, LOOK AT YOU, BIG MAN! YOU PUT ON PANTS!",
    'shower': "CONGRATULATIONS, BIG MAN. YOU SURVIVED A SHOWER.",
    'push_ups': "BIG MAN DID A PUSH-UP! SO STRONG!",
    'work': "LOOK AT THE BIG MAN GOING TO WORK! CAPITALISM WINS!",
    'beer': "BIG MAN BOUGHT A BEER! WHAT A LEGEND!",
    'talk': "BIG MAN TALKED TO A PERSON! UNBELIEVABLE!",
    'gym': "BIG MAN LIFTED A WEIGHT! WATCH OUT WORLD!",
    'pickup': "BIG MAN FOUND AN ITEM! GENIUS LEVEL!",
    'sleep': "BIG MAN IS SLEEPING! REST WELL, CHAMP!",
    'steal': "BIG MAN STOLE SOMETHING! REBEL WITHOUT A CAUSE!",
    'floss': "BIG MAN FLOSSED! HIS DENTIST WILL BE SO PROUD!",
    'comb': "BIG MAN COMBED HIS HAIR! LOOKING SHARP!",
    'wake': "BIG MAN WOKE UP! THE WORLD TREMBLES!",
    'army_talk': "BIG MAN TALKED HIS WAY OUT OF SERVICE! A TRUE DIPLOMAT!",
    'army_pay': "BIG MAN PAID TO AVOID THE ARMY! CAPITALISM AT ITS FINEST!",
    'army_serve': "BIG MAN SERVED HIS COUNTRY! TRENCH DIGGING IS AN ART FORM!",
    'eat': "BIG MAN IS EATING! HE NEEDS HIS STRENGTH!",
  };

  const triggerAchievement = useCallback((taskKey: string) => {
    setStats(prev => {
      if ((prev.allTimeAchievements || []).includes(taskKey)) return prev;
      
      const achievementText = condescendingAchievements[taskKey] || "BIG MAN DID SOMETHING!";
      setAchievement(achievementText);
      
      return {
        ...prev,
        allTimeAchievements: [...(prev.allTimeAchievements || []), taskKey]
      };
    });
  }, []);

  const playPing = useCallback(() => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtx.current;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  // Global click listener for ping
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        playPing();
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [playPing]);

  // Game Over and State monitoring
  useEffect(() => {
    if (gameState === 'GAME_OVER' || gameState === 'TITLE' || gameState === 'MENU') return;

    if (stats.energy <= 0) {
      setGameOverReason('ROBERTO COLLAPSED FROM EXHAUSTION.');
      setGameState('GAME_OVER');
    } else if (stats.hygiene <= 0) {
      setGameOverReason('ROBERTO BECAME A BIOHAZARD.');
      setGameState('GAME_OVER');
    } else if (stats.money < -100) {
      setGameOverReason('ROBERTO IS CRUSHED BY DEBT.');
      setGameState('GAME_OVER');
    } else if (stats.reputation <= 0) {
      setGameOverReason('BADGER FAILED. PAULO BLAMES YOU. YOUR REPUTATION IS ZERO.');
      setGameState('GAME_OVER');
    } else if (stats.stolenCount >= 3) {
      setGameOverReason('ROBERTO WAS CAUGHT STEALING. HE IS NOW IN PRISON.');
      setGameState('GAME_OVER');
    } else if (stats.policeStrikes >= 3) {
      setGameOverReason('ROBERTO HAS ACCUMULATED 3 POLICE STRIKES. HE IS NOW IN PRISON.');
      setGameState('GAME_OVER');
    } else if (stats.beersDrunkToday >= 5) {
      setGameOverReason('ROBERTO HAS BECOME A PERMANENT FIXTURE AT THE BAR. HE IS NOW AN ALCOHOLIC.');
      setGameState('GAME_OVER');
    }

    // Rent Check at end of month (Day 30)
    if (stats.day > 30) {
      if (stats.money < 1000) {
        setGameOverReason('ROBERTO COULD NOT PAY RENT (1000 CHF). HE IS NOW HOMELESS.');
        setGameState('GAME_OVER');
      } else {
        // Pay rent and continue
        setStats(prev => ({ ...prev, money: prev.money - 1000, day: 1, month: prev.month + 1, achievementsEarnedToday: [] }));
      }
    }
  }, [stats, gameState]);

  const updateStats = useCallback((updates: Partial<RobertoStats>) => {
    setStats(prev => {
      const next = { ...prev };
      Object.assign(next, updates);

      // Clamp values
      next.energy = Math.min(100, Math.max(0, next.energy));
      next.hygiene = Math.min(100, Math.max(0, next.hygiene));
      next.fitness = Math.min(100, Math.max(0, next.fitness));
      next.social = Math.min(100, Math.max(0, next.social));
      
      return next;
    });
  }, []);

  const modifyStats = useCallback((deltas: Partial<Record<keyof RobertoStats, number>>, taskKey?: string) => {
    setStats(prev => {
      const next = { ...prev };
      (Object.keys(deltas) as Array<keyof RobertoStats>).forEach(key => {
        const val = deltas[key];
        if (typeof prev[key] === 'number' && typeof val === 'number') {
          (next[key] as number) += val;
        }
      });

      // Clamp values
      next.energy = Math.min(100, Math.max(0, next.energy));
      next.hygiene = Math.min(100, Math.max(0, next.hygiene));
      next.fitness = Math.min(100, Math.max(0, next.fitness));
      next.social = Math.min(100, Math.max(0, next.social));
      
      return next;
    });
    setLastAction(Date.now().toString());
    if (taskKey) triggerAchievement(taskKey);
  }, [triggerAchievement]);

  const handleAction = (hours: number, statsChange: Partial<Record<keyof RobertoStats, number>>, taskKey?: string) => {
    const totalMinutes = stats.hour * 60 + stats.minute + Math.round(hours * 60);
    const nextHour = Math.floor(totalMinutes / 60) % 24;
    const nextMinute = totalMinutes % 60;
    const daysPassed = Math.floor(totalMinutes / (24 * 60));
    const nextDay = stats.day + daysPassed;
    
    setStats(prev => {
      const next = { ...prev };
      
      // Apply stats change
      (Object.keys(statsChange) as Array<keyof RobertoStats>).forEach(key => {
        const val = statsChange[key];
        if (typeof prev[key] === 'number' && typeof val === 'number') {
          (next[key] as number) += val;
        }
      });

      // Natural depreciation based on time passed
      if (hours > 0) {
        next.energy -= hours * 2;
        next.hygiene -= hours * 3;
        next.social -= hours * 1.5;
        next.fitness -= hours * 0.5;
      }

      if (taskKey === 'sleep') {
        next.hygiene -= 40; // Significant drop when sleeping
        next.energy = 100;
      }

      if (taskKey === 'beer') {
        // Pint hygiene fix: don't decrease hygiene when buying a pint
        // The natural depreciation still applies, but we compensate here
        next.hygiene += hours * 3; 
      }

      // Apply time change
      next.hour = nextHour;
      next.minute = nextMinute;
      next.day = nextDay;
      
      if (daysPassed > 0) {
        next.achievementsEarnedToday = [];
        next.beersDrunkToday = 0;
        
        // Day 2 Unlocks
        if (next.day === 2) {
          next.unlockedLocations = ['HOME', 'WORK', 'BAR', 'GYM', 'CHALET', 'ALLEY'];
        }

        // Handle project deadlines
        const expiredProjects = next.activeProjects.filter(p => p.deadlineDay < nextDay && p.hoursSpent < p.hoursRequired);
        const repLoss = expiredProjects.length * 25;
        next.reputation = Math.max(0, next.reputation - repLoss);
        next.activeProjects = next.activeProjects.filter(p => p.deadlineDay >= nextDay || p.hoursSpent >= p.hoursRequired);

        // Generate new projects if needed
        if (next.activeProjects.length < 2) {
          const newProject: WorkProject = {
            id: `project_${next.day}_${Math.random().toString(36).substr(2, 5)}`,
            name: 'New Startup Task',
            description: 'Paulo found another "urgent" feature request.',
            hoursRequired: 6 + Math.floor(Math.random() * 6),
            hoursSpent: 0,
            reward: 100 + Math.floor(Math.random() * 100),
            deadlineDay: next.day + 3 + Math.floor(Math.random() * 3)
          };
          next.activeProjects.push(newProject);
        }
      }

      // Tutorial Progression
      if (next.tutorialStep === 0 && currentLocation === 'WORK') {
        next.tutorialStep = 1;
      } else if (next.tutorialStep === 1 && currentLocation === 'GYM') {
        next.tutorialStep = 2;
        next.unlockedLocations = Array.from(new Set([...next.unlockedLocations, 'GYM']));
      } else if (next.tutorialStep === 2 && currentLocation === 'BAR') {
        next.tutorialStep = 3;
        next.unlockedLocations = Array.from(new Set([...next.unlockedLocations, 'BAR']));
      }

      // Unlock locations based on tutorial
      if (next.tutorialStep === 1 && !next.unlockedLocations.includes('GYM')) {
        next.unlockedLocations = [...next.unlockedLocations, 'GYM'];
      }
      if (next.tutorialStep === 2 && !next.unlockedLocations.includes('BAR')) {
        next.unlockedLocations = [...next.unlockedLocations, 'BAR'];
      }

      if (taskKey === 'beer') {
        next.beersDrunkToday += 1;
      }

      // Clamp values
      next.energy = Math.min(100, Math.max(0, next.energy));
      next.hygiene = Math.min(100, Math.max(0, next.hygiene));
      next.fitness = Math.min(100, Math.max(0, next.fitness));
      next.social = Math.min(100, Math.max(0, next.social));
      next.reputation = Math.min(100, Math.max(0, next.reputation));
      
      return next;
    });

    setLastAction(Date.now().toString());
    if (taskKey) triggerAchievement(taskKey);

    if (taskKey === 'beer') {
      const nextBeers = stats.beersDrunkToday + 1;
      if (nextBeers === 3) {
        setGameState('DRUNK_MINIGAME');
      }
    }

    if (nextDay > stats.day) {
      setGameState('MORNING_ROUTINE');
      setCurrentLocation(null);
      triggerAchievement('sleep');
    }
  };

  // Random Events on Map
  useEffect(() => {
    if (gameState !== 'MAP') return;

    const timer = setTimeout(() => {
      const rand = Math.random();
      if (rand < 0.15) {
        if (stats.day >= 3 && Math.random() < 0.3) {
          setGameState('ARMY_EVENT');
        } else {
          setGameState('RANDOM_EVENT');
        }
      }
    }, 5000 + Math.random() * 15000); // Random delay between 5-20s

    return () => clearTimeout(timer);
  }, [gameState, stats.day]);

  const handlePickup = (item: Item) => {
    if (!stats.inventory.find(i => i.id === item.id)) {
      setStats(prev => ({
        ...prev,
        inventory: [...prev.inventory, item],
        stolenCount: item.isStolen ? prev.stolenCount + 1 : prev.stolenCount
      }));
      setLastAction('pickup_' + item.id);
      triggerAchievement(item.isStolen ? 'steal' : 'pickup');
    }
  };

  const handleTalk = (npcId: string, change: number) => {
    modifyStats({
      social: 5,
      energy: -2,
    }, 'talk');
    setStats(prev => ({
      ...prev,
      relationships: {
        ...prev.relationships,
        [npcId]: Math.min(100, (prev.relationships[npcId] || 0) + change)
      }
    }));
    setLastAction('talk_' + npcId);
  };

  const saveGame = (slot: number) => {
    localStorage.setItem(`robs_routine_save_${slot}`, JSON.stringify(stats));
    setAchievement(`GAME SAVED TO SLOT ${slot}!`);
  };

  const loadGame = (slot: number) => {
    const saved = localStorage.getItem(`robs_routine_save_${slot}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setStats({ ...INITIAL_STATS, ...parsed });
      setGameState('MAP');
      setAchievement(`GAME LOADED FROM SLOT ${slot}!`);
    }
  };

  const handleWorkOnProject = (projectId: string) => {
    setStats(prev => {
      const project = prev.activeProjects.find(p => p.id === projectId);
      if (!project || project.hoursSpent >= project.hoursRequired) return prev;

      const updatedProjects = prev.activeProjects.map(p => {
        if (p.id === projectId) {
          return { ...p, hoursSpent: p.hoursSpent + 1 };
        }
        return p;
      });

      const completedNow = updatedProjects.find(p => p.id === projectId && p.hoursSpent >= p.hoursRequired);
      const moneyGain = completedNow ? completedNow.reward : 0;

      let nextHour = prev.hour + 1;
      let nextDay = prev.day;
      let achievementsEarnedToday = prev.achievementsEarnedToday;
      let beersDrunkToday = prev.beersDrunkToday;

      if (nextHour >= 24) {
        nextHour = 0;
        nextDay += 1;
        achievementsEarnedToday = [];
        beersDrunkToday = 0;
      }

      return {
        ...prev,
        activeProjects: updatedProjects,
        money: prev.money + moneyGain,
        energy: Math.max(0, prev.energy - 15),
        hygiene: Math.max(0, prev.hygiene - 5),
        hour: nextHour,
        day: nextDay,
        achievementsEarnedToday,
        beersDrunkToday
      };
    });

    const project = stats.activeProjects.find(p => p.id === projectId);
    if (project && project.hoursSpent + 1 >= project.hoursRequired) {
      triggerAchievement('work');
    }
  };

  const dayOfWeek = DAYS_OF_WEEK[(stats.day - 1) % 7];
  const monthName = MONTHS[(stats.month - 1) % 12];

  const renderState = () => {
    switch (gameState) {
      case 'TITLE':
        return <TitleScreen onStart={() => setGameState('MENU')} />;
      case 'MENU':
        return (
          <Menu 
            onNewGame={() => {
              setStats(INITIAL_STATS);
              setGameState('INTRO');
            }} 
            onLoadGame={loadGame}
            onSaveGame={saveGame}
            currentStats={stats}
          />
        );
      case 'INTRO':
        return <IntroScreen onContinue={() => setGameState('MORNING_ROUTINE')} />;
      case 'MORNING_ROUTINE':
        return (
          <MorningRoutine 
            onComplete={() => setGameState('MAP')} 
            updateStats={(deltas, taskKey) => modifyStats(deltas, taskKey)}
          />
        );
      case 'MAP':
        return (
          <TownMap 
            hour={stats.hour}
            unlockedLocations={stats.unlockedLocations}
            onSelectLocation={(loc) => {
              const rand = Math.random();
              if (rand < 0.08 && stats.day >= 3) {
                setGameState('ARMY_EVENT');
              } else if (loc === 'HOME' && stats.day === 1 && stats.hour >= 18 && !(stats.achievementsEarnedToday || []).includes('dima_met')) {
                setGameState('DIMA_EVENT');
              } else {
                setCurrentLocation(loc);
                setGameState('LOCATION');
              }
            }} 
          />
        );
      case 'LOCATION':
        if (!currentLocation) return null;
        return (
          <LocationView 
            location={currentLocation}
            stats={stats}
            onBack={() => setGameState('MAP')}
            onAction={handleAction}
            onPickup={handlePickup}
            onTalk={handleTalk}
            modifyStats={modifyStats}
            onWorkOnProject={handleWorkOnProject}
            onVisited={(loc) => {
              if (!(stats.visitedLocations || []).includes(loc)) {
                setStats(prev => ({ ...prev, visitedLocations: [...(prev.visitedLocations || []), loc] }));
              }
            }}
          />
        );
      case 'DIMA_EVENT':
        return (
          <DimaEvent 
            onPay={(response) => {
              modifyStats({ money: -20, social: 10 });
              setAchievement(response);
              setStats(prev => ({ ...prev, achievementsEarnedToday: [...prev.achievementsEarnedToday, 'dima_met'] }));
              setCurrentLocation('HOME');
              setGameState('LOCATION');
            }}
            onIgnore={(response) => {
              modifyStats({ social: -15, energy: -10 });
              setAchievement(response);
              setStats(prev => ({ ...prev, achievementsEarnedToday: [...prev.achievementsEarnedToday, 'dima_met'] }));
              setCurrentLocation('HOME');
              setGameState('LOCATION');
            }}
          />
        );
      case 'DRUNK_MINIGAME':
        return (
          <DrunkMinigame 
            onSuccess={() => {
              setGameState('LOCATION');
              triggerAchievement('beer');
            }}
            onFail={() => {
              modifyStats({ energy: -50, social: -20, hygiene: -10 });
              setGameState('LOCATION');
            }}
          />
        );
      case 'ARMY_EVENT':
        return (
          <ArmyEvent 
            stats={stats}
            onTalkWayOut={(excuseId) => {
              setStats(prev => ({
                ...prev,
                armyExcusesUsed: [...prev.armyExcusesUsed, excuseId]
              }));
              modifyStats({ social: 20, energy: -10 }, 'army_talk');
              setGameState('MAP');
            }}
            onPayWayOut={() => {
              modifyStats({ money: -100, social: -5 }, 'army_pay');
              setGameState('MAP');
            }}
            onGoWithArmy={(days) => {
              const nextDay = stats.day + days;
              setStats(prev => ({
                ...prev,
                day: nextDay,
                hour: 7,
                energy: 100,
                hygiene: 20,
                fitness: 30,
                achievementsEarnedToday: []
              }));
              triggerAchievement('army_serve');
              setGameState('MORNING_ROUTINE');
            }}
            onDecline={() => {
              setGameOverReason('ROBERTO DECLINED MILITARY SERVICE. HE IS NOW IN PRISON FOR INSUBORDINATION.');
              setGameState('GAME_OVER');
            }}
          />
        );
      case 'RANDOM_EVENT':
        return (
          <RandomEvent 
            stats={stats}
            onAction={(deltas, isLinn) => {
              if (isLinn) {
                setGameState('LINN_EVENT');
              } else {
                modifyStats(deltas);
                setGameState('MAP');
              }
            }}
          />
        );
      case 'LINN_EVENT':
        return (
          <LinnEvent 
            onComplete={(deltas, response) => {
              modifyStats(deltas);
              setAchievement(response);
              setGameState('MAP');
            }}
          />
        );
      case 'GAME_OVER':
        return (
          <GameOver 
            reason={gameOverReason} 
            onRestart={() => {
              setStats(INITIAL_STATS);
              setGameState('MENU');
            }} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-white font-pixel select-none overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          {renderState()}
        </motion.div>
      </AnimatePresence>

      <AchievementPopup achievement={achievement} onClear={() => setAchievement(null)} />

      {/* Global UI Elements */}
      {(gameState === 'MAP' || gameState === 'LOCATION' || gameState === 'MORNING_ROUTINE' || gameState === 'INTRO' || gameState === 'DIMA_EVENT' || gameState === 'ARMY_EVENT') && (
        <>
          <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-between items-start p-4">
            <div className="flex flex-col gap-2">
              <div className="pixel-card bg-zinc-900/90 border-white/40 p-3 shadow-2xl">
                <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-blue-400 mb-1">
                  <Calendar size={14} /> {dayOfWeek} | {monthName} {stats.day}
                  <div className="ml-auto text-yellow-500">
                    {stats.hour >= 6 && stats.hour < 18 ? '☀️' : '🌙'}
                  </div>
                </div>
                <div className="text-2xl text-yellow-500 font-bold tabular-nums drop-shadow-md">
                  {stats.hour.toString().padStart(2, '0')}:{stats.minute.toString().padStart(2, '0')}
                </div>
                {stats.hearthstoneRep !== 0 && (
                  <div className="text-[8px] text-blue-400 mt-1 font-bold">
                    HS REP: {stats.hearthstoneRep}
                  </div>
                )}
              </div>
              <div className="pixel-card bg-red-900/80 border-red-500/50 px-2 py-1 text-[8px] text-white animate-pulse">
                RENT DUE: 1000 CHF (DAY 30)
              </div>
            </div>

            <div className="flex items-start gap-4 pointer-events-auto">
              <div className="pixel-card bg-zinc-900/90 border-yellow-500/50 p-3 flex flex-col items-end">
                <span className="text-[8px] text-gray-500 uppercase font-bold">Wallet</span>
                <span className="text-xl text-yellow-400 font-bold">{stats.money} <span className="text-xs">CHF</span></span>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setShowInventory(true)}
                  className="pixel-button p-3 bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-2 text-[10px] shadow-xl"
                >
                  <Package size={16} /> INVENTORY ({stats.inventory.length})
                </button>
                <button 
                  onClick={() => setShowSaveLoad(true)}
                  className="pixel-button p-3 bg-zinc-900 hover:bg-zinc-800 text-white flex items-center gap-2 text-[10px] shadow-xl border-white/20"
                >
                  <MenuIcon size={16} /> MENU
                </button>
                <button 
                  onClick={() => setShowPhone(true)}
                  className="pixel-button p-3 bg-zinc-900 hover:bg-zinc-800 text-white flex items-center gap-2 text-[10px] shadow-xl border-white/20"
                >
                  <Smartphone size={16} /> PHONE
                </button>
              </div>
            </div>
          </div>

          <div className="fixed bottom-4 left-4 right-4 z-50 pointer-events-none flex flex-col gap-2">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pointer-events-auto">
              <StatBar label="NRG" value={stats.energy} color="bg-yellow-500" />
              <StatBar label="HYG" value={stats.hygiene} color="bg-blue-500" />
              <StatBar label="FIT" value={stats.fitness} color="bg-red-500" />
              <StatBar label="SOC" value={stats.social} color="bg-green-500" />
              <StatBar label="REP" value={stats.reputation} color="bg-purple-500" />
            </div>
          </div>

          <RobertoSprite stats={stats} lastAction={lastAction} />
        </>
      )}

      {showInventory && (
        <InventoryUI 
          items={stats.inventory} 
          onClose={() => setShowInventory(false)} 
        />
      )}

      {showSaveLoad && (
        <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="pixel-card bg-zinc-900 border-white p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-6 text-center tracking-widest">SYSTEM MENU</h2>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(slot => (
                <div key={slot} className="flex gap-2">
                  <button 
                    onClick={() => saveGame(slot)}
                    className="flex-1 pixel-button p-4 bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-2 text-xs"
                  >
                    <Save size={16} /> SAVE SLOT {slot}
                  </button>
                  <button 
                    onClick={() => loadGame(slot)}
                    className="flex-1 pixel-button p-4 bg-blue-900 hover:bg-blue-800 flex items-center justify-center gap-2 text-xs"
                  >
                    <LogIn size={16} /> LOAD SLOT {slot}
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setShowSaveLoad(false)}
                className="mt-4 pixel-button p-4 bg-red-900 hover:bg-red-800 text-xs"
              >
                CLOSE
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {showPhone && (
        <SmartphoneUI 
          stats={stats} 
          onClose={() => setShowPhone(false)} 
          onAction={handleAction}
        />
      )}
    </div>
  );
}

const SmartphoneUI = ({ stats, onClose, onAction }: { stats: RobertoStats, onClose: () => void, onAction: any }) => {
  const [activeContact, setActiveContact] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-[300px] h-[550px] bg-zinc-900 border-4 border-zinc-700 rounded-[40px] p-4 relative flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Phone Header */}
        <div className="h-6 w-24 bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center">
          <div className="w-2 h-2 bg-zinc-700 rounded-full" />
        </div>

        <div className="flex-1 flex flex-col bg-zinc-800 rounded-2xl overflow-hidden border border-white/10">
          {activeContact ? (
            <div className="flex-1 flex flex-col">
              <div className="p-3 bg-zinc-700 flex items-center gap-2 border-b border-white/10">
                <button onClick={() => setActiveContact(null)} className="text-white">
                  <ArrowLeft size={16} />
                </button>
                <span className="text-xs font-bold text-white uppercase">
                  {NPCS.find(n => n.id === activeContact)?.name}
                </span>
              </div>
              <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
                <div className="bg-zinc-700 p-2 rounded-lg text-[10px] self-start max-w-[80%]">
                  Hey Roberto! How are you?
                </div>
                <div className="bg-blue-600 p-2 rounded-lg text-[10px] self-end max-w-[80%] text-white">
                  Just thinking about architecture...
                </div>
              </div>
              <div className="p-3 bg-zinc-700 flex flex-col gap-2">
                <button 
                  onClick={() => {
                    onAction(1, { social: 10, energy: -5 }, 'date_invite');
                    alert('Invite sent!');
                  }}
                  className="pixel-button bg-pink-600 text-white text-[8px] py-2"
                >
                  INVITE TO CHALET DATE
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Messages</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {stats.contacts.map(contactId => {
                  const npc = NPCS.find(n => n.id === contactId);
                  return (
                    <button 
                      key={contactId}
                      onClick={() => setActiveContact(contactId)}
                      className="w-full p-4 flex items-center gap-3 border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-400">
                        {npc?.name[0]}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-[10px] font-bold text-white">{npc?.name}</div>
                        <div className="text-[8px] text-gray-500 truncate">Last message...</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Home Button */}
        <button 
          onClick={onClose}
          className="mt-4 w-10 h-10 rounded-full border-2 border-zinc-700 mx-auto flex items-center justify-center hover:bg-zinc-800 transition-colors"
        >
          <div className="w-4 h-4 rounded-sm border border-zinc-600" />
        </button>
      </motion.div>
    </div>
  );
};

const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="flex flex-col gap-1 bg-black/80 p-1 pixel-border">
    <div className="flex justify-between items-center px-1">
      <span className="text-[7px] text-white font-bold">{label}</span>
      <span className="text-[7px] text-white/50">{Math.round(value)}</span>
    </div>
    <div className="h-1.5 bg-gray-800 border border-white/10">
      <div 
        className={`h-full ${color} transition-all duration-500`} 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  </div>
);
