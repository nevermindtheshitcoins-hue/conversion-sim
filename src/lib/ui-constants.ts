// Centralized UI constants for consistent styling and animations - Industrial Voting Booth Theme

export const BUTTON_STYLES = {
  base: 'rounded-lg border-2 shadow-lg active:scale-95 transition-transform',
  primary: 'bg-industrial-orange border-industrial-orange-dark hover:bg-industrial-orange-dark text-text-primary rounded-lg',
  primaryDisabled: 'bg-industrial-charcoal border-industrial-steel opacity-50 cursor-not-allowed rounded-lg',
  secondary: 'bg-industrial-blue border-industrial-blue-dark hover:bg-industrial-blue-dark text-text-primary rounded-lg',
  secondaryDisabled: 'bg-industrial-charcoal border-industrial-steel opacity-50 cursor-not-allowed rounded-lg',
  accent: 'bg-industrial-orange border-industrial-orange-dark hover:bg-industrial-orange-dark text-text-primary',
} as const;

export const FOCUS_STYLES = {
  ring: 'focus:outline-none focus:ring-2 focus:ring-industrial-orange focus:ring-offset-2 focus:ring-offset-industrial-charcoal',
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
    background: 'bg-industrial-orange',
    shadow: 'shadow-[0_0_12px_rgba(255,107,53,0.5)]',
    text: 'text-text-primary',
  },
  loading: {
    background: 'bg-industrial-blue',
    shadow: 'shadow-[0_0_12px_rgba(30,136,229,0.5)]',
    text: 'text-text-primary',
  },
  complete: {
    background: 'bg-industrial-orange',
    shadow: 'shadow-[0_0_12px_rgba(255,107,53,0.5)]',
    text: 'text-text-primary',
  },
  error: {
    background: 'bg-industrial-orange',
    shadow: 'shadow-[0_0_12px_rgba(255,107,53,0.5)]',
    text: 'text-text-primary',
  },
} as const;

export const CONTROL_PANEL_STYLES = {
  button: {
    base: 'w-full h-16 rounded-lg border-2 px-4 text-left transition-all duration-150 overflow-hidden relative group active:scale-[0.98] active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)]',
    active: 'border-industrial-orange bg-booth-panel shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_0_16px_rgba(255,107,53,0.4)] transform scale-[0.98]',
    disabled: 'border-industrial-steel bg-booth-panel text-text-disabled cursor-not-allowed shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]',
    default: 'border-industrial-steel bg-booth-panel text-text-primary shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]',
  },
  ledText: {
    base: 'font-sans text-sm font-medium relative z-10 transition-all duration-150 whitespace-nowrap',
    active: 'text-industrial-orange',
    disabled: 'text-text-disabled',
    default: 'text-text-primary',
  },
  ledScreen: {
    base: 'absolute inset-1 rounded-md bg-booth-panel border border-industrial-steel shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]',
    active: 'border-industrial-orange shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_0_8px_rgba(255,107,53,0.1)]',
    disabled: 'border-industrial-steel',
    default: '',
  },
} as const;
