# Zoned Architecture - Quick Reference

## The Big Picture

**FROM**: Multi-screen navigation (8 separate screens)  
**TO**: Single-screen with 3 morphing zones

---

## Three-Zone Layout

```
┌─────────────────────────────────────┐
│  HEADER ZONE (Always Visible)      │  ← Progress, Step Counter
├─────────────────────────────────────┤
│                                     │
│  MAIN ZONE (Content Morphs)        │  ← Industry → Questions → Report
│                                     │
├─────────────────────────────────────┤
│  FOOTER ZONE (Context Messages)    │  ← Errors, Hover, Help
└─────────────────────────────────────┘
```

---

## Content Types (Main Zone)

| Content Type | When | Keypad Behavior |
|-------------|------|-----------------|
| **INDUSTRY_PICKER** | First screen | Buttons 1-7 = industries |
| **SINGLE_CHOICE** | Most questions | Buttons 1-N = options |
| **MULTI_CHOICE** | Multi-select questions | Buttons toggle selections |
| **TEXT_INPUT** | Custom scenario | Text field active |
| **AI_LOADING** | Generating questions | All disabled |
| **REPORT_VIEW** | Final screen | Copy/Reset/CTA |

---

## State Transformation

### Current (Screen-Based)
```typescript
currentScreen: 'PRELIM_1' | 'PRELIM_2' | 'Q4' | 'REPORT'
// Full component swap on navigation
```

### New (Content-Based)
```typescript
contentType: ContentType  // Derived from state flags
// Zones morph content, no navigation
```

---

## Key Constraints

1. **KEYPAD STATIC**: 7 buttons never appear/disappear
2. **NO NAVIGATION**: No screen changes, only content morphing
3. **ZONE ISOLATION**: Each zone updates independently
4. **ANALOG FEEL**: Physical machine metaphor preserved

---

## Implementation Rounds

### Round 2: Zone Components
- Create HeaderZone, MainZone, FooterZone
- Add ContentType enum
- Refactor state management

### Round 3: Content Components
- Build 6 content type components
- Ensure keypad stays static
- Map existing screens

### Round 4: Animations
- Morph transitions
- Progress animations
- Respect motion preferences

### Round 5: Integration
- Update useAssessmentFlow
- Testing & polish
- Performance optimization

---

## Critical Success Factors

✅ **Keypad never re-renders structure**  
✅ **All transitions <300ms**  
✅ **No lost user input**  
✅ **Progress always visible**  
✅ **Clear error feedback**

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| State complexity | State validation guards |
| Animation jank | Respect useFpsBudget flag |
| 7-button limit | Pagination + multi-select |
| AI loading blocks UI | Show progress, add timeout |

---

## File Structure

```
src/
├── components/
│   ├── zones/
│   │   ├── HeaderZone.tsx      ← NEW
│   │   ├── MainZone.tsx        ← NEW
│   │   └── FooterZone.tsx      ← NEW
│   ├── content/
│   │   ├── IndustryPicker.tsx  ← NEW
│   │   ├── SingleChoice.tsx    ← NEW
│   │   ├── MultiChoice.tsx     ← NEW
│   │   ├── TextInputPreview.tsx← NEW
│   │   ├── AILoading.tsx       ← NEW
│   │   └── ReportView.tsx      ← NEW
│   ├── Buttons.tsx             ← REFACTOR (stay static)
│   └── QuestionsAndAnswers.tsx ← SPLIT into content types
├── hooks/
│   └── useAssessmentFlow.ts    ← ADD content type logic
└── types/
    └── app-state.ts            ← ADD ContentType enum
```

---

## Quick Start (Round 2)

1. Create `src/components/zones/` directory
2. Build HeaderZone with progress bar
3. Build MainZone with content router
4. Build FooterZone with message display
5. Add ContentType enum to app-state.ts
6. Create getContentType() helper function

**Goal**: Zones render with existing content, no functionality change yet.
