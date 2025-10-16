# Round 2 Implementation Guide

**Goal**: Create zone components and content type infrastructure without breaking existing functionality.

---

## Step-by-Step Implementation

### Step 1: Add ContentType Enum (5 min)

**File**: `src/types/app-state.ts`

Add after existing imports:

```typescript
export enum ContentType {
  INDUSTRY_PICKER = 'INDUSTRY_PICKER',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTI_CHOICE = 'MULTI_CHOICE',
  TEXT_INPUT = 'TEXT_INPUT',
  AI_LOADING = 'AI_LOADING',
  REPORT_VIEW = 'REPORT_VIEW',
}
```

Add to AppState interface:

```typescript
export interface AppState {
  // ... existing fields ...
  
  // NEW: Content type for zone rendering
  contentType?: ContentType; // Optional for gradual migration
}
```

---

### Step 2: Create Content Type Helper (10 min)

**File**: `src/lib/content-type-utils.ts` (NEW)

```typescript
import { ContentType } from '../types/app-state';
import type { AppState } from '../types/app-state';

export function getContentType(state: AppState): ContentType {
  // Report takes precedence
  if (state.isReport) {
    return ContentType.REPORT_VIEW;
  }
  
  // Loading state
  if (state.isLoading && state.aiGenerated) {
    return ContentType.AI_LOADING;
  }
  
  // Text input mode
  if (state.isTextInput) {
    return ContentType.TEXT_INPUT;
  }
  
  // Multi-select mode
  if (state.isMultiSelect) {
    return ContentType.MULTI_CHOICE;
  }
  
  // Industry picker (first screen)
  if (state.currentScreenIndex === 0) {
    return ContentType.INDUSTRY_PICKER;
  }
  
  // Default to single choice
  return ContentType.SINGLE_CHOICE;
}

export function getContentTypeLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    [ContentType.INDUSTRY_PICKER]: 'Industry Selection',
    [ContentType.SINGLE_CHOICE]: 'Question',
    [ContentType.MULTI_CHOICE]: 'Multi-Select Question',
    [ContentType.TEXT_INPUT]: 'Text Input',
    [ContentType.AI_LOADING]: 'Generating Questions',
    [ContentType.REPORT_VIEW]: 'Assessment Report',
  };
  return labels[type];
}
```

---

### Step 3: Create HeaderZone Component (20 min)

**File**: `src/components/zones/HeaderZone.tsx` (NEW)

```typescript
import React from 'react';

export interface HeaderZoneProps {
  currentStep: number;
  totalSteps: number;
  progressPercent: number;
  status?: 'active' | 'loading' | 'complete';
  disableAnimations?: boolean;
}

export function HeaderZone({
  currentStep,
  totalSteps,
  progressPercent,
  status = 'active',
  disableAnimations = false,
}: HeaderZoneProps) {
  const statusColors = {
    active: 'bg-yellow-300',
    loading: 'bg-blue-400 animate-pulse',
    complete: 'bg-emerald-400',
  };

  const statusLabels = {
    active: 'In Progress',
    loading: 'Processing',
    complete: 'Complete',
  };

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.45em] text-zinc-500">
        <div className="flex items-center gap-3">
          <span 
            className={`h-2.5 w-2.5 rounded-full ${statusColors[status]}`}
            aria-label={statusLabels[status]}
          />
          <span>Business Proof</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-medium tracking-normal">
          Step {currentStep}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-emerald-400 to-emerald-300 ${
            disableAnimations ? '' : 'transition-all duration-600 ease-in-out'
          }`}
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${progressPercent}%`}
        />
      </div>

      {/* Step Counter */}
      <div className="text-center text-sm text-zinc-400">
        <span className="font-mono">
          {currentStep} / {totalSteps}
        </span>
      </div>
    </div>
  );
}
```

---

### Step 4: Create FooterZone Component (20 min)

**File**: `src/components/zones/FooterZone.tsx` (NEW)

