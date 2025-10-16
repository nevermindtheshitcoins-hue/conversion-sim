# Marble Run System - Meditative Progress Interaction

## Overview

The Marble Run system creates a meditative, game-like interaction where a glowing marble represents the user's progress through the assessment. The marble:

1. **Rests at the keypad** (top-left) in an idle state with a subtle glow
2. **Energizes on selection** with a gentle pulsing animation (meditation app vibes)
3. **Rolls smoothly to the progress bar** when the answer is confirmed
4. **Returns to the keypad** when navigating back to a previous step

This creates a satisfying, tactile sense of progression without being flashy or distracting.

## Component Architecture

### `MarbleRun.tsx`

**Purpose**: Main component managing marble lifecycle and state transitions

**Props**:
- `currentStep` (number): Current step in the assessment (used for reset on navigation)
- `hasSelection` (boolean): Whether user has selected an answer
- `isConfirming` (boolean): Whether answer is being confirmed (typically `state.isLoading`)
- `disableAnimations` (boolean, optional): Disable animations for accessibility

**State Management**:
```typescript
type MarbleState = 'idle' | 'active' | 'rolling' | 'rolling-back' | 'docked';
```

**State Transitions**:
```
idle ←→ active (on selection/deselection)
  ↓
rolling (on confirmation)
  ↓
docked (after roll completes)
  ↓
idle (on next step)

docked → rolling-back (on back navigation)
  ↓
idle
```

### Internal `Marble` Component

Renders the actual marble element with appropriate animation based on state.

## Animation States

### 1. **Idle State**
- **Position**: Top-left of keypad (12px, 12px)
- **Opacity**: 0.7
- **Glow**: Subtle drop-shadow (8px, 0.4 opacity)
- **Behavior**: Static, waiting for interaction
- **Vibes**: Calm, meditative

### 2. **Active State** (on selection)
- **Animation**: `marble-pulse` (1.5s infinite)
- **Effect**: Gentle pulsing glow and scale
- **Opacity**: 0.8 → 1.0 → 0.8
- **Scale**: 1.0 → 1.15 → 1.0
- **Glow**: Intensifies during pulse
- **Vibes**: Energized, ready to confirm

### 3. **Rolling State** (on confirmation)
- **Animation**: `marble-roll` (1.2s cubic-bezier)
- **Path**: Top-left → arc upward → bottom-center (progress bar)
- **Effect**: Smooth rolling motion with arc
- **Glow**: Intensifies mid-roll, dims at destination
- **Scale**: 1.0 → 1.1 (mid-arc) → 0.9 (docked)
- **Vibes**: Satisfying, purposeful

### 4. **Rolling-Back State** (on back navigation)
- **Animation**: `marble-rollback` (1.2s cubic-bezier)
- **Path**: Bottom-center → arc upward → top-left
- **Effect**: Reverse of rolling animation
- **Vibes**: Smooth undo, no penalty

### 5. **Docked State** (after roll completes)
- **Position**: Bottom-center (progress bar area)
- **Opacity**: 0.6
- **Glow**: Reduced, settled
- **Behavior**: Waits for next step
- **Vibes**: At rest, ready for next interaction

## CSS Animations

### `@keyframes marble-pulse`
```css
0%, 100% {
  opacity: 0.8;
  filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.6)) drop-shadow(0 0 24px rgba(16, 185, 129, 0.3));
  transform: scale(1);
}
50% {
  opacity: 1;
  filter: drop-shadow(0 0 16px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 32px rgba(16, 185, 129, 0.4));
  transform: scale(1.15);
}
```

### `@keyframes marble-roll`
- **0%**: Top-left (12px, 12px), full opacity, normal scale
- **50%**: Arc upward (translateY -40px), scale 1.1, peak glow
- **100%**: Bottom-center (calc(100% - 20px), calc(50% - 6px)), 0.6 opacity, scale 0.9

### `@keyframes marble-rolling-back`
- Reverse of marble-roll
- Same timing and easing

## Styling Details

### Marble Appearance
- **Size**: 12px × 12px (h-3 w-3)
- **Color**: Emerald-400 with 95% opacity
- **Base Glow**: `shadow-[0_0_16px_rgba(16,185,129,0.8),inset_-1px_-1px_3px_rgba(0,0,0,0.4)]`
- **Shape**: Perfect sphere (rounded-full)
- **3D Effect**: Inset shadow for depth

