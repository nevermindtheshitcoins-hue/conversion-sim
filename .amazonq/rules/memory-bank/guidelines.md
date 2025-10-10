# Development Guidelines

## Code Quality Standards

### TypeScript Strict Mode
- **Strict type checking enabled** - All code must pass TypeScript strict mode
- **Explicit type annotations** for function parameters and return types
- **Type guards** for runtime validation (e.g., `isValidRequestType`, `isFullContextOutput`)
- **No implicit any** - All types must be explicitly defined or inferred
- **Interface over type** for object shapes, especially for state and API contracts

### Code Formatting Patterns
- **Single quotes** for strings in TypeScript/JavaScript
- **Semicolons required** at end of statements
- **2-space indentation** throughout codebase
- **Trailing commas** in multi-line objects and arrays
- **Arrow functions** preferred over function expressions
- **Const by default** - use `const` unless reassignment needed, then `let` (never `var`)

### Naming Conventions
- **camelCase** for variables, functions, and methods
- **PascalCase** for components, types, interfaces, and enums
- **SCREAMING_SNAKE_CASE** for constants (e.g., `SCREEN_SEQUENCE`)
- **Descriptive names** - prefer `handleSelection` over `handle` or `onSelect`
- **Boolean prefixes** - use `is`, `has`, `can`, `should` (e.g., `isLoading`, `canConfirm`)
- **Handler prefix** - event handlers use `handle` prefix (e.g., `handleConfirm`, `handleBack`)

### File Organization
- **One component per file** - component name matches filename
- **Collocated types** - types defined in `/src/types/` directory
- **Grouped imports** - React imports first, then third-party, then local
- **Export patterns** - named exports for utilities, default export for components

## Semantic Patterns

### State Management Pattern
**Centralized hook-based state** (5/5 files):
```typescript
// Central state hook with derived values
export function useAssessmentFlow() {
  const [state, setState] = useState<AppState>({...});
  
  // Derived state computed from primary state
  const navigationState: NavigationState = {
    canGoBack: state.currentScreenIndex > 0,
    canConfirm: /* computed from state */,
  };
  
  return { state, navigationState, handlers };
}
```

**Immutable state updates** (5/5 files):
```typescript
// Always spread previous state, never mutate
setState(prev => ({ ...prev, isLoading: true, error: null }));

// Conditional state updates to prevent unnecessary renders
setState(prev => (prev.useFpsBudget ? { ...prev, useFpsBudget: false } : prev));
```

### Component Composition Pattern
**Props destructuring with explicit types** (5/5 files):
```typescript
interface ComponentProps {
  title: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function Component({ title, onConfirm, isLoading = false }: ComponentProps) {
  // Component logic
}
```

**Zone-based architecture** (4/5 files):
- Components organized into logical zones (header, screen, keypad, footer)
- Each zone receives specific props and responsibilities
- Parent component orchestrates zone composition

### Error Handling Pattern
**Defensive validation with type guards** (4/5 files):
```typescript
// Runtime type validation
function validateRequestBody(body: unknown): body is RequestBody {
  if (!body || typeof body !== 'object') return false;
  const c = body as Partial<RequestBody>;
  return (
    isValidRequestType(c.requestType) &&
    typeof c.userJourney === 'object' && c.userJourney !== null
  );
}
```

**Try-catch with fallbacks** (4/5 files):
```typescript
try {
  result = await callOpenAI(prompt, requestType);
} catch (openaiError) {
  console.warn('OpenAI failed, trying Gemini:', openaiError);
  try {
    result = await callGemini(prompt, requestType);
  } catch (geminiError) {
    throw new Error('AI generation failed');
  }
}
```

**User-facing error messages** (5/5 files):
```typescript
setState(prev => ({
  ...prev,
  error: error instanceof Error ? error.message : 'Failed to load questions',
}));
```

### API Integration Pattern
**Validated request/response types** (3/5 files):
```typescript
interface RequestBody {
  userJourney: UserJourney;
  requestType: AIRequestType;
  industry?: string;
  customScenario?: string;
}

// Validate before processing
if (!validateRequestBody(body)) {
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
```

**Environment-based configuration** (4/5 files):
```typescript
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey || apiKey.length < 20) {
  throw new Error('Invalid OpenAI API key');
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
```

### React Hooks Usage
**useCallback for event handlers** (5/5 files):
```typescript
const handleConfirm = useCallback(async () => {
  // Handler logic
}, [state, journeyTracker, generateReport]);
```

**useEffect for side effects** (5/5 files):
```typescript
// Update screen config when dependencies change
useEffect(() => {
  const config = getScreenConfig(state.currentScreen, state.industry);
  setState(prev => ({ ...prev, ...config }));
}, [state.currentScreen, state.industry]);
```