```typescript
import React from 'react';

export interface FooterMessage {
  type: 'error' | 'info' | 'hover' | 'help';
  text: string;
  priority: number; // Higher = more important
}

export interface FooterZoneProps {
  messages: FooterMessage[];
  disableAnimations?: boolean;
}

export function FooterZone({ 
  messages, 
  disableAnimations = false 
}: FooterZoneProps) {
  // Sort by priority and take the highest
  const sortedMessages = [...messages].sort((a, b) => b.priority - a.priority);
  const activeMessage = sortedMessages[0];

  if (!activeMessage) {
    return null;
  }

  const typeStyles = {
    error: 'border-red-500/40 bg-red-900/70 text-red-100',
    info: 'border-blue-500/40 bg-blue-900/70 text-blue-100',
    hover: 'border-zinc-500/40 bg-zinc-800/70 text-zinc-300',
    help: 'border-emerald-500/40 bg-emerald-900/70 text-emerald-100',
  };

  const typeIcons = {
    error: '⚠',
    info: 'ℹ',
    hover: '→',
    help: '?',
  };

  return (
    <div 
      className={`flex justify-end ${disableAnimations ? '' : 'animate-in fade-in duration-200'}`}
      role="status"
      aria-live="polite"
    >
      <div 
        className={`inline-flex max-w-md items-center gap-2 rounded-lg border px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] shadow-lg ${
          typeStyles[activeMessage.type]
        }`}
      >
        <span aria-hidden="true">{typeIcons[activeMessage.type]}</span>
        <span>{activeMessage.text}</span>
      </div>
    </div>
  );
}

// Helper to create messages
export function createFooterMessage(
  type: FooterMessage['type'],
  text: string,
  priority?: number
): FooterMessage {
  const defaultPriorities = {
    error: 100,
    info: 50,
    hover: 30,
    help: 10,
  };

  return {
    type,
    text,
    priority: priority ?? defaultPriorities[type],
  };
}
```

---

### Step 5: Create MainZone Component (30 min)

**File**: `src/components/zones/MainZone.tsx` (NEW)

```typescript
import React from 'react';
import { ContentType } from '../../types/app-state';

export interface MainZoneProps {
  contentType: ContentType;
  children: React.ReactNode;
  disableAnimations?: boolean;
}

export function MainZone({ 
  contentType, 
  children, 
  disableAnimations = false 
}: MainZoneProps) {
  // Content type specific styling
  const contentStyles: Record<ContentType, string> = {
    [ContentType.INDUSTRY_PICKER]: 'min-h-[400px]',
    [ContentType.SINGLE_CHOICE]: 'min-h-[300px]',
    [ContentType.MULTI_CHOICE]: 'min-h-[300px]',
    [ContentType.TEXT_INPUT]: 'min-h-[350px]',
    [ContentType.AI_LOADING]: 'min-h-[400px] flex items-center justify-center',
    [ContentType.REPORT_VIEW]: 'min-h-[500px] max-h-[600px] overflow-y-auto',
  };

  return (
    <div 
      className={`main-zone ${contentStyles[contentType]} ${
        disableAnimations ? '' : 'transition-all duration-300 ease-in-out'
      }`}
      data-content-type={contentType}
      role="main"
      aria-label="Main content area"
    >
      <div 
        className={disableAnimations ? '' : 'animate-in fade-in slide-in-from-bottom-4 duration-300'}
      >
        {children}
      </div>
    </div>
  );
}
```

---

### Step 6: Update useAssessmentFlow Hook (15 min)

**File**: `src/hooks/useAssessmentFlow.ts`

Add import at top:

```typescript
import { getContentType } from '../lib/content-type-utils';
import { ContentType } from '../types/app-state';
```

Add to the return object (after existing state):

```typescript
export function useAssessmentFlow() {
  // ... existing code ...

  // NEW: Compute content type
  const contentType = getContentType(state);

  return {
    state: {
      ...state,
      contentType, // Add computed content type
    },
    navigationState,
    handlers: {
      // ... existing handlers ...
    },
  };
}
```

---

### Step 7: Create Zone Integration Component (20 min)

**File**: `src/components/ZonedScreen.tsx` (NEW)

