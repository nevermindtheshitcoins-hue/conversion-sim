# Zoned Single-Screen Architecture Design

**Mission**: Transform multi-screen navigation into fluid single-screen zoned interface  
**Date**: 2025  
**Status**: Design Phase

---

## 1. COMPONENT ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARCADE CABINET (AppContainer)                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              MARQUEE (15% - Static Header)                 │  │
│  │          "DeVOTE PILOT SCENARIO SIMULATOR"                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────┬──────────────────────────┐    │
│  │   SCREEN (60% - Dynamic)     │  KEYPAD (40% - STATIC)   │    │
│  │  ┌────────────────────────┐  │  ┌────────────────────┐  │    │
│  │  │ HEADER ZONE            │  │  │  7 FIXED BUTTONS   │  │    │
│  │  │ • Progress Bar         │  │  │  [1] [2] [3]       │  │    │
│  │  │ • Step Counter         │  │  │  [4] [5] [6]       │  │    │
│  │  │ • Status Indicator     │  │  │      [7]           │  │    │
│  │  └────────────────────────┘  │  │                    │  │    │
│  │  ┌────────────────────────┐  │  │  TEXT INPUT        │  │    │
│  │  │ MAIN ZONE (Morphing)   │  │  │  [____________]    │  │    │
│  │  │                        │  │  │                    │  │    │
│  │  │ Content varies:        │  │  │  ACTION BUTTONS    │  │    │
│  │  │ • Industry Picker      │  │  │  [BACK] [CONFIRM]  │  │    │
│  │  │ • Text Input Preview   │  │  │  [RESET]           │  │    │
│  │  │ • Question Display     │  │  │                    │  │    │
│  │  │ • Report View          │  │  └────────────────────┘  │    │
│  │  │                        │  │                          │    │
│  │  └────────────────────────┘  │                          │    │
│  │  ┌────────────────────────┐  │                          │    │
│  │  │ FOOTER ZONE            │  │                          │    │
│  │  │ • Error Messages       │  │                          │    │
│  │  │ • Hovered Option       │  │                          │    │
│  │  │ • Context Help         │  │                          │    │
│  │  └────────────────────────┘  │                          │    │
│  └──────────────────────────────┴──────────────────────────┘    │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    BASE (20% - Static)                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Current vs. Target Architecture

**CURRENT (Multi-Screen)**
```
useAssessmentFlow → currentScreen → Full Component Swap
                  ↓
            [PRELIM_1] → [PRELIM_2] → [PRELIM_3] → [Q4-Q7] → [REPORT]
```

**TARGET (Single-Screen Zoned)**
```
useAssessmentFlow → contentState → Zone Content Morphing
                  ↓
            Header: Always visible (progress/step)
            Main:   Content morphs based on state
            Footer: Context-aware messages
            Keypad: COMPLETELY STATIC (never changes)
```

---

## 2. STATE FLOW MAP

### Current State Management (useAssessmentFlow)

**State Structure** (from `app-state.ts`):
```typescript
AppState {
  // Navigation (REMOVE in zoned architecture)
  currentScreen: string          // ❌ Replace with contentType
  currentScreenIndex: number     // ✅ Keep for progress
  
  // Content State (ENHANCE for zones)
  currentTitle: string           // ✅ Main Zone
  currentSubtitle: string        // ✅ Main Zone
  currentOptions: string[]       // ✅ Maps to Keypad labels
  
  // UI State (ZONE-AWARE)
  progress: number               // ✅ Header Zone
  error: string | null           // ✅ Footer Zone
  hoveredOption: number | null   // ✅ Footer Zone
  
  // Input State (KEYPAD-DRIVEN)
  tempSelection: number          // ✅ Keypad state
  multiSelections: number[]      // ✅ Keypad state
  textValue: string              // ✅ Keypad text input
  
  // Mode Flags (CONTENT TYPE)
  isTextInput: boolean           // ✅ Main Zone mode
  isMultiSelect: boolean         // ✅ Keypad mode
  isReport: boolean              // ✅ Main Zone mode
  isLoading: boolean             // ✅ Main Zone overlay
}
```

### Content Type State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTENT TYPES (Main Zone)                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  INDUSTRY_PICKER                                             │
│    ├─ Display: Grid of industry options                     │
│    ├─ Keypad: Buttons 1-7 mapped to industries              │
│    └─ Footer: Hovered industry description                  │
│                                                              │
│  SINGLE_CHOICE                                               │
│    ├─ Display: Question + option preview                    │
│    ├─ Keypad: Buttons 1-N mapped to options                 │
│    └─ Footer: Hovered option text                           │
│                                                              │
│  MULTI_CHOICE                                                │
│    ├─ Display: Question + selected chips                    │
│    ├─ Keypad: Buttons toggle selections                     │
│    └─ Footer: Selection count + validation                  │
│                                                              │
│  TEXT_INPUT                                                  │
│    ├─ Display: Question + live text preview                 │
│    ├─ Keypad: Text input field active                       │
│    └─ Footer: Character count + validation                  │
│                                                              │
│  AI_LOADING                                                  │
│    ├─ Display: Loading animation + context                  │
│    ├─ Keypad: Disabled during generation                    │
│    └─ Footer: "Generating questions..."                     │
│                                                              │
│  REPORT_VIEW                                                 │
│    ├─ Display: Full report with scrolling                   │
│    ├─ Keypad: Copy/Reset/CTA buttons                        │
│    └─ Footer: Report actions                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Zone Content Morphing Flow

