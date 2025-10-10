// Centralized UI constants for consistent styling and animations

export const BUTTON_STYLES = {
  base: 'rounded-full border-4 shadow-xl active:scale-95 transition-transform',
  primary: 'bg-emerald-500 border-emerald-700 hover:bg-emerald-400',
  primaryDisabled: 'bg-emerald-900 border-emerald-950 opacity-30 cursor-not-allowed',
  secondary: 'bg-red-600 border-red-800 hover:bg-red-500',
  secondaryDisabled: 'opacity-30 cursor-not-allowed',
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
    base: 'w-full h-14 rounded-lg border-2 px-4 text-left transition-all overflow-hidden',
    active: 'border-yellow-400 bg-yellow-900/40 text-yellow-100 shadow-lg',
    disabled: 'border-zinc-800 bg-zinc-900/50 text-zinc-700 cursor-not-allowed',
    default: 'border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:border-yellow-500/60 hover:bg-zinc-700',
  },
} as const;
