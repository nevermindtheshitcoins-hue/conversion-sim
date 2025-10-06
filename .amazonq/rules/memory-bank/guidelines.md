# Development Guidelines

## Code Quality Standards

### TypeScript Usage
- **Strict typing**: All functions use explicit TypeScript interfaces and types
- **Interface definitions**: Complex objects use dedicated interfaces (e.g., `RequestBody`, `QuestionsAndAnswersProps`)
- **Type guards**: Runtime validation with type predicates (`validateRequest(body: any): body is RequestBody`)
- **Generic constraints**: Use `satisfies Config` pattern for configuration objects
- **Optional chaining**: Consistent use of `?.` for safe property access

### Import Organization
- **Server directives**: Use `'use server'` for server-side functions, `'use client'` for client components
- **Grouped imports**: React imports first, then external libraries, then internal modules
- **Type imports**: Use `import type` for type-only imports (`import type { UserJourney }`)
- **Relative paths**: Consistent `../` relative imports for internal modules

### Error Handling Patterns
- **Try-catch with fallbacks**: All async operations wrapped with fallback mechanisms
- **Graceful degradation**: AI failures fall back to static content rather than breaking
- **Error logging**: `console.error()` for debugging, user-friendly error messages for UI
- **Validation first**: Input validation before processing (`validateRequest`, `validateSignature`)

## Component Architecture

### React Patterns
- **Functional components**: All components use function declarations with TypeScript
- **Custom hooks**: `React.useMemo`, `React.useCallback` for performance optimization
- **State management**: `useState` with clear state initialization and type inference
- **Effect patterns**: `useEffect` with dependency arrays and cleanup

### Component Structure
- **Props interfaces**: Every component has a dedicated props interface
- **Conditional rendering**: Ternary operators for simple conditions, early returns for complex logic
- **Event handlers**: Descriptive handler names (`handleConfirm`, `handleSelect`, `handleBack`)
- **Accessibility**: ARIA attributes (`role`, `aria-live`, `aria-label`) throughout components

### State Management
- **Local state**: `useState` for component-specific state
- **Derived state**: `React.useMemo` for computed values based on props/state
- **State updates**: Functional updates for complex state (`setMultiSelections(prev => ...)`)
- **State validation**: Runtime checks before state updates

## API Design Patterns

### Route Handlers
- **Request validation**: Multi-step validation (structure, signature, business logic)
- **Response consistency**: Standardized JSON responses with error handling
- **Security**: Signature-based request validation for API endpoints
- **Fallback providers**: Multiple AI providers with automatic failover

### Data Flow
- **Server actions**: Use Next.js server actions for form processing
- **API abstraction**: Wrapper functions for external API calls (`callOpenAI`, `callGemini`)
- **Environment variables**: Proper env var validation and fallbacks
- **Base URL handling**: Dynamic base URL resolution for different environments

## Styling Conventions

### Tailwind CSS Usage
- **Utility classes**: Extensive use of Tailwind utilities for styling
- **Custom properties**: CSS variables for theme values (`hsl(var(--background))`)
- **Responsive design**: Mobile-first responsive classes (`md:text-5xl`)
- **Animation**: Custom keyframes and animations in config (`accordion-down`, `marquee`)

### Design System
- **Color palette**: Consistent color scheme with semantic naming
- **Typography**: Tracking and font weight patterns (`tracking-widest`, `font-extrabold`)
- **Spacing**: Consistent padding and margin patterns
- **Gradients**: Subtle gradients for visual depth (`bg-gradient-to-b`)

## Development Practices

### File Organization
- **Feature-based structure**: Components, utilities, and types organized by feature
- **Barrel exports**: Clean import paths through index files
- **Configuration files**: TypeScript configs with strict settings
- **Environment setup**: Multiple environment configurations (dev, staging, prod)

### Performance Optimization
- **Memoization**: Strategic use of `React.useMemo` and `React.useCallback`
- **Bundle optimization**: Next.js optimization with Turbopack for development
- **Lazy loading**: Component-level code splitting where appropriate
- **Asset optimization**: Proper image and static asset handling

### Testing Approach
- **Error boundaries**: Comprehensive error boundary implementation
- **Validation layers**: Multiple validation points (client, server, API)
- **Fallback mechanisms**: Graceful degradation for all external dependencies
- **Development tools**: Hot reload, type checking, and linting integration

## Security Standards

### Data Protection
- **Environment variables**: Secure API key management
- **Request signing**: Cryptographic signatures for API requests
- **Origin validation**: Iframe embedding security checks
- **Input sanitization**: Comprehensive input validation and sanitization

### API Security
- **Authentication**: Signature-based request authentication
- **Rate limiting**: Implicit through provider-level controls
- **Error disclosure**: Minimal error information in production responses
- **CORS handling**: Proper cross-origin request handling for iframe embedding