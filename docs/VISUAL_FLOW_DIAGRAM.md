# Visual Flow Diagram

## User Journey Through Zones

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

START
  │
  ├─ HEADER: Progress 0% | Step 1 of 8 | Status: Active
  ├─ MAIN:   INDUSTRY_PICKER (7 industry cards)
  ├─ FOOTER: "Select your strategic focus area"
  └─ KEYPAD: Buttons 1-7 active | CONFIRM enabled when selected
  │
  │ [User clicks Button 2: "Governance & Public Sector"]
  │
  ├─ HEADER: Progress 12.5% | Step 2 of 8 | Status: Active
  ├─ MAIN:   SINGLE_CHOICE (governance domain question)
  ├─ FOOTER: Hover shows option details
  └─ KEYPAD: Buttons 1-5 active | BACK enabled | CONFIRM enabled
  │
  │ [User clicks Button 1, then CONFIRM]
  │
  ├─ HEADER: Progress 25% | Step 3 of 8 | Status: Active
  ├─ MAIN:   SINGLE_CHOICE (strategic barrier question)
  ├─ FOOTER: "Identify your primary challenge"
  └─ KEYPAD: Buttons 1-5 active | BACK enabled | CONFIRM enabled
  │
  │ [User clicks Button 3, then CONFIRM]
  │
  ├─ HEADER: Progress 37.5% | Step 4 of 8 | Status: Loading
  ├─ MAIN:   AI_LOADING (generating questions animation)
  ├─ FOOTER: "This may take 10-15 seconds"
  └─ KEYPAD: All buttons disabled
  │
  │ [AI generates questions - 12 seconds]
  │
  ├─ HEADER: Progress 37.5% | Step 4 of 8 | Status: Active
  ├─ MAIN:   SINGLE_CHOICE (AI-generated Q4)
  ├─ FOOTER: "Select the best answer"
  └─ KEYPAD: Buttons 1-4 active | BACK enabled | CONFIRM enabled
  │
  │ [User answers Q4, Q5, Q6, Q7 - same pattern]
  │
  ├─ HEADER: Progress 100% | Complete | Status: Success
  ├─ MAIN:   REPORT_VIEW (scrollable assessment)
  ├─ FOOTER: "Your personalized assessment is ready"
  └─ KEYPAD: Button 1: Copy | Button 6: Reset | Button 7: Book CTA
  │
END
```

---

## Zone Interaction Matrix

```
┌──────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Content Type │ Header Shows    │ Main Shows      │ Footer Shows    │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ INDUSTRY_    │ Step 1/8        │ 7 Industry      │ Hover: Industry │
│ PICKER       │ Progress: 0%    │ Cards in Grid   │ description     │
│              │ Status: Active  │                 │                 │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ SINGLE_      │ Step N/8        │ Question +      │ Hover: Option   │
│ CHOICE       │ Progress: N%    │ Option Cards    │ full text       │
│              │ Status: Active  │ Selected: ✓     │ Error: Validate │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ MULTI_       │ Step N/8        │ Question +      │ "2 of 3         │
│ CHOICE       │ Progress: N%    │ Selected Chips  │ selected"       │
│              │ Status: Active  │                 │ Error: Min req  │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ TEXT_        │ Step 2/8        │ Question +      │ "45/500 chars"  │
│ INPUT        │ Progress: 12.5% │ Live Preview    │ Error: Min 5    │
│              │ Status: Active  │ Typing Anim     │                 │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ AI_          │ Step N/8        │ Loading Spinner │ "Generating     │
│ LOADING      │ Progress: N%    │ AI Icon Pulse   │ questions..."   │
│              │ Status: Loading │ Context Info    │ Time estimate   │
├──────────────┼─────────────────┼─────────────────┼─────────────────┤
│ REPORT_      │ Complete        │ Scrollable      │ "Report ready"  │
│ VIEW         │ Progress: 100%  │ Report Sections │ Action hints    │
│              │ Status: Success │ Export Options  │                 │
└──────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

## Keypad State Matrix