**Dependency arrays** - Always include all dependencies or use ESLint disable with comment

### Conditional Rendering Pattern
**Ternary for simple conditions** (5/5 files):
```typescript
const headerStatus = state.isReport 
  ? 'complete' 
  : state.isLoading 
  ? 'loading' 
  : 'active';
```

**Early returns for complex conditions** (4/5 files):
```typescript
if (state.currentScreen === 'REPORT') {
  setState(prev => ({ ...prev, isReport: true, /* ... */ }));
  return;
}
```

### Styling Patterns
**Tailwind utility classes** (5/5 files):
```typescript
className="h-20 w-20 rounded-full bg-emerald-500 border-4 border-emerald-700"
```

**Conditional classes with template literals** (5/5 files):
```typescript
className={`h-20 w-20 rounded-full border-4 ${
  navigationState.canConfirm || state.isReport
    ? 'bg-emerald-500 border-emerald-700 hover:bg-emerald-400'
    : 'bg-emerald-900 border-emerald-950 opacity-30'
}`}
```

**CSS variables for theming** (3/5 files):
```typescript
colors: {
  background: 'hsl(var(--background))',
  primary: { DEFAULT: 'hsl(var(--primary))' },
}
```

## Internal API Usage

### State Updates
```typescript
// CORRECT: Immutable update with spread
setState(prev => ({ ...prev, tempSelection: value, error: null }));

// CORRECT: Conditional update to prevent re-renders
setState(prev => (prev.useFpsBudget ? { ...prev, useFpsBudget: false } : prev));

// INCORRECT: Direct mutation
state.tempSelection = value; // Never do this
```

### Journey Tracking
```typescript
// Add response to journey tracker
journeyTracker.addResponse(
  state.currentScreen,
  state.tempSelection,
  selectedText
);

// Get full context for API calls
const journey = journeyTracker.getFullContext(state.currentScreen);
```

### Content Type Mapping
```typescript
// Compute content type from state
const contentType = getContentType(state);

// Use in component rendering
<ZonedScreen contentType={state.contentType} />
```

### Screen Configuration
```typescript
// Get screen config with optional industry context
const config = getScreenConfig(state.currentScreen, state.industry || undefined);

// Apply config to state
setState(prev => ({
  ...prev,
  currentTitle: config.title,
  currentOptions: config.options,
  isTextInput: config.textInput || false,
}));
```

## Code Idioms

### Optional Chaining & Nullish Coalescing
```typescript
// Safe property access
const content = data.choices?.[0]?.message?.content;

// Default values
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
```

### Array Methods
```typescript
// Map with index
const selectedTexts = state.multiSelections
  .map(val => state.currentOptions[val - 1])
  .join(', ');

// Filter and reduce
const priorChoices = userJourney.responses.reduce<Record<string, string>>(
  (accumulator, response) => {
    accumulator[response.screen] = response.buttonText;
    return accumulator;
  }, 
  {}
);
```

### Async/Await Error Handling
```typescript
// Always wrap async operations in try-catch
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Operation failed:', error);
  throw error;
}
```

### Type Assertions
```typescript
// Use type guards instead of assertions when possible
if (isFullContextOutput(data)) {
  return data; // TypeScript knows the type
}

// Use 'as' for unavoidable casts
const body = (await request.json()) as unknown;
```

## Annotations & Documentation

### JSDoc Comments
- **Minimal comments** - code should be self-documenting
- **Complex logic only** - add comments for non-obvious business logic
- **Type annotations** preferred over JSDoc for types

### Interface Documentation
```typescript
// Document complex interfaces
interface ReportGenerationRequest {
  userJourney: UserJourney;
  requestType: 'generate_questions' | 'generate_report';
  industry?: string;
  customScenario?: string;
  signature: string;
}
```

### Server Actions
```typescript
// Mark server-only code
'use server';

export async function generateCustomReport(
  userJourney: UserJourney,
  industry: string
): Promise<FullContextOutput> {
  // Server-side logic
}
```

## Testing Patterns

### Validation Functions
- Pure functions for validation logic
- Return boolean or validation result objects
- Testable in isolation

### Error Messages
- User-facing messages are clear and actionable
- Technical errors logged to console
- Fallback messages for unknown errors

## Performance Optimizations

### Motion Preferences
```typescript
// Respect user preferences and device capabilities
const shouldDisableMotion = () => {
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const isMobile = /Mobi|Android/i.test(window.navigator.userAgent);
  return prefersReducedMotion || isMobile;
};
```

### Conditional Rendering
- Compute derived state once, reuse in render
- Use early returns to avoid unnecessary computation
- Memoize expensive calculations with useMemo (when needed)

### API Optimization
- Batch related state updates
- Debounce user input for text fields
- Cache AI responses when appropriate
