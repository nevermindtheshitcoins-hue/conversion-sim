# Technology Stack

## Core Technologies

### Framework & Runtime
- **Next.js 15.4.7** - React framework with App Router
- **React 18.3.1** - UI library
- **Node.js 20+** - Runtime environment
- **TypeScript 5** - Type-safe JavaScript

### Language Configuration
- **Target**: ES2017
- **Module System**: ESNext with bundler resolution
- **Strict Mode**: Enabled
- **JSX**: Preserve (handled by Next.js)

## Dependencies

### UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **tailwindcss-animate 1.0.7** - Animation utilities
- **tailwind-merge 3.0.1** - Class merging utility
- **class-variance-authority 0.7.1** - Variant management
- **clsx 2.1.1** - Conditional class names
- **lucide-react 0.475.0** - Icon library

### Radix UI Components
Comprehensive set of accessible, unstyled UI primitives:
- Accordion, Alert Dialog, Avatar, Checkbox, Collapsible
- Dialog, Dropdown Menu, Label, Menubar, Popover
- Progress, Radio Group, Scroll Area, Select, Separator
- Slider, Slot, Switch, Tabs, Toast, Tooltip

### Forms & Validation
- **react-hook-form 7.54.2** - Form state management
- **@hookform/resolvers 4.1.3** - Validation resolvers
- **zod 3.24.2** - Schema validation

### AI Integration
- **openai 4.28.0** - OpenAI API client for AI assessment logic

### Utilities
- **date-fns 3.6.0** - Date manipulation
- **dotenv 16.5.0** - Environment variable management
- **embla-carousel-react 8.6.0** - Carousel component
- **recharts 2.15.1** - Charting library
- **react-day-picker 8.10.1** - Date picker

## Development Tools

### Build & Linting
- **ESLint 8.57.1** - Code linting
- **eslint-config-next 15.5.4** - Next.js ESLint configuration
- **PostCSS 8** - CSS processing
- **patch-package 8.0.0** - Dependency patching

### Type Definitions
- @types/node
- @types/react
- @types/react-dom

## Development Commands

### Local Development
```bash
npm run dev          # Start dev server on port 9002
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

### Port Configuration
- Default development port: **9002**
- Configured in package.json: `next dev -p 9002`

## Environment Variables

### Required
- **OPENAI_API_KEY** - OpenAI API key for AI assessment
- **NEXT_PUBLIC_APP_URL** - Public base URL (e.g., http://localhost:9002)

### Optional
- **NODE_ENV** - Environment mode (development/production)
- **PORT** - Server port override
- **LOG_LEVEL** - Logging level (debug/info/warn/error)

## Build Configuration

### Next.js Config (next.config.js)
- ES module format
- Custom webpack configurations
- Environment variable handling

### TypeScript Config
- Strict type checking enabled
- Path aliases: `@/*` maps to `./src/*`
- Incremental compilation
- Next.js plugin integration

### Tailwind Config (tailwind.config.ts)
- Custom theme extensions
- Animation utilities
- Content paths for purging

### PostCSS Config
- Tailwind CSS processing
- Autoprefixer for browser compatibility

## Module System
- **Type**: ES Module (ESM)
- **Resolution**: Bundler mode
- **Interop**: ES module interop enabled
- **JSON**: Resolve JSON modules enabled
