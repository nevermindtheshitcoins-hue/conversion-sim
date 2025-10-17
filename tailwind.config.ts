import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        display: ['Arial Black', 'Helvetica', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'var(--industrial-orange)',
          foreground: 'var(--text-primary)',
        },
        secondary: {
          DEFAULT: 'var(--industrial-blue)',
          foreground: 'var(--text-primary)',
        },
        muted: {
          DEFAULT: 'var(--industrial-slate)',
          foreground: 'var(--text-secondary)',
        },
        accent: {
          DEFAULT: 'var(--industrial-orange)',
          foreground: 'var(--text-primary)',
        },
        destructive: {
          DEFAULT: 'var(--industrial-orange-dark)',
          foreground: 'var(--text-primary)',
        },
        border: 'var(--industrial-steel)',
        input: 'var(--industrial-charcoal)',
        ring: 'var(--industrial-orange)',
        /* Industrial voting booth specific colors */
        industrial: {
          dark: 'var(--industrial-dark)',
          charcoal: 'var(--industrial-charcoal)',
          slate: 'var(--industrial-slate)',
          steel: 'var(--industrial-steel)',
          concrete: 'var(--industrial-concrete)',
          orange: {
            DEFAULT: 'var(--industrial-orange)',
            dark: 'var(--industrial-orange-dark)',
          },
          blue: {
            DEFAULT: 'var(--industrial-blue)',
            dark: 'var(--industrial-blue-dark)',
          },
        },
        booth: {
          panel: 'var(--booth-panel)',
          button: 'var(--booth-button)',
          'button-hover': 'var(--booth-button-hover)',
          'button-active': 'var(--booth-button-active)',
          screen: 'var(--booth-screen)',
          'screen-text': 'var(--booth-screen-text)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '0.3' },
        },
        flow: {
          '0%': {
            left: '8px',
            transform: 'translateY(-50%) scale(1)',
            opacity: '0.8',
          },
          '25%': {
            left: 'calc(50% - 20px)',
            transform: 'translateY(-50%) scale(1.3)',
            opacity: '1',
          },
          '50%': {
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%) scale(0.6)',
            opacity: '0.9',
          },
          '75%': {
            left: 'calc(50% + 20px)',
            transform: 'translateY(-50%) scale(1.3)',
            opacity: '1',
          },
          '100%': {
            left: 'calc(100% - 8px)',
            transform: 'translateY(-50%) scale(1)',
            opacity: '0.8',
          },
        },
        scroll: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
        'slow-blink': {
          '0%, 50%': {
            opacity: '1',
          },
          '51%, 100%': {
            opacity: '0.6',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee 24s linear infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        flow: 'flow 6s ease-in-out infinite',
        scroll: 'scroll 3s linear infinite',
        'slow-blink': 'slow-blink 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
