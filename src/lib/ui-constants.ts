// Centralized UI constants for consistent styling and animations

export const BUTTON_STYLES = {
  base: 'rounded-full border-4 shadow-xl active:scale-95 transition-transform',
  primary: 'bg-emerald-500 border-emerald-700 hover:bg-emerald-400 rounded-[2rem]',
  primaryDisabled: 'bg-emerald-900 border-emerald-950 opacity-30 cursor-not-allowed rounded-[2rem]',
  secondary: 'bg-red-600 border-red-800 hover:bg-red-500 rounded-[2rem]',
  secondaryDisabled: 'opacity-30 cursor-not-allowed rounded-[2rem]',
  accent: 'bg-yellow-500 border-yellow-700 hover:bg-yellow-400',
} as const;

export const FOCUS_STYLES = {
  ring: 'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-zinc-900',
} as const;

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 600,
  transition: 'transition-all duration-300',
  transitionFast: 'transition-all duration-150',
  transitionSlow: 'transition-all duration-600',
} as const;

export const STATUS_COLORS = {
  active: {
    background: 'bg-yellow-300',
    shadow: 'shadow-[0_0_12px_rgba(252,211,77,0.5)]',
    text: 'text-yellow-100',
  },
  loading: {
    background: 'bg-blue-400',
    shadow: 'shadow-[0_0_12px_rgba(96,165,250,0.5)]',
    text: 'text-blue-100',
  },
  complete: {
    background: 'bg-emerald-400',
    shadow: 'shadow-[0_0_12px_rgba(52,211,153,0.5)]',
    text: 'text-emerald-100',
  },
  error: {
    background: 'bg-red-500',
    shadow: 'shadow-[0_0_12px_rgba(239,68,68,0.5)]',
    text: 'text-red-100',
  },
} as const;

export const CONTROL_PANEL_STYLES = {
  button: {
    base: 'w-full h-16 rounded-lg border-2 px-4 text-left transition-all duration-150 overflow-hidden relative group active:scale-[0.98] active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)]',
    active: 'border-emerald-400/60 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_0_16px_rgba(16,185,129,0.4)] transform scale-[0.98]',
    disabled: 'border-zinc-800/50 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-zinc-700 cursor-not-allowed shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]',
    default: 'border-zinc-600/80 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 text-zinc-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]',
  },
  ledText: {
    base: 'font-mono text-sm font-medium relative z-10 transition-all duration-150 whitespace-nowrap',
    active: 'text-emerald-200 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]',
    disabled: 'text-zinc-700',
    default: 'text-zinc-300',
  },
  ledScreen: {
    base: 'absolute inset-1 rounded-md bg-gradient-to-b from-black via-zinc-950 to-black border border-zinc-800/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]',
    active: 'border-emerald-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_0_8px_rgba(16,185,129,0.1)]',
    disabled: 'border-zinc-800/30',
    default: '',
  },
} as const;
