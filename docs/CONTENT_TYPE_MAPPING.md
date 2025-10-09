# Screen to Content Type Mapping

## Current Screen Sequence

```
PRELIM_1 → PRELIM_2 → PRELIM_3 → Q4 → Q5 → Q6 → Q7 → REPORT
```

---

## Detailed Mapping

### PRELIM_1: Industry Selection

**Current Implementation**
- Screen: `PRELIM_1`
- Title: "Select Your Strategic Focus Area"
- Options: 7 industries (from INDUSTRIES constant)
- Type: Single select
- Handler: Sets `state.industry`

**New Content Type**: `INDUSTRY_PICKER`

**Zone Breakdown**
```
HEADER:
  Progress: 0%
  Step: "Step 1 of 8"
  Status: Active

MAIN:
  Type: INDUSTRY_PICKER
  Display: Grid of 7 industry cards
  Visual: Large icons + descriptions
  Interaction: Hover shows details in footer

FOOTER:
  Default: "Select your strategic focus area"
  Hover: Industry description preview
  Error: (none at this stage)

KEYPAD:
  Button 1: "Custom Strategic Initiative"
  Button 2: "Governance & Public Sector"
  Button 3: "Healthcare & Clinical Research"
  Button 4: "Supply Chain & Regulatory Compliance"
  Button 5: "Corporate Governance & Board Decisions"
  Button 6: "Education & Academic Institutions"
  Button 7: "Market Research & Stakeholder Polling"
  Text Input: Hidden
  Actions: BACK (disabled), CONFIRM (enabled when selected)
```

---

### PRELIM_2: Industry-Specific Question

**Current Implementation**
- Screen: `PRELIM_2`
- Title: Industry-dependent (from INDUSTRY_BASED_SCREENS)
- Options: 5 options OR text input (for Custom)
- Type: Single select OR text input
- Handler: Sets domain or `state.customScenario`

**New Content Type**: `SINGLE_CHOICE` or `TEXT_INPUT`

**Zone Breakdown (Single Choice)**
```
HEADER:
  Progress: 12.5%
  Step: "Step 2 of 8"
  Status: Active

MAIN:
  Type: SINGLE_CHOICE
  Display: Question + option cards
  Visual: Selected option highlighted
  Interaction: Hover shows full text

FOOTER:
  Default: "Select the option that best fits"
  Hover: Full option text
  Error: "Please select an option"

KEYPAD:
  Button 1-5: Industry-specific options
  Button 6-7: Disabled (grayed out)
  Text Input: Hidden
  Actions: BACK (enabled), CONFIRM (enabled when selected)
```

**Zone Breakdown (Text Input - Custom Industry)**
```
HEADER:
  Progress: 12.5%
  Step: "Step 2 of 8"
  Status: Active

MAIN:
  Type: TEXT_INPUT
  Display: Question + live text preview
  Visual: Typing animation, character count
  Interaction: Real-time preview updates

FOOTER:
  Default: "Minimum 5 characters required"
  Active: "45/500 characters"
  Error: "Please enter at least 5 characters"

KEYPAD:
  Button 1-7: Disabled (grayed out)
  Text Input: Active, focused
  Actions: BACK (enabled), CONFIRM (enabled when valid)
```

---

### PRELIM_3: Strategic Barrier

**Current Implementation**
- Screen: `PRELIM_3`
- Title: Industry-dependent or generic
- Options: 5-6 options
- Type: Single select
- Handler: Records strategic barrier

**New Content Type**: `SINGLE_CHOICE`

**Zone Breakdown**
```
HEADER:
  Progress: 25%
  Step: "Step 3 of 8"
  Status: Active

MAIN:
  Type: SINGLE_CHOICE
  Display: Question + option cards
  Visual: Selected option highlighted
  Interaction: Hover shows implications

FOOTER:
  Default: "Identify your primary challenge"
  Hover: Challenge description + impact
  Error: "Please select an option"

KEYPAD:
  Button 1-6: Strategic barriers
  Button 7: Disabled (if only 6 options)
  Text Input: Hidden
  Actions: BACK (enabled), CONFIRM (enabled when selected)
```

---

### Q4-Q7: AI-Generated Questions

**Current Implementation**
- Screen: `Q4`, `Q5`, `Q6`, `Q7`
- Title: AI-generated from preliminary responses
- Options: AI-generated (typically 4-5 options)
- Type: Single select (could be multi-select)
- Handler: Records responses for report generation
- Special: Shows loading state while generating

**New Content Type**: `AI_LOADING` → `SINGLE_CHOICE` or `MULTI_CHOICE`

**Zone Breakdown (Loading State)**
```
HEADER:
  Progress: 37.5% (Q4), 50% (Q5), 62.5% (Q6), 75% (Q7)
  Step: "Step 4-7 of 8"
  Status: Loading

MAIN:
  Type: AI_LOADING
  Display: Animated loading indicator
  Visual: Pulsing AI icon, progress dots
  Message: "Generating personalized questions..."
  Context: Shows industry + previous responses

FOOTER:
  Default: "This may take 10-15 seconds"
  Progress: "Analyzing your responses..."
  Error: "Generation failed, using fallback questions"

KEYPAD:
  Button 1-7: Disabled (grayed out)
  Text Input: Disabled
  Actions: All disabled during loading
```

