import React, { useState } from 'react';
import { LocationType, RobertoStats, NPCS, Item, DAYS_OF_WEEK, DialogueNode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Hand, MessageSquare, X, Heart, Flame, Smile, Swords } from 'lucide-react';

interface LocationViewProps {
  location: LocationType;
  stats: RobertoStats;
  onBack: () => void;
  onAction: (hours: number, statsChange: Partial<RobertoStats>, taskKey?: string) => void;
  onPickup: (item: Item) => void;
  onTalk: (npcId: string, change: number) => void;
  modifyStats: (deltas: Partial<Record<keyof RobertoStats, number>>, taskKey?: string) => void;
  onWorkOnProject: (projectId: string) => void;
  onVisited: (loc: LocationType) => void;
}

const DIALOGUES: Record<string, DialogueNode[]> = {
  'boss': [
    {
      id: 'start',
      text: "Roberto! Our burn rate is astronomical! The Badger loyalty card API is down again! We need to optimize our funnel and fix the technical debt!",
      options: [
        { 
          text: "I'm optimizing the spatial flow of our digital coupons, Paulo. It's about user-centric architecture.", 
          type: 'FUNNY',
          response: "Paulo's eye twitches. 'Spatial flow? It's a microservice, Roberto! We're cofounders, not architects! We need to scale this MVP or we'll never reach Series A!'",
          onSelect: () => ({ social: 10, energy: -5 }) 
        },
        { 
          text: "This startup's architecture is fundamentally unsound. It lacks a solid foundation and a clear value proposition.", 
          type: 'AGGRESSIVE',
          response: "Paulo starts sweating profusely. 'A foundation? We're a SaaS platform! We're pivoting to a B2B model! As your cofounder, I'm begging you: fix the API before our churn rate hits 100%!'",
          onSelect: () => ({ social: -10, energy: -5 }) 
        },
        { 
          text: "I'm a classically trained architect. I don't 'fix APIs', I design disruptive experiences.", 
          type: 'NORMAL',
          response: "Paulo's face turns a strange shade of purple. 'Our experience is about to be a TOTAL FAILURE if we don't achieve product-market fit! Fix the endpoint!'",
          onSelect: () => ({ social: 5, energy: -10 }) 
        }
      ]
    }
  ],
  'bartender': [
    {
      id: 'start',
      text: "The usual, Roberto? You look like you've been calculating load-bearing walls all day.",
      options: [
        { 
          text: "Actually, I've been calculating the trajectory of my life. It's a parabolic curve.", 
          type: 'FUNNY',
          response: "Sophie stares at you with unblinking, slightly too-large eyes. 'As long as it ends with you paying your tab, Roberto.'",
          onSelect: () => ({ social: 15, energy: -5 }) 
        },
        { 
          text: "You look beautiful tonight, Sophie. Like a perfectly rendered 3D model.", 
          type: 'ROMANTIC',
          response: "She blushes slightly. 'A 3D model? That's... a new one. Thanks, Roberto.'",
          onSelect: (stats) => ({ social: 20, relationships: { ...stats.relationships, bartender: (stats.relationships.bartender || 0) + 10 } }) 
        },
        {
          text: "Tell me about yourself, Sophie. What's your story?",
          type: 'NORMAL',
          nextId: 'story_1'
        }
      ]
    },
    {
      id: 'story_1',
      text: "My story? I used to be a structural engineer in Zurich. But I couldn't stand the rigidity. Now I just mix drinks and watch people collapse.",
      options: [
        {
          text: "Zurich? That explains the precision of your pours.",
          type: 'FUNNY',
          response: "She smiles. 'Precision is everything, Roberto. Even in chaos.'",
          onSelect: () => ({ social: 10 })
        }
      ]
    }
  ],
  'gym_bro': [
    {
      id: 'start',
      text: "Yo Roberto! You looking to build some real foundations today? These lats aren't going to design themselves!",
      options: [
        { 
          text: "I'm here to optimize my physical envelope, Marc. Form follows function.", 
          type: 'FUNNY',
          response: "Marc high-fives you so hard your teeth rattle. 'YEAH! OPTIMIZE THAT CORE! ARCHITECT THAT CHEST!'",
          onSelect: () => ({ social: 10, energy: -10 }) 
        },
        { 
          text: "The structural integrity of your squat form is... concerning.", 
          type: 'AGGRESSIVE',
          response: "Marc stops mid-rep. 'CONCERNING? I'M A BEAST! I'M THE CATHEDRAL OF CALVES! YOU'RE JUST A BUNGALOW OF BICEPS!'",
          onSelect: () => ({ social: -10, energy: -5 }) 
        },
        { 
          text: "I'm too humble to admit I'm the best architect in this gym.", 
          type: 'NORMAL',
          response: "Marc laughs. 'Architect? You look like you're made of blueprints! Get some iron in your hands!'",
          onSelect: () => ({ social: 5, energy: -5 }) 
        }
      ]
    }
  ],
  'roommate': [
    {
      id: 'start',
      text: "Roberto, darling! That sweater is a structural disaster. It's giving 'brutalist concrete' but in the worst way possible.",
      options: [
        {
          text: "It's a statement on the decay of modern urbanism.",
          type: 'FUNNY',
          response: "He gasps. 'Honey, the only thing decaying is your sense of style. Let's get you some color!'",
          onSelect: () => ({ social: 15, energy: 5 })
        },
        {
          text: "I'm too humble to admit I'm the best architect in this apartment.",
          type: 'NORMAL',
          response: "He laughs. 'And I'm too humble to admit I'm the best stylist in this zip code. Now, about those shoes...'",
          onSelect: () => ({ social: 10 })
        }
      ]
    }
  ],
  'nik': [
    {
      id: 'start',
      text: "Roberto, man. Paulo called me three times today. He's vibrating. Are you really going to stay here and build 'loyalty cards' forever?",
      options: [
        { 
          text: "I'm building a legacy, Nik. One digital coupon at a time.", 
          type: 'FUNNY',
          response: "Nik looks at you with pity. 'A legacy of spam, Roberto. You're an architect. You should be building things that people can actually stand inside of.'",
          onSelect: () => ({ social: 10, energy: -5 }) 
        },
        { 
          text: "Switzerland is safe, Nik. The foundations are solid. Why move to a earthquake zone?", 
          type: 'NORMAL',
          response: "Nik shrugs. 'Because at least in an earthquake, things move. Here, the only thing that moves is the clock. And it moves very, very slowly.'",
          onSelect: () => ({ social: 5, energy: -5 }) 
        }
      ]
    }
  ],
  'elena': [
    {
      id: 'start',
      text: "The woman looks up from her book. 'Can I help you, or are you just admiring the typography?'",
      options: [
        {
          text: "I'm an architect. I appreciate good structure in all forms.",
          type: 'NORMAL',
          response: "'Architecture? How quaint. I prefer the structure of a well-written sonnet.'",
          onSelect: () => ({ social: 5 })
        },
        {
          text: "Your eyes are like two perfectly placed windows in a minimalist facade.",
          type: 'ROMANTIC',
          response: "She laughs. 'That is the most absurd pick-up line I have ever heard. I love it. Here's my number.'",
          onSelect: (stats) => ({ social: 20, contacts: [...stats.contacts, 'elena'] })
        }
      ]
    }
  ],
  'maya': [
    {
      id: 'start',
      text: "Hey! You look like you need a drink and a dance! Or maybe just a very long nap!",
      options: [
        {
          text: "I'm Roberto. I design the spaces people dance in.",
          type: 'FUNNY',
          response: "Maya grins. 'Well, Roberto, design me a space where the music never stops!'",
          onSelect: () => ({ social: 15 })
        },
        {
          text: "You have an incredible energy. We should grab a coffee sometime.",
          type: 'ROMANTIC',
          response: "She winks. 'Coffee? Boring! But you're cute. Text me!'",
          onSelect: (stats) => ({ social: 20, contacts: [...stats.contacts, 'maya'] })
        }
      ]
    }
  ],
  'junkie': [
    {
      id: 'start',
      text: "You look like you need a pivot, Roberto. A real one. Not that SaaS garbage Paulo's selling. You want to see the real blue ocean?",
      options: [
        {
          text: "I'm interested in disruptive distribution models.",
          type: 'FUNNY',
          response: "He grins. 'That's the spirit. Sell some of my \"product\" and we'll both be disruptors.'",
          onSelect: () => ({ social: 10 })
        }
      ]
    }
  ],
  'dealer': [
    {
      id: 'start',
      text: "You look like you're looking for something, Roberto. Something... disruptive?",
      options: [
        {
          text: "I'm just observing the urban decay.",
          type: 'NORMAL',
          response: "Rick laughs. 'Decay is just another form of growth, my friend.'",
          onSelect: () => ({ social: 5 })
        },
        {
          text: "Get out of my face, you bottom-feeder.",
          type: 'AGGRESSIVE',
          nextId: 'antagonize_1'
        }
      ]
    },
    {
      id: 'antagonize_1',
      text: "Rick's smile vanishes. 'Careful, Roberto. The walls have ears, and I have a very short temper. Walk away.'",
      options: [
        {
          text: "I'm leaving. This place is a dump anyway.",
          type: 'NORMAL',
          response: "He spits on the ground. 'Smart move.'",
          onSelect: () => ({ social: -5 })
        },
        {
          text: "Make me move, you pathetic loser.",
          type: 'VIOLENCE',
          nextId: 'antagonize_2'
        }
      ]
    },
    {
      id: 'antagonize_2',
      text: "Rick pulls a knife. 'Last warning, architect. One more word and I'll redesign your face.'",
      options: [
        {
          text: "Okay, okay! I'm going!",
          type: 'NORMAL',
          response: "He laughs as you stumble away. 'That's what I thought.'",
          onSelect: () => ({ social: -20, energy: -10 })
        },
        {
          text: "Your knife is as dull as your personality. Do it.",
          type: 'VIOLENCE',
          onSelect: () => ({ policeStrikes: 999 }) // Trigger game over
        }
      ]
    }
  ],
  'ghost': [
    {
      id: 'start',
      text: "Hans glares at you. 'You are three minutes late for your own presence! In Switzerland, we respect the clock! Why are you here, you unorganized mess?'",
      options: [
        {
          text: "Time is a fluid concept in modern architecture, Hans.",
          type: 'FUNNY',
          response: "Hans screams. 'FLUID? TIME IS A GEAR! A PRECISION INSTRUMENT! YOU ARE A STAIN ON THE CANTON!'",
          onSelect: () => ({ social: -10 })
        },
        {
          text: "I'm here to admire the structural integrity of your haunting.",
          type: 'NORMAL',
          response: "He pauses. 'The integrity is... adequate. But the dust on the mantle is a disgrace.'",
          onSelect: () => ({ social: 5 })
        },
        {
          text: "You're strangely handsome for a dead guy, Hans.",
          type: 'ROMANTIC',
          response: "Hans turns a translucent shade of pink. 'Handsome? I was the most efficient man in my village! Efficiency is beauty!'",
          onSelect: (stats) => ({ social: 15, relationships: { ...stats.relationships, ghost: (stats.relationships.ghost || 0) + 10 } })
        }
      ]
    }
  ]
};

