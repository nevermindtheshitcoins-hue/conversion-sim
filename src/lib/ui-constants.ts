// Centralized UI constants for consistent styling and animations - NORAD Control Panel Theme

export const BUTTON_STYLES = {
  base: 'border active:translate-y-px transition-transform',
  primary: 'bg-norad-dark border-norad-amber hover:bg-norad-charcoal text-norad-amber',
  primaryDisabled: 'bg-norad-black border-norad-steel opacity-50 cursor-not-allowed',
  secondary: 'bg-norad-dark border-norad-cyan hover:bg-norad-charcoal text-norad-cyan',
  secondaryDisabled: 'bg-norad-black border-norad-steel opacity-50 cursor-not-allowed',
  accent: 'bg-norad-dark border-norad-amber hover:bg-norad-charcoal text-norad-amber',
} as const;

export const FOCUS_STYLES = {
  ring: 'focus:outline-none focus:ring-1 focus:ring-norad-amber',
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
    background: 'bg-norad-dark',
    shadow: '',
    text: 'text-norad-amber',
  },
  loading: {
    background: 'bg-norad-dark',
    shadow: '',
    text: 'text-norad-cyan',
  },
  complete: {
    background: 'bg-norad-dark',
    shadow: '',
    text: 'text-norad-amber',
  },
  error: {
    background: 'bg-norad-dark',
    shadow: '',
    text: 'text-norad-amber',
  },
} as const;

export const CONTROL_PANEL_STYLES = {
  button: {
    base: 'w-full h-16 border px-4 text-left transition-all duration-150 overflow-hidden relative group active:translate-y-px shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]',
    active: 'border-norad-amber bg-norad-dark',
    disabled: 'border-norad-steel bg-norad-black text-text-disabled cursor-not-allowed',
    default: 'border-norad-steel bg-norad-black text-text-primary',
  },
  ledText: {
    base: 'font-mono text-sm font-bold relative z-10 transition-all duration-150 whitespace-nowrap',
    active: 'text-norad-amber',
    disabled: 'text-text-disabled',
    default: 'text-text-primary',
  },
  ledScreen: {
    base: 'absolute inset-1 bg-norad-black border border-norad-steel shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]',
    active: 'border-norad-amber',
    disabled: 'border-norad-steel',
    default: '',
  },
} as const;
