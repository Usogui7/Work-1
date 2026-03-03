export type GameState = 'TITLE' | 'MENU' | 'INTRO' | 'MORNING_ROUTINE' | 'MAP' | 'LOCATION' | 'SLEEP' | 'GAME_OVER' | 'DIMA_EVENT' | 'DRUNK_MINIGAME' | 'ARMY_EVENT' | 'RANDOM_EVENT' | 'LINN_EVENT';

export type MorningStep = 'WAKE_UP' | 'BRUSH_TEETH' | 'COMB_HAIR' | 'FLOSS' | 'PUSH_UPS' | 'GET_DRESSED' | 'READY';

export type LocationType = 'HOME' | 'WORK' | 'BAR' | 'GYM' | 'CHALET' | 'ALLEY';

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  isStolen?: boolean;
}

export interface NPC {
  id: string;
  name: string;
  relationship: number; // 0-100
  location: LocationType;
  description: string;
}

export type DialogueType = 'NORMAL' | 'ROMANTIC' | 'AGGRESSIVE' | 'FUNNY' | 'VIOLENCE';

export interface DialogueOption {
  text: string;
  type?: DialogueType;
  nextId?: string;
  response?: string;
  onSelect?: (stats: RobertoStats) => Partial<RobertoStats>;
}

export interface DialogueNode {
  id: string;
  text: string;
  options: DialogueOption[];
}

export interface WorkProject {
  id: string;
  name: string;
  description: string;
  hoursRequired: number;
  hoursSpent: number;
  reward: number;
  deadlineDay: number;
}

export interface RobertoStats {
  money: number;
  energy: number;
  hygiene: number;
  fitness: number;
  social: number;
  day: number;
  month: number;
  hour: number; // 0-23
  minute: number; // 0-59
  inventory: Item[];
  relationships: Record<string, number>;
  stolenCount: number;
  achievementsEarnedToday: string[];
  allTimeAchievements: string[];
  beersDrunkToday: number;
  armyExcusesUsed: string[];
  activeProjects: WorkProject[];
  reputation: number; // 0-100
  hearthstoneRep: number;
  policeStrikes: number;
  unlockedLocations: LocationType[];
  visitedLocations: LocationType[];
  tutorialStep: number;
  contacts: string[]; // NPC IDs
}

export const INITIAL_STATS: RobertoStats = {
  money: 50,
  energy: 100,
  hygiene: 50,
  fitness: 50,
  social: 50,
  day: 1,
  month: 1,
  hour: 7,
  minute: 0,
  inventory: [],
  relationships: {
    'boss': 20,
    'bartender': 10,
    'gym_bro': 5,
  },
  stolenCount: 0,
  achievementsEarnedToday: [],
  allTimeAchievements: [],
  beersDrunkToday: 0,
  armyExcusesUsed: [],
  activeProjects: [
    {
      id: 'api_fix',
      name: 'Fix Badger API',
      description: 'The loyalty card endpoint is returning 418 I\'m a teapot.',
      hoursRequired: 4,
      hoursSpent: 0,
      reward: 80,
      deadlineDay: 3
    },
    {
      id: 'ui_redesign',
      name: 'Redesign Coupon UI',
      description: 'Paulo wants more "pop". Make it look like a real architect did it.',
      hoursRequired: 8,
      hoursSpent: 0,
      reward: 180,
      deadlineDay: 5
    }
  ],
  reputation: 40,
  hearthstoneRep: 0,
  policeStrikes: 0,
  unlockedLocations: ['HOME', 'WORK'],
  visitedLocations: [],
  tutorialStep: 0,
  contacts: ['nik'],
};

export const DAYS_OF_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
export const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const NPCS: NPC[] = [
  { id: 'boss', name: 'Paulo', relationship: 20, location: 'WORK', description: 'Your perpetually stressed cofounder at Badger. He vibrates with anxiety.' },
  { id: 'bartender', name: 'Sophie', relationship: 10, location: 'BAR', description: 'The friendly bartender who knows your usual. She has a hidden past.' },
  { id: 'gym_bro', name: 'Marc', relationship: 5, location: 'GYM', description: 'A guy who spends more time looking in the mirror than lifting.' },
  { id: 'roommate', name: 'Gay Roommate', relationship: 30, location: 'HOME', description: 'Your roommate who always has a colorful opinion on your outfit.' },
  { id: 'nik', name: 'Nik', relationship: 80, location: 'HOME', description: 'Your best friend. He thinks you should stay in Switzerland, but you have your doubts.' },
  { id: 'elena', name: 'Elena', relationship: 0, location: 'BAR', description: 'A sophisticated woman reading a book at the bar.' },
  { id: 'maya', name: 'Maya', relationship: 0, location: 'BAR', description: 'A high-energy girl laughing with her friends.' },
  { id: 'ghost', name: 'Hans (The Swiss Ghost)', relationship: -50, location: 'CHALET', description: 'The ghost of the most Swiss person to ever live. He hates your lack of punctuality.' },
  { id: 'junkie', name: 'Twitchy Joe', relationship: 0, location: 'ALLEY', description: 'He seems to be counting invisible ants.' },
  { id: 'dealer', name: 'Slick Rick', relationship: 0, location: 'ALLEY', description: 'His smile has too many teeth.' },
];