const CreepyNPCSprite = ({ id }: { id: string }) => {
  const getColors = () => {
    switch(id) {
      case 'boss': return { skin: 'bg-red-100', hair: 'bg-zinc-800', shirt: 'bg-white' };
      case 'bartender': return { skin: 'bg-orange-100', hair: 'bg-amber-900', shirt: 'bg-zinc-900' };
      case 'gym_bro': return { skin: 'bg-orange-200', hair: 'bg-yellow-900', shirt: 'bg-blue-900' };
      case 'roommate': return { skin: 'bg-pink-100', hair: 'bg-purple-900', shirt: 'bg-yellow-400' };
      case 'nik': return { skin: 'bg-blue-100', hair: 'bg-brown-900', shirt: 'bg-red-600' };
      case 'elena': return { skin: 'bg-rose-100', hair: 'bg-black', shirt: 'bg-emerald-500' };
      case 'maya': return { skin: 'bg-pink-200', hair: 'bg-yellow-400', shirt: 'bg-indigo-500' };
      case 'junkie': return { skin: 'bg-stone-400', hair: 'bg-zinc-900', shirt: 'bg-zinc-700' };
      case 'dealer': return { skin: 'bg-amber-200', hair: 'bg-black', shirt: 'bg-purple-900' };
      case 'ghost': return { skin: 'bg-blue-50/40', hair: 'bg-blue-200/40', shirt: 'bg-white/20' };
      default: return { skin: 'bg-gray-200', hair: 'bg-black', shirt: 'bg-gray-400' };
    }
  };
  const colors = getColors();

  return (
    <div className="w-24 h-32 relative flex flex-col items-center group">
      {/* Head - slightly too large and off-center */}
      <div className={`w-14 h-14 ${colors.skin} pixel-border relative z-10 animate-pulse`}>
        {/* Hair */}
        <div className={`absolute -top-2 -left-1 w-16 h-6 ${colors.hair} opacity-80`} />
        
        {/* Eyes - asymmetrical and creepy */}
        <div className="absolute top-5 left-2 w-2 h-2 bg-white pixel-border">
          <div className="w-1 h-1 bg-black absolute top-0 left-0 animate-bounce" />
        </div>
        <div className="absolute top-4 right-2 w-3 h-3 bg-white pixel-border">
          <div className="w-1 h-1 bg-red-600 absolute bottom-0 right-0" />
        </div>

        {/* Mouth - too wide or weird */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-black/40" />
      </div>

      {/* Body - distorted proportions */}
      <div className={`w-12 h-20 ${colors.shirt} pixel-border -mt-2 relative`}>
        {/* Arms - one longer than the other */}
        <div className={`absolute top-2 -left-4 w-4 h-16 ${colors.skin} pixel-border rotate-12`} />
        <div className={`absolute top-2 -right-6 w-4 h-20 ${colors.skin} pixel-border -rotate-6`} />
      </div>

      {/* Creepy Aura */}
      <div className="absolute inset-0 bg-red-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export const LocationView: React.FC<LocationViewProps> = ({ 
  location, stats, onBack, onAction, onPickup, onTalk, modifyStats, onWorkOnProject, onVisited 
}) => {
  const [workHours, setWorkHours] = useState(1);
  const [activeDialogue, setActiveDialogue] = useState<{ npcId: string, node: DialogueNode, response?: string } | null>(null);
  
  const locationNpcs = NPCS.filter(n => n.location === location).slice(0, 2);
  const dayOfWeek = DAYS_OF_WEEK[(stats.day - 1) % 7];
  const isWeekend = dayOfWeek === 'SAT' || dayOfWeek === 'SUN';

  const startDialogue = (npcId: string) => {
    if (stats.hygiene < 20) {
      alert("You smell too bad! Nobody wants to talk to you. Go take a shower.");
      return;
    }

    if (npcId === 'random_girl' && stats.fitness < 30) {
      alert("She looks at your lack of muscle definition and turns away. Hit the gym, Roberto.");
      return;
    }

    const nodes = DIALOGUES[npcId];
    if (nodes && nodes.length > 0) {
      // Pick node based on day or random
      const nodeIndex = (stats.day - 1) % nodes.length;
      setActiveDialogue({ npcId, node: nodes[nodeIndex] });
    }
  };

  const handleDialogueOption = (option: any) => {
    if (option.onSelect) {
      const deltas = option.onSelect(stats);
      modifyStats(deltas, 'talk');
      
      // Update relationship
      const change = (deltas.social || 0) > 0 ? 10 : -5;
      onTalk(activeDialogue!.npcId, change);
    }

    if (option.response) {
      setActiveDialogue({ ...activeDialogue!, response: option.response });
      return;
    }
    
    if (option.nextId) {
      const nextNode = DIALOGUES[activeDialogue!.npcId].find(n => n.id === option.nextId);
      if (nextNode) {
        setActiveDialogue({ ...activeDialogue!, node: nextNode });
        return;
      }
    }
    
    setActiveDialogue(null);
  };

  const getBgClass = () => {
    const isNight = stats.hour < 6 || stats.hour > 20;
    const brightness = isNight ? 'brightness-75' : 'brightness-100';
    
    let base = 'bg-black';
    switch(location) {
      case 'WORK': base = 'bg-zinc-600 border-zinc-400'; break;
      case 'BAR': base = 'bg-orange-950 border-orange-800'; break;
      case 'GYM': base = 'bg-slate-800 border-slate-600'; break;
      case 'HOME': base = 'bg-blue-950 border-blue-900'; break;
      case 'CHALET': base = 'bg-stone-900 border-stone-700'; break;
    }
    return `${base} ${brightness} transition-all duration-1000`;
  };

  const renderEnvironment = () => {
    const bgImages: Record<string, string> = {
      'HOME': 'https://picsum.photos/seed/pixel-home-lausanne/1920/1080?blur=2',
      'WORK': 'https://picsum.photos/seed/pixel-office-epfl/1920/1080?blur=2',
      'BAR': 'https://picsum.photos/seed/pixel-bar-ouchy/1920/1080?blur=2',
      'GYM': 'https://picsum.photos/seed/pixel-gym-flon/1920/1080?blur=2',
      'CHALET': 'https://picsum.photos/seed/pixel-chalet-alps/1920/1080?blur=2',
    };

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img 
          src={bgImages[location]} 
          alt={location} 
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 opacity-20">
          {location === 'WORK' && (
          <div className="grid grid-cols-6 gap-4 p-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-8 h-8 bg-white/20 rounded-sm" />
            ))}
          </div>
        )}
        {location === 'BAR' && (
          <div className="flex flex-wrap gap-8 p-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-12 h-16 bg-amber-900/40 rounded-t-lg" />
            ))}
          </div>
        )}
        {location === 'GYM' && (
          <div className="flex justify-around items-end h-full pb-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-20 h-4 bg-gray-400" />
            ))}
          </div>
        )}
        {location === 'CHALET' && (
          <div className="absolute inset-0 flex items-end justify-center opacity-30 pointer-events-none">
            <div className="w-0 h-0 border-l-[300px] border-l-transparent border-r-[300px] border-r-transparent border-b-[400px] border-b-white/20" />
          </div>
        )}
        </div>
      </div>
    );
  };

  const [hearthstoneGame, setHearthstoneGame] = useState<{ active: boolean; result?: 'WIN' | 'LOSE' } | null>(null);
  const [openFrontProgress, setOpenFrontProgress] = useState<number | null>(null);
  const [sellingDrugs, setSellingDrugs] = useState<{ active: boolean; spinning: boolean; result?: 'EARN' | 'POLICE' } | null>(null);
  const [ceeLo, setCeeLo] = useState<{ active: boolean; wager: number; dice?: [number, number]; result?: 'WIN' | 'LOSE' } | null>(null);
  const [showTutorial, setShowTutorial] = useState(!(stats.visitedLocations || []).includes(location));

  const playHearthstone = () => {
    if (stats.energy < 20) return;
    setHearthstoneGame({ active: true });
  };

  const finishHearthstone = () => {
    const win = Math.random() > 0.5;
    const result = win ? 'WIN' : 'LOSE';
    setHearthstoneGame({ active: true, result });
    modifyStats({ 
      hearthstoneRep: win ? 100 : -100,
      energy: -20 
    });
  };

  const playOpenFront = () => {
    if (stats.energy < 15) return;
    setOpenFrontProgress(0);
  };

  const advanceOpenFront = () => {
    if (openFrontProgress === null) return;
    const next = openFrontProgress + 10;
    if (next >= 100) {
      setOpenFrontProgress(100);
      modifyStats({ energy: -15, social: 10 });
    } else {
      setOpenFrontProgress(next);
    }
  };
  
  const startSellingDrugs = () => {
    if (stats.energy < 10) return;
    setSellingDrugs({ active: true, spinning: false });
  };

  const spinDrugWheel = () => {
    setSellingDrugs({ active: true, spinning: true });
    setTimeout(() => {
      const isPolice = Math.random() < 0.3;
      const result = isPolice ? 'POLICE' : 'EARN';
      setSellingDrugs({ active: true, spinning: false, result });
      if (isPolice) {
        modifyStats({ policeStrikes: 1, energy: -10 });
      } else {
        modifyStats({ money: 150, energy: -10 });
      }
    }, 2000);
  };

  const startCeeLo = () => {
    setCeeLo({ active: true, wager: 20 });
  };

  const rollCeeLo = () => {
    if (stats.money < ceeLo!.wager) return;
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2;
    const win = sum === 4 || sum === 5 || sum === 6;
    const result = win ? 'WIN' : 'LOSE';
    setCeeLo({ ...ceeLo!, active: true, dice: [d1, d2], result });
    modifyStats({ money: win ? ceeLo!.wager : -ceeLo!.wager, energy: -5 });
  };

  const renderTutorial = () => {
    if (!showTutorial) return null;
    
    let title = "";
    let text = "";
    
    switch(location) {
      case 'WORK':
        title = "BADGER HQ - THE GRIND";
        text = "This is where you waste your architectural talent fixing Paulo's broken APIs. Work on projects to earn money and reputation. If your reputation hits 0, you're fired and the game ends.";
        break;
      case 'HOME':
        title = "HOME - THE SANCTUARY";
        text = "Rest here to recover energy. You can also play minigames like Hearthstone or Open Front. Don't forget to shower, or people will avoid you.";
        break;
      case 'GYM':
        title = "FITNESS PLUS - THE TEMPLE";
        text = "Build your fitness here. Some social interactions require you to be in shape. It's also a great place to stare at yourself in the mirror.";
        break;
      case 'BAR':
        title = "LE BAR - THE VOID";
        text = "Socialize and drink away your sorrows. Be careful not to drink too much, or you'll wake up in a gutter with no energy.";
        break;
      case 'ALLEY':
        title = "DARK ALLEY - THE UNDERBELLY";
        text = "A place for illicit activities. You can earn quick cash selling drugs or playing Cee-Lo, but watch out for the police. 3 strikes and you're in prison.";
        break;
      case 'CHALET':
        title = "THE CHALET - THE EXILE";
        text = "A place of isolation. Good for thinking, crying, or doing absolutely nothing. Very Swiss.";
        break;
    }

    return (
      <div className="fixed inset-0 z-[500] bg-black/90 flex items-center justify-center p-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="pixel-card bg-zinc-900 border-yellow-500 p-8 max-w-md w-full"
        >
          <h2 className="text-yellow-500 text-xl font-bold mb-4 tracking-widest">{title}</h2>
          <p className="text-white text-sm leading-relaxed mb-8 uppercase tracking-tight">{text}</p>
          <button 
            onClick={() => {
              setShowTutorial(false);
              onVisited(location);
            }}
            className="pixel-button w-full bg-yellow-600 text-black font-bold py-4"
          >
            I UNDERSTAND THE MUNDANITY
          </button>
        </motion.div>
      </div>
    );
  };

  const renderMinigames = () => {
    if (hearthstoneGame) {
      return (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4">
          <div className="pixel-card bg-zinc-900 border-blue-500 p-8 flex flex-col items-center gap-6 max-w-xs w-full">
            <h2 className="text-blue-400 text-xl font-bold">HEARTHSTONE</h2>
            <div className="text-[10px] text-white text-center">
              CURRENT REP: <span className="text-yellow-400">{stats.hearthstoneRep}</span>
            </div>
            {!hearthstoneGame.result ? (
              <button 
                onClick={finishHearthstone}
                className="pixel-button bg-blue-600 text-white w-full py-4 text-xs"
              >
                PLAY MATCH (20 NRG)
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className={`text-2xl font-bold ${hearthstoneGame.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                  YOU {hearthstoneGame.result}!
                </div>
                <div className="text-[10px] text-gray-400">
                  {hearthstoneGame.result === 'WIN' ? '+100 HS REP' : '-100 HS REP'}
                </div>
                <button 
                  onClick={() => setHearthstoneGame(null)}
                  className="pixel-button w-full text-xs"
                >
                  CLOSE
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (openFrontProgress !== null) {
      return (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4">
          <div className="pixel-card bg-zinc-900 border-purple-500 p-8 flex flex-col items-center gap-6 max-w-xs w-full">
            <h2 className="text-purple-400 text-xl font-bold">OPEN FRONT</h2>
            <div className="w-full h-4 bg-zinc-800 border border-white/20 overflow-hidden">
              <motion.div 
                className="h-full bg-purple-500"
                animate={{ width: `${openFrontProgress}%` }}
              />
            </div>
            {openFrontProgress < 100 ? (
              <button 
                onClick={advanceOpenFront}
                className="w-24 h-24 rounded-full bg-purple-600 border-4 border-purple-400 flex items-center justify-center text-white font-bold active:scale-90 transition-transform"
              >
                CLICK!
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="text-green-400 text-center font-bold">CONGRATS YOUR FRONT IS NOW OPEN!</div>
                <button 
                  onClick={() => setOpenFrontProgress(null)}
                  className="pixel-button w-full text-xs"
                >
                  AWESOME
                </button>
              </div>
            )}
            <div className="text-[8px] text-gray-500">COSTS 15 NRG</div>
          </div>
        </div>
      );
    }

    if (sellingDrugs) {
      return (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4">
          <div className="pixel-card bg-zinc-900 border-red-500 p-8 flex flex-col items-center gap-6 max-w-xs w-full">
            <h2 className="text-red-500 text-xl font-bold">SELL DRUGS</h2>
            <div className="text-[10px] text-white text-center">
              STRIKES: <span className="text-red-500">{'X'.repeat(stats.policeStrikes)}</span>
            </div>
            
            <div className="relative w-32 h-32">
              <motion.div 
                className="w-full h-full rounded-full border-4 border-white flex items-center justify-center overflow-hidden"
                animate={sellingDrugs.spinning ? { rotate: 360 * 5 } : { rotate: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-red-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 30% 0)' }} />
                <div className="absolute inset-0 bg-green-500" style={{ clipPath: 'polygon(50% 50%, 30% 0, 100% 0, 100% 100%, 0 100%, 0 0)' }} />
              </motion.div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-6 bg-white z-10" />
            </div>

            {!sellingDrugs.result ? (
              <button 
                disabled={sellingDrugs.spinning}
                onClick={spinDrugWheel}
                className="pixel-button bg-red-600 text-white w-full py-4 text-xs"
              >
                {sellingDrugs.spinning ? 'SPINNING...' : 'SPIN WHEEL (10 NRG)'}
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className={`text-2xl font-bold ${sellingDrugs.result === 'EARN' ? 'text-green-400' : 'text-red-400'}`}>
                  {sellingDrugs.result === 'EARN' ? 'SUCCESS!' : 'POLICE!'}
                </div>
                <div className="text-[10px] text-gray-400">
                  {sellingDrugs.result === 'EARN' ? '+150 CHF' : '+1 POLICE STRIKE'}
                </div>
                <button 
                  onClick={() => setSellingDrugs(null)}
                  className="pixel-button w-full text-xs"
                >
                  CLOSE
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (ceeLo) {
      return (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4">
          <div className="pixel-card bg-zinc-900 border-green-500 p-8 flex flex-col items-center gap-6 max-w-xs w-full">
            <h2 className="text-green-500 text-xl font-bold">CEE-LO</h2>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white pixel-border flex items-center justify-center text-black text-2xl font-bold">
                {ceeLo.dice ? ceeLo.dice[0] : '?'}
              </div>
              <div className="w-12 h-12 bg-white pixel-border flex items-center justify-center text-black text-2xl font-bold">
                {ceeLo.dice ? ceeLo.dice[1] : '?'}
              </div>
            </div>
            
            {!ceeLo.result ? (
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-[10px]">WAGER:</span>
                  <input 
                    type="number" 
                    value={ceeLo.wager}
                    onChange={(e) => setCeeLo({ ...ceeLo, wager: Math.max(1, parseInt(e.target.value) || 0) })}
                    className="w-20 bg-black border border-white/20 text-white text-xs p-1"
                  />
                </div>
                <button 
                  onClick={rollCeeLo}
                  className="pixel-button bg-green-600 text-white w-full py-4 text-xs"
                >
                  ROLL DICE (5 NRG)
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className={`text-2xl font-bold ${ceeLo.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                  YOU {ceeLo.result}!
                </div>
                <div className="text-[10px] text-gray-400">
                  {ceeLo.result === 'WIN' ? `+${ceeLo.wager} CHF` : `-${ceeLo.wager} CHF`}
                </div>
                <button 
                  onClick={() => setCeeLo({ ...ceeLo, result: undefined, dice: undefined })}
                  className="pixel-button w-full text-xs"
                >
                  PLAY AGAIN
                </button>
                <button 
                  onClick={() => setCeeLo(null)}
                  className="pixel-button w-full text-[8px] opacity-50"
                >
                  QUIT
                </button>
              </div>
            )}
            <div className="text-[8px] text-gray-500 text-center">WIN ON SUM 4, 5, OR 6</div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (location) {
      case 'WORK':
        return (
          <div className="flex flex-col items-center gap-6 z-10 p-4">
            <h3 className="text-xl text-gray-400">BADGER STARTUP HQ</h3>
            {isWeekend ? (
              <div className="text-center text-red-400 text-[10px] bg-black/40 p-4 pixel-border">
                THE STARTUP NEVER SLEEPS, BUT THE OFFICE IS CLOSED.
                <br/>GO HOME OR TO THE BAR.
              </div>
            ) : (
              <>
                <p className="text-center text-[10px]">"Digital loyalty cards are the future, Roberto! Why are you drawing columns?"</p>
                
                {!stats.inventory.find(i => i.id === 'stapler') && (
                  <button 
                    onClick={() => onPickup({ id: 'stapler', name: 'STAPLER', description: 'Red and heavy.', icon: '📎', isStolen: true })}
                    className="pixel-button text-[8px] h-6 flex items-center justify-center gap-2 bg-red-600 border-red-400"
                  >
                    <Hand size={10} /> STEAL STAPLER
                  </button>
                )}

                <div className="flex items-center gap-4">
                  <button onClick={() => setWorkHours(Math.max(1, workHours - 1))} className="pixel-button p-2">-</button>
                  <span className="text-lg">{workHours}h</span>
                  <button onClick={() => setWorkHours(Math.min(8, workHours + 1))} className="pixel-button p-2">+</button>
                </div>
                <div className="flex flex-col items-center gap-2 w-full">
                  <button 
                    onClick={() => onAction(workHours, { money: workHours * 20, energy: -workHours * 15, hygiene: -10, social: -5, reputation: workHours * 2 }, 'work')}
                    className="pixel-button bg-blue-500 text-white w-full"
                  >
                    DO GENERAL WORK
                  </button>
                  <div className="flex gap-2 text-[7px] text-gray-400">
                    <span className="text-green-400">+{workHours * 20} CHF</span>
                    <span className="text-red-400">-{workHours * 15} NRG</span>
                    <span className="text-green-400">+{workHours * 2} REP</span>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case 'BAR':
        return (
          <div className="flex flex-col items-center gap-6 z-10 p-4">
            <h3 className="text-xl text-amber-500">LE BAR DES AMIS</h3>
            <p className="text-center text-[10px]">The beer is cold, the life is old.</p>

            {/* Drunk Meter */}
            <div className="w-full bg-black/40 p-2 pixel-border flex flex-col gap-1">
              <div className="flex justify-between text-[8px] font-bold">
                <span className="text-amber-400 uppercase">Drunk Level</span>
                <span className="text-white">{stats.beersDrunkToday}/3</span>
              </div>
              <div className="h-2 bg-zinc-800 border border-white/10 overflow-hidden">
                <motion.div 
                  className="h-full bg-amber-500"
                  animate={{ width: `${(stats.beersDrunkToday / 3) * 100}%` }}
                />
              </div>
              {stats.beersDrunkToday >= 2 && (
                <div className="text-[6px] text-red-400 animate-pulse text-center uppercase">Warning: Vision blurring...</div>
              )}
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col items-center gap-2">
                <button 
                  disabled={stats.money < 12}
                  onClick={() => onAction(1, { money: -12, social: 10, energy: 5, hygiene: -5 }, 'beer')}
                  className="pixel-button w-full text-xs"
                >
                  BUY A PINT (12 CHF)
                </button>
                <div className="flex gap-2 text-[7px] text-gray-400">
                  <span className="text-red-400">-12 CHF</span>
                  <span className="text-green-400">+10 SOC</span>
                  <span className="text-green-400">+5 NRG</span>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-4 flex flex-col gap-2">
                <div className="text-[8px] text-center text-pink-400 uppercase font-bold">Socialize</div>
                <div className="flex flex-col items-center gap-1">
                  <button 
                    onClick={() => {
                      if (stats.fitness < 30) {
                        modifyStats({ social: -5 });
                        return;
                      }
                      const npcId = 'random_girl';
                      startDialogue(npcId);
                    }}
                    className="pixel-button w-full text-[8px] bg-pink-900/40"
                  >
                    FIND SOMEONE TO FLIRT WITH
                  </button>
                  <div className="text-[7px] text-gray-500 italic">Requires 30+ FIT</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <button 
                    onClick={() => {
                      const correct = Math.random() > 0.7;
                      if (correct) {
                        onTalk('bartender', 10);
                        onAction(0.5, { social: 15, energy: -10 }, 'talk');
                      } else {
                        onTalk('bartender', -15);
                        onAction(0.5, { social: -25, energy: -10 }, 'talk');
                      }
                    }}
                    className="pixel-button w-full text-[8px] bg-pink-900/40"
                  >
                    TRY A HUMBLE EPFL PICKUP LINE
                  </button>
                  <div className="text-[7px] text-gray-500 italic">RISK: +15/-25 SOC | -10 NRG</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <button 
                    onClick={() => {
                      const correct = Math.random() > 0.6;
                      if (correct) {
                        onTalk('bartender', 5);
                        onAction(0.5, { social: 5, energy: -5 }, 'talk');
                      } else {
                        onTalk('bartender', -5);
                        onAction(0.5, { social: -10, energy: -5 }, 'talk');
                      }
                    }}
                    className="pixel-button w-full text-[8px]"
                  >
                    DISCUSS STRUCTURAL INTEGRITY
                  </button>
                  <div className="text-[7px] text-gray-500 italic">RISK: +5/-10 SOC | -5 NRG</div>
                </div>
              </div>

              {!stats.inventory.find(i => i.id === 'coaster') && (
                <button 
                  onClick={() => onPickup({ id: 'coaster', name: 'COASTER', description: 'Soaked in regret.', icon: '🍺', isStolen: true })}
                  className="pixel-button text-[8px] h-6 flex items-center justify-center gap-2 bg-red-600 border-red-400"
                >
                  <Hand size={10} /> STEAL COASTER
                </button>
              )}
            </div>
          </div>
        );
      case 'GYM':
        return (
          <div className="flex flex-col items-center gap-6 z-10 p-4">
            <h3 className="text-xl text-red-500">FITNESS PLUS</h3>
            <p className="text-center text-[10px]">No pain, no mundane.</p>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={() => onAction(1, { fitness: 15, energy: -25, hygiene: -20, social: 2 }, 'gym')}
                  className="pixel-button w-full text-xs"
                >
                  LIFT WEIGHTS (1h)
                </button>
                <div className="flex gap-2 text-[7px] text-gray-400">
                  <span className="text-green-400">+15 FIT</span>
                  <span className="text-red-400">-25 NRG</span>
                  <span className="text-red-400">-20 HYG</span>
                </div>
              </div>
              
              {!stats.inventory.find(i => i.id === 'towel') && (
                <button 
                  onClick={() => onPickup({ id: 'towel', name: 'TOWEL', description: 'Smells like effort.', icon: '🧣', isStolen: true })}
                  className="pixel-button text-[8px] h-6 flex items-center justify-center gap-2 bg-red-600 border-red-400"
                >
                  <Hand size={10} /> TAKE TOWEL
                </button>
              )}
            </div>
          </div>
        );
      case 'HOME':
        return (
          <div className="flex flex-col items-center gap-6 z-10 p-4">
            <h3 className="text-xl text-blue-400">HOME</h3>
            <p className="text-center text-[10px]">Safe. Boring. Home.</p>
            {renderMinigames()}
            <div className="flex flex-col gap-4 w-full">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center gap-1">
                  <button 
                    onClick={() => onAction(0.5, { hygiene: 40, energy: 5 }, 'shower')}
                    className="pixel-button w-full text-[10px]"
                  >
                    SHOWER
                  </button>
                  <div className="flex gap-2 text-[6px] text-gray-400">
                    <span className="text-green-400">+40 HYG</span>
                    <span className="text-blue-400">30 MIN</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <button 
                    onClick={() => onAction(0.5, { energy: 20, money: -10 }, 'eat')}
                    className="pixel-button w-full text-[10px]"
                  >
                    EAT
                  </button>
                  <div className="flex gap-2 text-[6px] text-gray-400">
                    <span className="text-green-400">+20 NRG</span>
                    <span className="text-red-400">-10 CHF</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={playHearthstone}
                  disabled={stats.energy < 20}
                  className="pixel-button w-full text-[8px] bg-blue-900/40"
                >
                  PLAY HEARTHSTONE (20 NRG)
                </button>
                <button 
                  onClick={playOpenFront}
                  disabled={stats.energy < 15}
                  className="pixel-button w-full text-[8px] bg-purple-900/40"
                >
                  PLAY OPEN FRONT (15 NRG)
                </button>
              </div>
              
              {!stats.inventory.find(i => i.id === 'key') && (
                <button 
                  onClick={() => onPickup({ id: 'key', name: 'SPARE KEY', description: 'For emergencies.', icon: '🔑' })}
                  className="pixel-button text-[8px] flex items-center justify-center gap-2"
                >
                  <Hand size={12} /> GRAB SPARE KEY
                </button>
              )}

              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={() => {
                    const hoursToSleep = stats.hour < 7 ? 7 - stats.hour : 24 - stats.hour + 7;
                    onAction(hoursToSleep, { energy: 100 }, 'sleep');
                  }}
                  className="pixel-button w-full bg-indigo-600 text-white text-xs"
                >
                  GO TO SLEEP
                </button>
                <div className="flex gap-2 text-[7px] text-gray-400">
                  <span className="text-green-400">+100 NRG</span>
                  <span className="text-blue-400">NEXT DAY</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'ALLEY':
        return (
          <div className="flex flex-col items-center gap-6 z-10 p-4">
            <h3 className="text-xl text-red-600">DARK ALLEY</h3>
            <p className="text-center text-[10px] text-gray-500 italic">The laws of architecture don't apply here.</p>
            {renderMinigames()}
            <div className="flex flex-col gap-4 w-full">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={startSellingDrugs}
                  disabled={stats.energy < 10}
                  className="pixel-button w-full text-[10px] bg-red-900/60"
                >
                  SELL DRUGS (10 NRG)
                </button>
                <button 
                  onClick={startCeeLo}
                  disabled={stats.energy < 5}
                  className="pixel-button w-full text-[10px] bg-green-900/60"
                >
                  PLAY CEE-LO (5 NRG)
                </button>
              </div>
              
              <div className="text-[8px] text-center text-gray-400 uppercase">Local Denizens</div>
              <div className="grid grid-cols-3 gap-2">
                {locationNpcs.map(npc => (
                  <button 
                    key={npc.id}
                    onClick={() => startDialogue(npc.id)}
                    className="pixel-button text-[8px] p-2"
                  >
                    {npc.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'CHALET':
        return (
          <div className="flex flex-col items-center gap-6 z-10 p-4">
            <h3 className="text-xl text-stone-400">MOUNTAIN CHALET</h3>
            <p className="text-center text-[10px]">The air is thin. The silence is heavy.</p>
            <div className="flex flex-col gap-4 w-full">
              <button 
                onClick={() => onAction(2, { social: -10, energy: 20 }, 'view')}
                className="pixel-button w-full text-xs"
              >
                LOOK AT THE VIEW (2h, +20 NRG)
              </button>
              <button 
                onClick={() => onAction(1, { social: -20, energy: -10, hygiene: -5 }, 'cry')}
                className="pixel-button w-full text-xs bg-blue-900/40"
              >
                CRY DEEPLY (1h, -10 NRG)
              </button>
              <button 
                onClick={() => onAction(1, { energy: 5 }, 'nothing')}
                className="pixel-button w-full text-xs"
              >
                DO NOTHING (1h, +5 NRG)
              </button>
              <button 
                onClick={onBack}
                className="pixel-button w-full text-xs bg-zinc-800"
              >
                GO BACK
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`h-screen w-screen ${getBgClass()} flex flex-col p-4 relative overflow-hidden pt-20`}>
      {renderEnvironment()}
      {renderTutorial()}

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex gap-4 items-center">
        <button onClick={onBack} className="pixel-button flex items-center gap-2 text-[8px] bg-zinc-900/80">
          <ArrowLeft size={12} /> LEAVE LOCATION
        </button>
        <div className="pixel-card bg-black/80 border-yellow-500/50 p-2 text-[10px] text-yellow-400 flex items-center gap-2">
          <span className="text-[8px] text-gray-500">CASH:</span> {stats.money} CHF
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 items-center justify-center z-20 overflow-y-auto pb-24">
        {location === 'WORK' && !isWeekend && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-xs flex flex-col gap-4"
          >
            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-black/60 p-2 pixel-border text-center">Active Projects</h4>
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
              {stats.activeProjects.map(project => (
                <div key={project.id} className="pixel-card bg-zinc-900/90 border-white/20 p-3 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold text-white uppercase">{project.name}</span>
                    <span className="text-[8px] text-yellow-500 font-bold">{project.reward} CHF</span>
                  </div>
                  <div className="text-[7px] text-gray-400 leading-tight italic">"{project.description}"</div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[6px] uppercase font-bold">
                      <span className="text-blue-300">Progress</span>
                      <span className="text-white">{project.hoursSpent}/{project.hoursRequired}h</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 border border-white/10">
                      <motion.div 
                        className="h-full bg-blue-500" 
                        initial={{ width: 0 }}
                        animate={{ width: `${(project.hoursSpent / project.hoursRequired) * 100}%` }} 
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[6px] text-red-400 uppercase font-bold">Deadline: Day {project.deadlineDay}</span>
                    <button 
                      disabled={project.hoursSpent >= project.hoursRequired}
                      onClick={() => onWorkOnProject(project.id)}
                      className="pixel-button p-1 px-3 text-[7px] bg-blue-600/40 hover:bg-blue-600/60 disabled:opacity-50 disabled:bg-green-900/40"
                    >
                      {project.hoursSpent >= project.hoursRequired ? 'COMPLETED' : 'WORK (1h)'}
                    </button>
                  </div>
                </div>
              ))}
              {stats.activeProjects.length === 0 && (
                <div className="text-[8px] text-gray-500 text-center italic p-4 border border-dashed border-white/10">No active projects. Ask Paulo for more work.</div>
              )}
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pixel-card w-full max-w-sm bg-black/60 backdrop-blur-sm"
        >
          {renderContent()}
        </motion.div>

        {locationNpcs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pixel-card w-full max-w-xs bg-black/60 backdrop-blur-sm flex flex-col gap-4"
          >
            <h4 className="text-[10px] border-b border-white/20 pb-1 text-center font-bold">PEOPLE HERE</h4>
            <div className="flex flex-col gap-3">
              {locationNpcs.map(npc => (
                <div key={npc.id} className="flex flex-col gap-2 p-3 border border-white/10 bg-white/5">
                  <div className="flex items-center gap-3">
                    <CreepyNPCSprite id={npc.id} />
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-blue-300">{npc.name}</span>
                        <div className="flex items-center gap-1 text-[8px]">
                          <span className="text-pink-400">♥</span>
                          {stats.relationships[npc.id] || 0}
                        </div>
                      </div>
                      <div className="text-[8px] text-gray-400 leading-tight">{npc.description}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => startDialogue(npc.id)}
                    className="pixel-button p-2 text-[8px] flex items-center justify-center gap-1 bg-zinc-800"
                  >
                    <MessageSquare size={10} /> TALK
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {activeDialogue && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4"
          >
            <div className="pixel-card w-full max-w-lg bg-zinc-900 border-white border-4 p-6 relative shadow-[16px_16px_0_rgba(0,0,0,1)]">
              <button 
                onClick={() => setActiveDialogue(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <div className="text-blue-400 text-[10px] font-bold mb-4 uppercase tracking-widest border-b border-white/20 pb-2 flex items-center gap-2">
                <CreepyNPCSprite id={activeDialogue.npcId} />
                CONVERSATION WITH {NPCS.find(n => n.id === activeDialogue.npcId)?.name}
              </div>
              
              <div className="text-white text-sm mb-8 leading-relaxed italic min-h-[60px]">
                {activeDialogue.response ? (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-yellow-400"
                  >
                    "{activeDialogue.response}"
                  </motion.div>
                ) : (
                  `"${activeDialogue.node.text}"`
                )}
              </div>
              
              <div className="flex flex-col gap-3">
                {activeDialogue.response ? (
                  <button 
                    onClick={() => setActiveDialogue(null)}
                    className="pixel-button text-center text-[10px] p-4 bg-zinc-800 border-2 border-white"
                  >
                    END CONVERSATION
                  </button>
                ) : (
                  activeDialogue.node.options.map((option, i) => (
                    <button 
                      key={i}
                      onClick={() => handleDialogueOption(option)}
                      className="pixel-button text-left text-[10px] p-4 hover:bg-zinc-800 transition-colors border-2 border-white/20 hover:border-white flex items-center gap-3"
                    >
                      {option.type === 'ROMANTIC' && <Heart size={14} className="text-pink-500" />}
                      {option.type === 'AGGRESSIVE' && <Flame size={14} className="text-orange-500" />}
                      {option.type === 'FUNNY' && <Smile size={14} className="text-yellow-500" />}
                      {option.type === 'VIOLENCE' && <Swords size={14} className="text-red-600" />}
                      {option.text}
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 left-4 right-32 z-20 grid grid-cols-2 md:grid-cols-5 gap-2">
        <StatBar label="NRG" value={stats.energy} color="bg-yellow-500" />
        <StatBar label="HYG" value={stats.hygiene} color="bg-blue-500" />
        <StatBar label="FIT" value={stats.fitness} color="bg-red-500" />
        <StatBar label="SOC" value={stats.social} color="bg-green-500" />
        <StatBar label="REP" value={stats.reputation} color="bg-purple-500" />
      </div>
    </div>
  );
};

const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="flex flex-col gap-1 bg-black/40 p-1 pixel-border">
    <div className="flex justify-between items-center px-1">
      <span className="text-[7px] text-white font-bold">{label}</span>
      <span className="text-[7px] text-white/50">{Math.round(value)}%</span>
    </div>
    <div className="h-1.5 bg-gray-800 border border-white/10">
      <div 
        className={`h-full ${color} transition-all duration-500`} 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  </div>
);