```typescript
import React from 'react';
import { HeaderZone } from './zones/HeaderZone';
import { MainZone } from './zones/MainZone';
import { FooterZone, createFooterMessage, type FooterMessage } from './zones/FooterZone';
import { ContentType } from '../types/app-state';

export interface ZonedScreenProps {
  // Header props
  currentStep: number;
  totalSteps: number;
  progressPercent: number;
  status?: 'active' | 'loading' | 'complete';
  
  // Main props
  contentType: ContentType;
  children: React.ReactNode;
  
  // Footer props
  error?: string | null;
  hoveredText?: string;
  helpText?: string;
  
  // Global
  disableAnimations?: boolean;
}

export function ZonedScreen({
  currentStep,
  totalSteps,
  progressPercent,
  status = 'active',
  contentType,
  children,
  error,
  hoveredText,
  helpText,
  disableAnimations = false,
}: ZonedScreenProps) {
  // Build footer messages
  const messages: FooterMessage[] = [];
  
  if (error) {
    messages.push(createFooterMessage('error', error));
  }
  
  if (hoveredText && !error) {
    messages.push(createFooterMessage('hover', hoveredText));
  }
  
  if (helpText && !error && !hoveredText) {
    messages.push(createFooterMessage('help', helpText));
  }

  return (
    <div className="zoned-screen space-y-6">
      <HeaderZone
        currentStep={currentStep}
        totalSteps={totalSteps}
        progressPercent={progressPercent}
        status={status}
        disableAnimations={disableAnimations}
      />
      
      <MainZone
        contentType={contentType}
        disableAnimations={disableAnimations}
      >
        {children}
      </MainZone>
      
      {messages.length > 0 && (
        <FooterZone
          messages={messages}
          disableAnimations={disableAnimations}
        />
      )}
    </div>
  );
}
```

---

### Step 8: Update main-app.tsx (Gradual Integration) (15 min)

**File**: `src/app/main-app.tsx`

Replace the screen section with ZonedScreen:

```typescript
import { ZonedScreen } from '../components/ZonedScreen';
import { ContentType } from '../types/app-state';

export default function MainApp() {
  const { state, navigationState, handlers } = useAssessmentFlow();
  // ... existing code ...

  // Determine status
  const headerStatus = state.isReport 
    ? 'complete' 
    : state.isLoading 
    ? 'loading' 
    : 'active';

  const screen = (
    <CRTShell
      status={null} // Move status to footer zone
      disableMotion={!useFpsBudget}
      scanlines={useFpsBudget}
    >
      <ZonedScreen
        currentStep={currentStep}
        totalSteps={totalSteps}
        progressPercent={progressPercent}
        status={headerStatus}
        contentType={state.contentType || ContentType.SINGLE_CHOICE}
        error={state.error}
        hoveredText={hoveredOptionLabel}
        disableAnimations={!useFpsBudget}
      >
        {/* Keep existing QuestionsAndAnswers for now */}
        <QuestionsAndAnswers
          title={state.currentTitle}
          subtitle={state.currentSubtitle}
          industry={state.industry || ''}
          isLoading={state.isLoading}
          reportData={state.reportData}
          showTextPreview={state.isTextInput && state.textValue.length > 0}
          textPreview={state.textValue}
          hoveredOptionLabel={hoveredOptionLabel}
        />
      </ZonedScreen>
    </CRTShell>
  );

  // ... rest of component ...
}
```

---

## Testing Checklist

After implementing all steps:

- [ ] App still renders without errors
- [ ] Progress bar displays correctly
- [ ] Step counter shows current step
- [ ] Error messages appear in footer
- [ ] Hover text appears in footer
- [ ] Content type computed correctly for each screen
- [ ] Animations respect useFpsBudget flag
- [ ] All existing functionality works
- [ ] No visual regressions

---

## Verification Commands

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Run dev server
npm run dev

# Test all screens
# Navigate through: PRELIM_1 → PRELIM_2 → PRELIM_3 → Q4-Q7 → REPORT
```

---

## Expected Outcome

After Round 2:
- ✅ Three zone components created
- ✅ ContentType enum and helper function
- ✅ ZonedScreen wrapper component
- ✅ Existing UI still works (no breaking changes)
- ✅ Foundation ready for Round 3 content components

**Visual Change**: Minimal - just better organized structure  
**Functional Change**: None - all existing features work  
**Code Quality**: Improved separation of concerns

---

## Next Steps (Round 3)

Once Round 2 is complete and tested:
1. Create content type components (IndustryPicker, SingleChoice, etc.)
2. Replace QuestionsAndAnswers with content type router
3. Implement content-specific interactions
4. Add morph animations between content types

---

## Rollback Plan

If issues arise:
1. Remove ZonedScreen wrapper from main-app.tsx
2. Restore original screen structure
3. Keep new zone components for future use
4. No data loss - all state management unchanged
