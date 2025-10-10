# Project Structure

## Directory Organization

### `/src/app/` - Next.js Application Layer
- **page.tsx** - Root page entry point
- **layout.tsx** - Application layout wrapper
- **main-app.tsx** - Main application component orchestrating the assessment flow
- **globals.css** - Global styles and CSS variables
- **crt-styles.css** - CRT visual effect styles (scanlines, glow, phosphor)
- **api/** - API route handlers for server-side logic

### `/src/components/` - UI Components
- **AppContainer.tsx** - Top-level container managing screen layout
- **CRTShell.tsx** - CRT visual wrapper with header, screen, keypad, and footer zones
- **ZonedScreen.tsx** - Screen zone manager handling content display and status
- **ControlPanel.tsx** - Interactive control panel for user input (dial, buttons)
- **QuestionsAndAnswers.tsx** - Question display and answer preview
- **ReportDisplay.tsx** - Final assessment report rendering
- **CRTScreen.tsx** - Core CRT screen component with visual effects
- **Buttons.tsx** - Reusable button components
- **zones/** - Zone-specific components for modular screen areas

### `/src/hooks/` - React Hooks
- **useAssessmentFlow.ts** - Core assessment state management and flow control
- **useProgressService.ts** - Progress tracking and step management

### `/src/ai/` - AI Integration
- **flows/** - AI assessment flow implementations
  - **full-context-flow.ts** - Complete context-aware AI assessment logic

### `/src/lib/` - Utilities & Business Logic
- **screen-config-new.ts** - Screen configuration and question definitions
- **content-type-utils.ts** - Content type mapping and utilities
- **journey-tracker.ts** - User journey tracking and analytics
- **analytics.ts** - Analytics integration
- **iframe-utils.ts** - Iframe embedding utilities
- **security.ts** - Security headers and validation
- **validation.ts** - Input validation utilities

### `/src/types/` - TypeScript Definitions
- **app-state.ts** - Application state type definitions
- **report.ts** - Report data structure types

### `/src/styles/` - Additional Styles
- **crt-effects.css** - Extended CRT visual effects

### `/docs/` - Documentation
- Architecture analysis and design documents
- Implementation guides and phase documentation
- Visual flow diagrams and zone architecture specs

## Core Component Relationships

### Assessment Flow Architecture
```
MainApp (main-app.tsx)
  ├─> useAssessmentFlow (state management)
  ├─> useProgressService (progress tracking)
  └─> AppContainer
       └─> CRTShell
            ├─> ZonedScreen (header + content)
            │    └─> QuestionsAndAnswers / ReportDisplay
            ├─> ControlPanel (keypad zone)
            └─> Footer (navigation buttons)
```

### State Management Pattern
- **useAssessmentFlow** - Central hook managing assessment state, navigation, and user interactions
- State flows unidirectionally from hook to components
- Handlers passed down for user actions (selection, navigation, reset)
- Derived state computed for navigation controls and UI status

### Zone-Based Layout
The application uses a zone-based architecture:
- **Header Zone** - Progress and status indicators
- **Screen Zone** - Main content display (questions, report)
- **Keypad Zone** - Interactive control panel
- **Footer Zone** - Navigation buttons (back, confirm, reset)

## Architectural Patterns

### Component Composition
- Small, focused components with single responsibilities
- Container/Presentational pattern for state vs. display logic
- Zone-based composition for flexible layout management

### State Management
- React hooks for local state and side effects
- Centralized assessment flow logic in useAssessmentFlow
- Derived state for computed values and navigation rules

### Styling Approach
- Tailwind CSS utility classes for component styling
- Custom CSS for CRT effects and animations
- CSS variables for theming and customization
- Conditional classes based on state (loading, disabled, active)

### Type Safety
- Strict TypeScript configuration
- Comprehensive type definitions in `/src/types/`
- Type inference for component props and state