```
USER ACTION → STATE UPDATE → ZONE REACTIONS
     ↓              ↓              ↓
  Button 1    tempSelection=1   Main: Highlight option
     ↓              ↓              ↓
  Confirm     validate()        Main: Morph to next content
     ↓              ↓              ↓
  (async)     loadAI()          Main: Show AI_LOADING
     ↓              ↓              ↓
  Response    questions[]       Main: Morph to SINGLE_CHOICE
     ↓              ↓              ↓
  Complete    isReport=true     Main: Morph to REPORT_VIEW

KEYPAD: Never changes structure, only button states (active/disabled)
HEADER: Progress bar animates, step counter increments
FOOTER: Messages update based on hover/error/validation
```

---

## 3. IMPLEMENTATION CHECKLIST

### Round 2: Core Zone Components

**Create Zone Components**
- [ ] `src/components/zones/HeaderZone.tsx`
  - Progress bar (existing logic from main-app.tsx)
  - Step counter with animation
  - Status indicator (active/loading/complete)
  
- [ ] `src/components/zones/MainZone.tsx`
  - Content type router
  - Morph animations between content types
  - Shared layout wrapper
  
- [ ] `src/components/zones/FooterZone.tsx`
  - Error display (from current status messages)
  - Hovered option preview
  - Validation messages
  - Context help text

**Refactor State Management**
- [ ] Add `contentType` enum to AppState
- [ ] Create `getContentType()` helper (replaces screen-based logic)
- [ ] Remove `currentScreen` navigation dependencies
- [ ] Map existing screens to content types

### Round 3: Content Type Implementations

**Main Zone Content Components**
- [ ] `src/components/content/IndustryPicker.tsx`
  - Grid layout for industries
  - Visual selection feedback
  - Hover state integration
  
- [ ] `src/components/content/SingleChoice.tsx`
  - Question display
  - Option preview cards
  - Selection animation
  
- [ ] `src/components/content/MultiChoice.tsx`
  - Question display
  - Selected chips display
  - Multi-select feedback
  
- [ ] `src/components/content/TextInputPreview.tsx`
  - Live text preview
  - Character counter
  - Validation feedback
  
- [ ] `src/components/content/AILoading.tsx`
  - Loading animation
  - Context message
  - Progress indicator
  
- [ ] `src/components/content/ReportView.tsx`
  - Scrollable report
  - Section navigation
  - Export actions

**Keypad Refactor**
- [ ] Ensure Buttons.tsx never unmounts
- [ ] Add disabled states for AI loading
- [ ] Map button labels dynamically from state
- [ ] Keep text input always rendered (show/hide)

### Round 4: Transition Animations

**Morph Animations**
- [ ] Fade-in/out between content types
- [ ] Slide transitions for sequential content
- [ ] Scale animations for emphasis
- [ ] Respect `useFpsBudget` flag

**Progress Animations**
- [ ] Smooth progress bar transitions
- [ ] Step counter increment animation
- [ ] Status indicator state changes

**Interaction Feedback**
- [ ] Button press animations
- [ ] Selection confirmation
- [ ] Error shake animations
- [ ] Success checkmarks

### Round 5: Integration & Polish

**Hook Refactoring**
- [ ] Update `useAssessmentFlow` for content types
- [ ] Remove screen navigation logic
- [ ] Add content morph triggers
- [ ] Maintain backward compatibility

**Testing**
- [ ] All content types render correctly
- [ ] Keypad remains static through flow
- [ ] Animations respect motion preferences
- [ ] Error states display in footer
- [ ] Progress tracking accurate

**Performance**
- [ ] Memoize zone components
- [ ] Optimize re-render triggers
- [ ] Lazy load report content
- [ ] Monitor FPS during morphs

---

## 4. RISK ASSESSMENT

### HIGH RISK ⚠️

**1. State Management Complexity**
- **Risk**: Content type state machine more complex than screen-based
- **Impact**: Bugs in state transitions, orphaned states
- **Mitigation**: 
  - Create comprehensive state diagram
  - Add state validation guards
  - Unit test all transitions
  - Keep `currentScreenIndex` as fallback

**2. Animation Performance**
- **Risk**: Morphing animations cause jank on low-end devices
- **Impact**: Poor UX, accessibility issues
- **Mitigation**:
  - Respect `useFpsBudget` flag (already exists)
  - Use CSS transforms (GPU-accelerated)
  - Provide instant-transition fallback
  - Test on mobile devices

**3. Keypad Static Constraint**
- **Risk**: 7 buttons insufficient for some content types
- **Impact**: UX compromises, feature limitations
- **Mitigation**:
  - Pagination for >7 options (show "More" button)
  - Multi-select for related options
  - Text input for custom entries
  - Validate all screens fit constraint