```
┌──────────────┬─────────┬─────────┬─────────┬──────────┬──────────┐
│ Content Type │ Btn 1-7 │ Text In │ BACK    │ CONFIRM  │ RESET    │
├──────────────┼─────────┼─────────┼─────────┼──────────┼──────────┤
│ INDUSTRY_    │ Active  │ Hidden  │ Disabled│ On Select│ Hidden   │
│ PICKER       │ (1-7)   │         │         │          │          │
├──────────────┼─────────┼─────────┼─────────┼──────────┼──────────┤
│ SINGLE_      │ Active  │ Hidden  │ Enabled │ On Select│ Hidden   │
│ CHOICE       │ (1-N)   │         │         │          │          │
│              │ Disabled│         │         │          │          │
│              │ (N+1-7) │         │         │          │          │
├──────────────┼─────────┼─────────┼─────────┼──────────┼──────────┤
│ MULTI_       │ Toggle  │ Hidden  │ Enabled │ On Valid │ Hidden   │
│ CHOICE       │ (1-N)   │         │         │ (min 1)  │          │
│              │ Disabled│         │         │          │          │
│              │ (N+1-7) │         │         │          │          │
├──────────────┼─────────┼─────────┼─────────┼──────────┼──────────┤
│ TEXT_        │ Disabled│ Active  │ Enabled │ On Valid │ Hidden   │
│ INPUT        │ (1-7)   │ Focused │         │ (min 5)  │          │
├──────────────┼─────────┼─────────┼─────────┼──────────┼──────────┤
│ AI_          │ Disabled│ Disabled│ Disabled│ Disabled │ Hidden   │
│ LOADING      │ (1-7)   │         │         │          │          │
├──────────────┼─────────┼─────────┼─────────┼──────────┼──────────┤
│ REPORT_      │ Special │ Hidden  │ Disabled│ Hidden   │ Visible  │
│ VIEW         │ Actions │         │         │          │          │
│              │ 1:Copy  │         │         │          │          │
│              │ 6:Reset │         │         │          │          │
│              │ 7:CTA   │         │         │          │          │
└──────────────┴─────────┴─────────┴─────────┴──────────┴──────────┘
```

---

## Animation Sequence

```
CONTENT TYPE TRANSITION ANIMATION
═══════════════════════════════════

INDUSTRY_PICKER → SINGLE_CHOICE
┌─────────────────────────────────┐
│ Frame 1 (0ms):                  │
│   Industry cards at opacity: 1  │
│                                 │
│ Frame 2 (100ms):                │
│   Industry cards fade to 0.5    │
│   Scale down to 0.95            │
│                                 │
│ Frame 3 (200ms):                │
│   Industry cards opacity: 0     │
│   Question fades in at 0.3      │
│                                 │
│ Frame 4 (300ms):                │
│   Question at opacity: 1        │
│   Options slide up from bottom  │
└─────────────────────────────────┘

SINGLE_CHOICE → AI_LOADING
┌─────────────────────────────────┐
│ Frame 1 (0ms):                  │
│   Question + options visible    │
│                                 │
│ Frame 2 (100ms):                │
│   Fade to 0.3                   │
│   Blur filter applied           │
│                                 │
│ Frame 3 (200ms):                │
│   Loading spinner fades in      │
│   AI icon appears               │
└─────────────────────────────────┘

AI_LOADING → SINGLE_CHOICE
┌─────────────────────────────────┐
│ Frame 1 (0ms):                  │
│   Loading spinner visible       │
│                                 │
│ Frame 2 (150ms):                │
│   Spinner scales down           │
│   Fade to 0                     │
│                                 │
│ Frame 3 (300ms):                │
│   Question slides up            │
│   Fade in from 0 to 0.5         │
│                                 │
│ Frame 4 (400ms):                │
│   Full opacity                  │
│   Options appear with stagger   │
└─────────────────────────────────┘

SINGLE_CHOICE → REPORT_VIEW
┌─────────────────────────────────┐
│ Frame 1 (0ms):                  │
│   Question visible              │
│                                 │
│ Frame 2 (200ms):                │
│   Scale up to 1.05              │
│   Fade to 0.5                   │
│                                 │
│ Frame 3 (350ms):                │
│   Fade to 0                     │
│   Report header appears         │
│                                 │
│ Frame 4 (500ms):                │
│   Report fully visible          │
│   Sections animate in sequence  │
└─────────────────────────────────┘
```

---

## State Decision Tree

```
                    ┌─────────────┐
                    │ AppState    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ isReport?   │
                    └──┬───────┬──┘
                  YES  │       │  NO
              ┌────────▼──┐    │
              │ REPORT_   │    │
              │ VIEW      │    │
              └───────────┘    │
                               │
                        ┌──────▼──────┐
                        │ isLoading   │
                        │ && aiGen?   │
                        └──┬───────┬──┘
                      YES  │       │  NO
                  ┌────────▼──┐    │
                  │ AI_       │    │
                  │ LOADING   │    │
                  └───────────┘    │
                                   │
                            ┌──────▼──────┐
                            │ isTextInput?│
                            └──┬───────┬──┘
                          YES  │       │  NO
                      ┌────────▼──┐    │
                      │ TEXT_     │    │
                      │ INPUT     │    │
                      └───────────┘    │
                                       │
                                ┌──────▼──────┐
                                │isMultiSelect│
                                └──┬───────┬──┘
                              YES  │       │  NO
                          ┌────────▼──┐    │
                          │ MULTI_    │    │
                          │ CHOICE    │    │
                          └───────────┘    │
                                           │
                                    ┌──────▼──────┐
                                    │screenIndex  │
                                    │    === 0?   │
                                    └──┬───────┬──┘
                                  YES  │       │  NO
                              ┌────────▼──┐    │
                              │ INDUSTRY_ │    │
                              │ PICKER    │    │
                              └───────────┘    │
                                               │
                                        ┌──────▼──────┐
                                        │ SINGLE_     │
                                        │ CHOICE      │
                                        │ (default)   │
                                        └─────────────┘
```

