# Technology Stack

## Core Framework
- **Next.js 15.4.7**: React framework with App Router for full-stack development
- **React 18.3.1**: UI library with latest concurrent features
- **TypeScript 5**: Type-safe JavaScript with strict type checking

## Styling & UI
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **Radix UI**: Accessible, unstyled UI primitives
  - Accordion, Dialog, Dropdown, Progress, Tabs, Toast, and more
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management
- **Tailwind Merge**: Conditional class merging

## AI & Data Processing
- **OpenAI 4.28.0**: AI-powered assessment generation
- **Zod 3.24.2**: Runtime type validation and parsing

## Forms & Validation
- **React Hook Form 7.54.2**: Performant form library
- **Hookform Resolvers 4.1.3**: Validation resolver integration

## Charts & Visualization
- **Recharts 2.15.1**: React charting library for report visualization

## Development Tools
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting (implied from README)
- **PostCSS**: CSS processing
- **Turbopack**: Fast bundler for development (via --turbopack flag)

## Development Commands

### Primary Commands
```bash
npm run dev          # Start development server on port 9002 with Turbopack
npm run build        # Production build
npm start           # Start production server
npm run lint        # Run ESLint
npm run typecheck   # TypeScript type checking
```

### AI Development
```bash
npm run genkit:dev    # Start Genkit development server
npm run genkit:watch  # Start Genkit with file watching
```

## Environment Configuration
- **Development**: Uses `.env.local` with OPENAI_API_KEY
- **Production**: Environment variables via hosting platform
- **Required Variables**: OPENAI_API_KEY, NEXT_PUBLIC_APP_URL
- **Optional Variables**: NODE_ENV, PORT, LOG_LEVEL

## Runtime Requirements
- **Node.js 18+**: JavaScript runtime
- **npm**: Package manager
- **Modern browsers**: ES2020+ support for client-side features