### MEDIUM RISK ⚡

**4. Content Type Mapping**
- **Risk**: Existing screens don't map cleanly to content types
- **Impact**: Refactoring complexity, edge cases
- **Mitigation**:
  - Create mapping table (screen → content type)
  - Gradual migration path
  - Keep screen-based logic as fallback

**5. Footer Zone Overload**
- **Risk**: Too many messages compete for footer space
- **Impact**: Information overload, poor hierarchy
- **Mitigation**:
  - Priority system (error > validation > hover)
  - Single message at a time
  - Smooth transitions between messages

**6. AI Loading State**
- **Risk**: Long AI generation blocks entire interface
- **Impact**: User frustration, perceived slowness
- **Mitigation**:
  - Show progress in main zone
  - Keep header/footer responsive
  - Add cancel option
  - Timeout with fallback

### LOW RISK ✓

**7. Backward Compatibility**
- **Risk**: Breaking existing analytics/tracking
- **Impact**: Lost data, broken integrations
- **Mitigation**:
  - Map content types back to screen names
  - Keep journey tracker compatible
  - Update analytics events

**8. CSS/Layout Shifts**
- **Risk**: Zone height changes cause layout jumps
- **Impact**: Jarring visual experience
- **Mitigation**:
  - Fixed zone heights
  - Min-height constraints
  - Smooth height transitions

---

## 5. SUCCESS CRITERIA

### Functional Requirements ✅

1. **Zero Screen Navigation**
   - No route changes or component unmounting
   - All transitions via content morphing
   - Keypad never re-renders structure

2. **Content Type Coverage**
   - All 8 current screens map to content types
   - Report view fully functional
   - AI loading states handled

3. **State Integrity**
   - No lost user input during morphs
   - Progress tracking accurate
   - Back button reconstructs previous state

4. **Keypad Constraint**
   - All interactions via 7 buttons + text input
   - No dynamic button addition/removal
   - Clear button-to-option mapping

### UX Requirements 🎨

5. **Smooth Transitions**
   - <300ms morph animations
   - No layout shifts
   - Respects motion preferences

6. **Clear Feedback**
   - Immediate button press response
   - Hover states in footer
   - Error messages prominent

7. **Progress Visibility**
   - Always-visible progress bar
   - Step counter updates
   - Clear completion state

### Technical Requirements 🔧

8. **Performance**
   - 60fps on desktop
   - 30fps minimum on mobile
   - <100ms state update latency

9. **Maintainability**
   - Content types easily extensible
   - Zone components reusable
   - Clear separation of concerns

10. **Accessibility**
    - Keyboard navigation preserved
    - Screen reader announcements
    - ARIA live regions for morphs

---

## 6. MIGRATION PATH

### Phase 1: Parallel Implementation
- Build zone components alongside existing
- Feature flag for new architecture
- A/B test with subset of users

### Phase 2: Gradual Cutover
- Migrate one content type at a time
- Keep screen-based fallback
- Monitor error rates

### Phase 3: Full Migration
- Remove screen navigation code
- Clean up unused components
- Update documentation

### Rollback Plan
- Feature flag instant disable
- Screen-based code preserved
- Database/state compatible

---

## 7. TECHNICAL NOTES

### Key Files to Modify

**Core State** (Minimal changes)
- `src/hooks/useAssessmentFlow.ts` - Add content type logic
- `src/types/app-state.ts` - Add ContentType enum

**New Zone System**
- `src/components/zones/` - New directory
- `src/components/content/` - New directory

**Refactor Existing**
- `src/app/main-app.tsx` - Use zone components
- `src/components/QuestionsAndAnswers.tsx` - Split into content types
- `src/components/ControlPanel.tsx` - Ensure static structure

### Content Type Enum

```typescript
enum ContentType {
  INDUSTRY_PICKER = 'INDUSTRY_PICKER',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTI_CHOICE = 'MULTI_CHOICE',
  TEXT_INPUT = 'TEXT_INPUT',
  AI_LOADING = 'AI_LOADING',
  REPORT_VIEW = 'REPORT_VIEW',
}

// Mapping function
function getContentType(state: AppState): ContentType {
  if (state.isReport) return ContentType.REPORT_VIEW;
  if (state.isLoading) return ContentType.AI_LOADING;
  if (state.isTextInput) return ContentType.TEXT_INPUT;
  if (state.isMultiSelect) return ContentType.MULTI_CHOICE;
  if (state.currentScreenIndex === 0) return ContentType.INDUSTRY_PICKER;
  return ContentType.SINGLE_CHOICE;
}
```

### Animation Strategy

```typescript
// Morph transition config
const morphTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

// Respect motion preferences
const shouldAnimate = !state.useFpsBudget;
```

---

## CONCLUSION

This architecture shift transforms navigation from **screen-based** to **content-based**, enabling fluid UX while maintaining the analog machine constraint. The three-zone system provides clear visual hierarchy, the static keypad preserves the physical interface metaphor, and content morphing eliminates jarring transitions.

**Next Steps**: Proceed to Round 2 implementation with zone component creation.
