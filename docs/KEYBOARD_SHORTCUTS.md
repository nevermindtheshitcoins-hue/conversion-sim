# Keyboard Shortcuts Guide

## Overview
Conversion-Sim is fully keyboard accessible. All interactive elements can be accessed and operated without a mouse.

## Global Navigation

### Tab Navigation
- `Tab` - Move focus to next interactive element
- `Shift + Tab` - Move focus to previous interactive element

### Main Controls
- `Enter` or `Space` - Activate focused button
- `Escape` - (Future: Close modals/dialogs)

## Control Panel (Answer Options)

### Arrow Key Navigation
- `↓` or `→` - Move to next available option
- `↑` or `←` - Move to previous available option
- `Home` - Jump to first available option
- `End` - Jump to last available option

### Selection
- `Enter` - Select focused option
- `Space` - Select focused option

### Behavior Notes
- Navigation automatically skips disabled options
- Focus wraps at boundaries (first/last option)
- Visual focus indicator shows current position
- Hover preview updates with keyboard focus

## Footer Buttons

### Reset Button (Yellow)
- `Tab` to focus
- `Enter` or `Space` to reset assessment
- Returns to first screen and clears all data

### Back Button (Red)
- `Tab` to focus
- `Enter` or `Space` to go to previous step
- Disabled on first screen

### Confirm Button (Green)
- `Tab` to focus
- `Enter` or `Space` to confirm and continue
- Disabled until valid selection made
- On report screen: copies report to clipboard

## Screen Reader Support

### Announcements
- **Errors**: Announced immediately with `aria-live="assertive"`
- **Status updates**: Announced politely with `aria-live="polite"`
- **Progress**: Progress bar includes percentage and step count
- **Button states**: Selection state announced as "pressed" or "not pressed"

### Labels
- All buttons have descriptive labels
- Options include both number and text
- Status indicators include text alternatives
- Progress includes current step and total steps

## Accessibility Features

### Visual Indicators
- **Focus Ring**: Yellow ring around focused element
- **Selection State**: Yellow background for selected options
- **Disabled State**: Grayed out with reduced opacity
- **Hover/Focus Preview**: Shows option text in footer

### Motion Preferences
- Respects `prefers-reduced-motion` system setting
- Automatically disables animations on mobile devices
- Maintains full functionality without animations

## Tips for Keyboard Users

### Efficient Navigation
1. Use `Tab` to move between major sections (control panel, footer buttons)
2. Use arrow keys within the control panel for quick option selection
3. Use `Home`/`End` to quickly jump to first/last options
4. Press `Enter` immediately after selecting to confirm and continue

### Best Practices
- Wait for options to load before navigating
- Check footer for error messages if confirm is disabled
- Use screen reader to hear full option text if truncated
- Reset button is always accessible for starting over

## Browser Compatibility

### Tested Browsers
- ✅ Chrome/Edge (latest) - Full support
- ✅ Firefox (latest) - Full support
- ✅ Safari (latest) - Full support
- ✅ Mobile browsers - Touch and keyboard support

### Known Issues
- None currently reported

## Feedback

If you encounter any keyboard accessibility issues, please report them with:
- Browser and version
- Operating system
- Screen reader (if applicable)
- Steps to reproduce
- Expected vs. actual behavior

## Future Enhancements

### Planned Features
- [ ] `?` key to show keyboard shortcuts overlay
- [ ] `Ctrl/Cmd + K` for quick navigation
- [ ] `Ctrl/Cmd + R` for reset (with confirmation)
- [ ] Skip links for screen readers
- [ ] Keyboard shortcut customization

### Under Consideration
- Number keys (1-7) for direct option selection
- `Ctrl/Cmd + C` to copy report
- `Ctrl/Cmd + P` to print report
- Vim-style navigation (j/k for up/down)

---

*Last updated: 2025-01-10*
*Version: 1.0*