### Container
- **Position**: Absolute, full width/height of keypad
- **Z-index**: 10 (above keypad content)
- **Pointer Events**: None (doesn't interfere with buttons)

## State Detection

The marble state is determined by:

```typescript
// In main-app.tsx
const hasSelection = state.tempSelection !== null || 
                     state.multiSelections.length > 0 || 
                     state.textValue.trim().length > 0;
const isConfirming = state.isLoading;
```

**hasSelection**: True when user has selected/entered an answer
**isConfirming**: True while the answer is being processed (API call in flight)

## Accessibility

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  .marble,
  .marble-active,
  .marble-rolling,
  .marble-rolling-back {
    animation: none !important;
  }
}
```

### Semantic HTML
- Marble has `aria-hidden="true"` (purely decorative)
- No interactive elements
- Doesn't affect screen reader experience
- Disables automatically when `disableMotion=true`

## Performance

### Optimization Techniques
1. **GPU-Accelerated**: CSS transforms and filters (no JavaScript animation)
2. **Conditional Rendering**: Only renders when `!disableAnimations`
3. **Efficient State**: Uses React state for logic, CSS for animation
4. **No Layout Thrashing**: Absolute positioning, no DOM reflows

### Browser Support
- Modern browsers with CSS 3D transforms
- Fallback: Animations simply don't run on older browsers
- No JavaScript required for animation execution

## Integration Points

### Data Flow
```
main-app.tsx (hasSelection, isConfirming, currentStep)
    ↓
AppContainer (passes through)
    ↓
CRTShell (receives props)
    ↓
MarbleRun (manages marble lifecycle)
    ↓
Marble (renders animated element)
```

### Component Hierarchy
```
CRTShell (keypad aside)
├─ MarbleRun (positioned absolutely over keypad)
│  └─ Marble (individual animated marble)
└─ keypadZone (ControlPanel + buttons)
```

## Customization

### Adjusting Marble Position (Idle)
Edit `crt-styles.css`:
```css
.marble {
  top: 12px;    /* Adjust vertical position */
  left: 12px;   /* Adjust horizontal position */
}
```

### Changing Animation Speed
Edit `MarbleRun.tsx` and `crt-styles.css`:
```css
/* Pulse speed */
.marble-active {
  animation: marble-pulse 1.5s ease-in-out infinite;
  /*                      ↑ Change this */
}

/* Roll speed */
.marble-rolling {
  animation: marble-roll 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  /*                      ↑ Change this */
}
```

### Modifying Marble Size
Edit `MarbleRun.tsx`:
```typescript
className="marble absolute h-3 w-3 rounded-full ..."
//                            ↑ Change h-3 w-3 to h-4 w-4, etc.
```

### Color Customization
Edit `MarbleRun.tsx`:
```typescript
className="marble absolute h-3 w-3 rounded-full bg-emerald-400/95 ..."
//                                                  ↑ Change color class
```

### Glow Intensity
Edit `crt-styles.css`:
```css
.marble-active {
  filter: drop-shadow(0 0 16px rgba(16, 185, 129, 0.8)) ...;
  /*                        ↑ Increase for brighter glow */
}
```

## Testing

### Manual Testing Checklist
- [ ] Marble appears at top-left of keypad
- [ ] Marble pulses when answer is selected
- [ ] Marble stops pulsing when selection is cleared
- [ ] Marble rolls smoothly to progress bar on confirmation
- [ ] Marble appears at progress bar after roll completes
- [ ] Marble returns to keypad on back navigation
- [ ] Marble resets to idle on next step
- [ ] Test with `prefers-reduced-motion: reduce` enabled
- [ ] Verify no performance degradation
- [ ] Test on mobile/tablet viewports

### Browser Testing
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 12+)
- Mobile browsers: Full support

## Files Modified

1. **`src/components/MarbleRun.tsx`** (NEW)
   - Main component managing marble lifecycle
   - State transitions and animation triggers

2. **`src/app/crt-styles.css`**
   - Replaced orbital animations with marble animations
   - Added `@keyframes marble-pulse`, `marble-roll`, `marble-rollback`
   - Added `.marble-*` state classes

3. **`src/components/CRTShell.tsx`**
   - Replaced OrbitalSystem with MarbleRun
   - Updated props to match marble requirements

4. **`src/components/AppContainer.tsx`**
   - Updated props to pass marble state

5. **`src/app/main-app.tsx`**
   - Added `hasSelection` and `isConfirming` calculation
   - Pass marble state to AppContainer

## Future Enhancements

### Potential Improvements
1. **Sound Effects**: Optional audio feedback on roll/dock
2. **Trail Effects**: Particle trail as marble rolls
3. **Bounce Physics**: More realistic rolling physics
4. **Marble Customization**: User-selectable marble colors/styles
5. **Progress Visualization**: Marble size grows with each step
6. **Marble Interactions**: Click marble to reveal step details
7. **Multi-Marble**: Show all completed steps as marbles in progress bar

## Troubleshooting

### Marble Not Appearing
- Check `disableMotion` prop (should be false)
- Check browser console for errors
- Ensure CSS file is loaded
- Verify keypad container has `position: relative`

### Animations Not Smooth
- Check for heavy JavaScript operations
- Verify GPU acceleration is enabled
- Test on different browser/device
- Check for CSS conflicts

### Marble Stuck in Wrong Position
- Verify `currentStep` prop is updating correctly
- Check that state transitions are firing
- Ensure `isConfirming` is set correctly during API calls

### Marble Not Pulsing
- Verify `hasSelection` is true when answer is selected
- Check that selection state is being tracked correctly
- Ensure CSS animation is not being overridden

## References

- CSS Transforms: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
- CSS Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/animation
- Cubic Bezier: https://cubic-bezier.com/
- Prefers Reduced Motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
