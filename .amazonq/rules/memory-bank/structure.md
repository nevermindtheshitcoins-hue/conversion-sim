# Project Structure

## Directory Organization

### Core Application (`/src/app/`)
- **`page.tsx`**: Main application entry point and primary user interface
- **`layout.tsx`**: Root layout component with global styling and providers
- **`globals.css`**: Global CSS styles and Tailwind base configuration
- **`actions.ts`**: Server actions for form handling and data processing

### API Routes (`/src/app/api/`)
- **`ai-assessment/route.ts`**: Main AI assessment endpoint for generating reports
- **`analytics/route.ts`**: Analytics tracking and user interaction logging

### AI Processing (`/src/ai/`)
- **`flows/full-context-flow.ts`**: Core AI flow for processing assessments and generating insights

### UI Components (`/src/components/`)
- **`QuestionsAndAnswers.tsx`**: Interactive questionnaire component
- **`ReportDisplay.tsx`**: Assessment results and report visualization
- **`Buttons.tsx`**: Reusable button components
- **`ErrorBoundary.tsx`**: Error handling and fallback UI
- **`ui/error-boundary.tsx`**: Additional error boundary utilities

### Utilities (`/src/lib/` & `/src/utils/`)
- **`analytics.ts`**: Analytics tracking utilities
- **`iframe-utils.ts`**: Iframe integration helpers
- **`journey-tracker.ts`**: User journey and progress tracking
- **`screen-config-new.ts`**: Screen configuration and flow management
- **`validation.ts`**: Form and data validation utilities

### Type Definitions (`/src/types/`)
- **`report.ts`**: TypeScript interfaces for assessment reports and data structures

## Architectural Patterns

### Next.js App Router Architecture
- Server-side rendering with React Server Components
- API routes for backend functionality
- Client-side interactivity where needed

### Component Architecture
- Modular, reusable components
- Clear separation between UI and business logic
- Error boundaries for robust error handling

### Data Flow
1. User interactions in questionnaire components
2. Data validation through utility functions
3. AI processing via dedicated flows
4. Report generation and display
5. Analytics tracking throughout the journey

## Key Relationships
- **Main App** → **Questionnaire** → **AI Processing** → **Report Display**
- **Analytics** tracks all user interactions across components
- **Error Boundaries** wrap critical components for reliability
- **Iframe Utils** enable seamless website embedding