**Zone Breakdown (Question Display)**
```
HEADER:
  Progress: 37.5% (Q4), 50% (Q5), 62.5% (Q6), 75% (Q7)
  Step: "Step 4-7 of 8"
  Status: Active

MAIN:
  Type: SINGLE_CHOICE or MULTI_CHOICE
  Display: AI-generated question + options
  Visual: Selected option(s) highlighted
  Badge: "AI-Generated" indicator

FOOTER:
  Default: "Select the best answer"
  Hover: Full option text + reasoning
  Multi: "2 of 3 selected" (if multi-select)
  Error: "Please select at least one option"

KEYPAD:
  Button 1-N: AI-generated options
  Button N+1 to 7: Disabled (if fewer options)
  Text Input: Hidden
  Actions: BACK (enabled), CONFIRM (enabled when valid)
```

---

### REPORT: Final Assessment

**Current Implementation**
- Screen: `REPORT`
- Title: "Strategic Business Case & Value Proposition"
- Content: Full AI-generated report
- Type: Display only
- Actions: Copy, Reset, CTA
- Special: Scrollable content

**New Content Type**: `REPORT_VIEW`

**Zone Breakdown**
```
HEADER:
  Progress: 100%
  Step: "Complete"
  Status: Success (green indicator)

MAIN:
  Type: REPORT_VIEW
  Display: Scrollable report sections
  Visual: Executive summary, findings, recommendations
  Sections: 
    - Executive Summary
    - Strategic Assessment
    - DeVOTE Value Proposition
    - Implementation Roadmap
    - ROI Projection
  Interaction: Scroll, section navigation

FOOTER:
  Default: "Your personalized assessment is ready"
  Action: "Use buttons to copy or start over"
  Success: "Report copied to clipboard!"

KEYPAD:
  Button 1: "Copy Report"
  Button 2: "Download PDF" (future)
  Button 3: "Email Report" (future)
  Button 4: Disabled
  Button 5: Disabled
  Button 6: "Start Over"
  Button 7: "Book Consultation" (CTA)
  Text Input: Hidden
  Actions: BACK (disabled), CONFIRM (hidden)
```

---

## Content Type Decision Tree

```
START
  ↓
Is state.isReport? 
  YES → REPORT_VIEW
  NO ↓
Is state.isLoading?
  YES → AI_LOADING
  NO ↓
Is state.isTextInput?
  YES → TEXT_INPUT
  NO ↓
Is state.isMultiSelect?
  YES → MULTI_CHOICE
  NO ↓
Is currentScreenIndex === 0?
  YES → INDUSTRY_PICKER
  NO ↓
DEFAULT → SINGLE_CHOICE
```

---

## State Flags by Content Type

| Content Type | isReport | isLoading | isTextInput | isMultiSelect | currentScreenIndex |
|-------------|----------|-----------|-------------|---------------|-------------------|
| INDUSTRY_PICKER | false | false | false | false | 0 |
| SINGLE_CHOICE | false | false | false | false | 1-7 |
| MULTI_CHOICE | false | false | false | true | 1-7 |
| TEXT_INPUT | false | false | true | false | 1 |
| AI_LOADING | false | true | false | false | 3-6 |
| REPORT_VIEW | true | false | false | false | 7 |

---

## Keypad Button Count by Screen

| Screen | Button Count | Notes |
|--------|-------------|-------|
| PRELIM_1 | 7 | All industries |
| PRELIM_2 (most) | 5 | Industry-specific |
| PRELIM_2 (custom) | 0 | Text input only |
| PRELIM_3 | 5-6 | Strategic barriers |
| Q4-Q7 | 4-5 | AI-generated |
| REPORT | 3 | Copy, Reset, CTA |

**Constraint Validation**: ✅ All screens fit within 7-button limit

---

## Animation Transitions

### Content Type Changes
```
INDUSTRY_PICKER → SINGLE_CHOICE
  Animation: Fade out grid, fade in question
  Duration: 300ms
  
SINGLE_CHOICE → AI_LOADING
  Animation: Fade to loading spinner
  Duration: 200ms
  
AI_LOADING → SINGLE_CHOICE
  Animation: Fade in question with slide up
  Duration: 400ms
  
SINGLE_CHOICE → REPORT_VIEW
  Animation: Expand and fade to full report
  Duration: 500ms
```

### Zone Updates
```
HEADER (Progress)
  Animation: Smooth width transition
  Duration: 600ms
  Easing: ease-in-out
  
FOOTER (Messages)
  Animation: Fade out old, fade in new
  Duration: 200ms
  Stagger: 100ms between
  
KEYPAD (Button States)
  Animation: Color transition
  Duration: 150ms
  Easing: ease-out
```

---

## Backward Compatibility

### Journey Tracker
- Continue using screen names for analytics
- Map content types back to screens for tracking
- Preserve existing event structure

### API Requests
- Keep `currentScreen` in journey context
- Add `contentType` as metadata
- Maintain signature validation

### Error Handling
- Map content type errors to screen context
- Preserve error message format
- Keep fallback mechanisms

---

## Testing Checklist

- [ ] All 8 screens map to correct content types
- [ ] Content type decision tree covers all states
- [ ] Keypad button count never exceeds 7
- [ ] Progress bar accurate for each step
- [ ] Footer messages appropriate for each type
- [ ] Animations smooth between all transitions
- [ ] Back button reconstructs previous content
- [ ] Error states display correctly
- [ ] Loading states don't block header/footer
- [ ] Report view fully scrollable
