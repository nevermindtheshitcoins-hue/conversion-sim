# Orbital System - Visual Progress Indicator

## Overview

The Orbital System combines the HeaderZone progress lights with an animated orbital visualization around the CRTShell keypad. Each completed step releases a glowing orb that smoothly animates from the header into a continuous orbit around the keypad perimeter.

## Architecture

### Components

#### `OrbitalSystem.tsx`
- **Purpose**: Manages the collection of orbital orbs based on completed steps
- **Props**:
  - `completedSteps` (number): How many steps have been completed
  - `totalSteps` (number): Total number of steps in the assessment
  - `disableAnimations` (boolean, optional): Disable animations for accessibility

- **Behavior**:
  - Creates one orb for each completed step
  - Staggered spawn times (0.3s delay between each orb)
  - Respects `prefers-reduced-motion` media query

#### `OrbitalOrb` (Internal Component)
- Individual orb instance
- Handles spawn and orbital animations
- Each orb has unique spawn delay based on index

### Animation Pipeline

```
Spawn Phase (0.8s)
├─ Orb appears at header position (opacity: 0 → 1)
├─ Scales from 0.3 → 1.0
└─ Translates from top (-200px) to center

Orbit Phase (12s, infinite)
├─ Smooth circular rotation around keypad
├─ Maintains constant distance from center
└─ Continuous loop with no interruption
```

## CSS Animations

### `@keyframes orbital-spawn`
- **Duration**: 0.8s ease-out
- **Effect**: Orb materializes and moves into position
- **Transforms**: 
  - Opacity: 0 → 1
  - Scale: 0.3 → 1
  - Position: -200px offset → centered

### `@keyframes orbital-perimeter`
- **Duration**: 12s linear infinite
- **Effect**: Smooth circular orbit around keypad
- **Technique**: 3D rotation with translateY for circular path
- **Formula**: `rotate(360deg) translateY(calc(var(--orbital-radius) * -1)) rotate(-360deg)`

### CSS Variables
- `--orbital-radius`: 220px (distance from center to orbit path)
- `--orbital-center-x`: 50% (horizontal center of keypad)
- `--orbital-center-y`: 50% (vertical center of keypad)

## Integration Points

### Data Flow
```
main-app.tsx (currentStep, totalSteps)
    ↓
AppContainer (passes through)
    ↓
CRTShell (receives completedSteps, totalSteps)
    ↓
OrbitalSystem (manages orb lifecycle)
    ↓
OrbitalOrb[] (individual animated orbs)
```

### Component Hierarchy
```
CRTShell
├─ OrbitalSystem (positioned absolutely over keypad)
│  └─ OrbitalOrb[] (each with unique animation delay)
└─ keypadZone (ControlPanel + buttons)
```

## Styling Details

### Orb Appearance
- **Size**: 8px × 8px (h-2 w-2)
- **Color**: Emerald-400 with 90% opacity
- **Glow**: `shadow-[0_0_12px_rgba(16,185,129,0.7)]`
- **Shape**: Perfectly circular (rounded-full)

### Container Positioning
- **Position**: Absolute, full width/height of keypad
- **Z-index**: 10 (above keypad content)
- **Pointer Events**: None (doesn't interfere with interactions)

## Accessibility

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  .orbital-orb {
    animation: none !important;
  }
}
```

### Semantic HTML
- All orbs have `aria-hidden="true"` (decorative)
- No interactive elements
- Doesn't affect screen reader experience

## Performance Considerations

### Optimization Techniques
1. **CSS Animations**: GPU-accelerated transforms (no JavaScript)
2. **Will-change**: Implicit on animated elements
3. **Staggered Spawns**: Prevents animation jank from simultaneous starts
4. **Conditional Rendering**: Only renders when `!disableMotion`

### Browser Support
- Modern browsers with CSS 3D transforms
- Fallback: Animations simply don't run on older browsers
- No JavaScript required for animation execution

## Customization

### Adjusting Orbital Radius
Edit `crt-styles.css`:
```css
.orbital-orb {
  --orbital-radius: 220px; /* Increase/decrease for larger/smaller orbit */
}
```

### Changing Animation Speed
Edit `OrbitalSystem.tsx`:
```typescript
animation: `orbital-spawn 0.8s ease-out forwards, orbital-perimeter 12s linear infinite`
//                                                                    ↑ Change this value
```

### Modifying Spawn Delay
Edit `OrbitalSystem.tsx`:
```typescript
const spawnDelay = index * 0.3; // Increase for longer delays between orbs
```

### Color Customization
Edit `OrbitalSystem.tsx`:
```typescript
className="orbital-orb absolute h-2 w-2 rounded-full bg-emerald-400/90 shadow-[0_0_12px_rgba(16,185,129,0.7)]"
//                                                          ↑ Change color class
```

## Testing

### Manual Testing Checklist
- [ ] Navigate through assessment steps
- [ ] Verify orbs spawn one at a time
- [ ] Confirm smooth orbital motion around keypad
- [ ] Test with `prefers-reduced-motion: reduce` enabled
- [ ] Verify no performance degradation with multiple orbs
- [ ] Test on mobile/tablet viewports
- [ ] Verify animations disable when `disableMotion=true`

### Browser Testing
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 12+)
- Mobile browsers: Full support

## Files Modified

1. **`src/components/OrbitalSystem.tsx`** (NEW)
   - Main component managing orbital orbs
   
2. **`src/app/crt-styles.css`**
   - Added `@keyframes orbital-spawn`
   - Added `@keyframes orbital-perimeter`
   - Added `.orbital-system` and `.orbital-orb` styles

3. **`src/components/CRTShell.tsx`**
   - Added `completedSteps` and `totalSteps` props
   - Integrated OrbitalSystem component

4. **`src/components/AppContainer.tsx`**
   - Added `completedSteps` and `totalSteps` props
   - Pass through to CRTShell

5. **`src/app/main-app.tsx`**
   - Pass `currentStep` and `totalSteps` to AppContainer

## Future Enhancements

### Potential Improvements
1. **Configurable Orbit Paths**: Elliptical or custom paths
2. **Particle Effects**: Trail or glow effects on orbs
3. **Sound Effects**: Optional audio feedback on spawn
4. **Orb Interactions**: Click to view step details
5. **Orbital Collisions**: Physics-based interactions between orbs
6. **Dynamic Sizing**: Orbs grow/shrink based on step importance

## Troubleshooting

### Orbs Not Appearing
- Check `disableMotion` prop (should be false)
- Verify `completedSteps > 0`
- Check browser console for errors
- Ensure CSS file is loaded

### Animations Stuttering
- Check for heavy JavaScript operations
- Verify GPU acceleration is enabled
- Test on different browser/device
- Check for CSS conflicts

### Orbs Disappearing After Spawn
- Verify animation-delay is correct
- Check z-index layering
- Ensure keypad container has `position: relative`

## References

- CSS Transforms: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
- CSS Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/animation
- Prefers Reduced Motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