---

## Component Hierarchy

```
MainApp
├── AppContainer
│   ├── Marquee (Static)
│   │   └── "DeVOTE PILOT SCENARIO SIMULATOR"
│   │
│   ├── CRTShell (Screen Container)
│   │   ├── CRT Effects (scanlines, glow)
│   │   └── ZonedScreen ◄── NEW COMPONENT
│   │       ├── HeaderZone ◄── NEW
│   │       │   ├── Status Indicator
│   │       │   ├── Progress Bar
│   │       │   └── Step Counter
│   │       │
│   │       ├── MainZone ◄── NEW
│   │       │   └── Content Router
│   │       │       ├── IndustryPicker ◄── NEW
│   │       │       ├── SingleChoice ◄── NEW
│   │       │       ├── MultiChoice ◄── NEW
│   │       │       ├── TextInputPreview ◄── NEW
│   │       │       ├── AILoading ◄── NEW
│   │       │       └── ReportView ◄── NEW
│   │       │
│   │       └── FooterZone ◄── NEW
│   │           └── Message Display
│   │               ├── Error Messages
│   │               ├── Hover Text
│   │               └── Help Text
│   │
│   └── ControlPanel (Keypad - STATIC)
│       └── Buttons
│           ├── Button 1-7 (Fixed)
│           ├── Text Input
│           └── Action Buttons
│               ├── BACK
│               ├── CONFIRM
│               └── RESET
│
└── Base (Static Footer)
```

---

## Data Flow

```
USER ACTION
    │
    ├─► Button Click
    │       │
    │       ├─► handleSelection(id)
    │       │       │
    │       │       └─► setState({ tempSelection: id })
    │       │               │
    │       │               └─► Triggers re-render
    │       │                       │
    │       │                       ├─► HeaderZone: No change
    │       │                       ├─► MainZone: Highlight option
    │       │                       ├─► FooterZone: Show hover text
    │       │                       └─► Keypad: Update button state
    │       │
    │       └─► handleConfirm()
    │               │
    │               ├─► validateTransition()
    │               │       │
    │               │       ├─► Valid: Continue
    │               │       └─► Invalid: Show error in footer
    │               │
    │               ├─► journeyTracker.addResponse()
    │               │
    │               └─► setState({ currentScreenIndex: +1 })
    │                       │
    │                       └─► Triggers content type change
    │                               │
    │                               ├─► getContentType() computes new type
    │                               │
    │                               └─► Zones react
    │                                       │
    │                                       ├─► HeaderZone: Update progress
    │                                       ├─► MainZone: Morph content
    │                                       ├─► FooterZone: Clear messages
    │                                       └─► Keypad: Update labels
    │
    └─► Text Input
            │
            └─► handleTextChange(value)
                    │
                    └─► setState({ textValue: value })
                            │
                            └─► Triggers re-render
                                    │
                                    ├─► HeaderZone: No change
                                    ├─► MainZone: Update preview
                                    ├─► FooterZone: Update char count
                                    └─► Keypad: Update confirm state
```

---

## Performance Optimization

```
RENDER OPTIMIZATION STRATEGY
════════════════════════════

Component Memoization:
├── HeaderZone: React.memo
│   └── Only re-renders when progress/step changes
│
├── MainZone: React.memo
│   └── Only re-renders when contentType changes
│
├── FooterZone: React.memo
│   └── Only re-renders when messages change
│
└── Buttons: React.memo (existing)
    └── Only re-renders when selections change

State Updates:
├── Batch related updates
├── Use functional setState for derived values
└── Avoid unnecessary state in render

Animation Performance:
├── Use CSS transforms (GPU-accelerated)
├── Avoid layout-triggering properties
├── Respect useFpsBudget flag
└── Use will-change for animated elements

Bundle Optimization:
├── Lazy load ReportView component
├── Code split by content type
└── Tree-shake unused utilities
```

---

This visual flow diagram provides a comprehensive view of how the zoned architecture operates, from user interactions through state changes to visual updates.
