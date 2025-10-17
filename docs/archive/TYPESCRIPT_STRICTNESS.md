# TypeScript Strictness Enhancement

## Overview
This document details the TypeScript strictness improvements implemented to catch edge cases early and improve type safety across the codebase.

## Strict Compiler Options Enabled

### 1. noUncheckedIndexedAccess
**Purpose**: Ensures array and object index accesses are properly guarded against undefined values.

**Configuration**:
```json
{
  "compilerOptions": {
    "noUncheckedIndexedAccess": true
  }
}
```

**Impact**: All array index accesses now return `T | undefined` instead of `T`, forcing explicit checks.

### 2. exactOptionalPropertyTypes
**Purpose**: Distinguishes between `property?: T` and `property: T | undefined`, preventing accidental undefined assignments.

**Configuration**:
```json
{
  "compilerOptions": {
    "exactOptionalPropertyTypes": true
  }
}
```

**Impact**: Optional properties must be explicitly set to `undefined` or omitted entirely.

## Code Changes Required

### Array Index Access Guards

#### Before (Unsafe)
```typescript
const selectedText = state.currentOptions[state.tempSelection - 1];
journeyTracker.addResponse(state.currentScreen, state.tempSelection, selectedText);
```

#### After (Safe)
```typescript
const selectedText = state.currentOptions[state.tempSelection - 1];
if (selectedText !== undefined) {
  journeyTracker.addResponse(state.currentScreen, state.tempSelection, selectedText);
}
```

### Multi-Selection Array Access

#### Before (Unsafe)
```typescript
const selectedTexts = state.multiSelections
  .map(val => state.currentOptions[val - 1])
  .join(', ');
```

#### After (Safe)
```typescript
const selectedTexts = state.multiSelections
  .map(val => state.currentOptions[val - 1])
  .filter((text): text is string => text !== undefined)
  .join(', ');
```

### SCREEN_SEQUENCE Array Access

#### Before (Unsafe)
```typescript
const nextScreen = SCREEN_SEQUENCE[nextIndex];
setState(prev => ({
  ...prev,
  currentScreen: nextScreen,
  // ...
}));
```

#### After (Safe)
```typescript
const nextScreen = SCREEN_SEQUENCE[nextIndex];
if (!nextScreen) return;

setState(prev => ({
  ...prev,
  currentScreen: nextScreen,
  // ...
}));
```

### Typed Array Byte Access

#### Before (Unsafe)
```typescript
const bytes = globalCrypto.getRandomValues(new Uint8Array(16));
bytes[6] = (bytes[6] & 0x0f) | 0x40;
bytes[8] = (bytes[8] & 0x3f) | 0x80;
```

#### After (Safe)
```typescript
const bytes = globalCrypto.getRandomValues(new Uint8Array(16));
const byte6 = bytes[6];
const byte8 = bytes[8];
if (byte6 !== undefined) bytes[6] = (byte6 & 0x0f) | 0x40;
if (byte8 !== undefined) bytes[8] = (byte8 & 0x3f) | 0x80;
```

### Optional Property Type Annotations

#### Before (Ambiguous)
```typescript
interface ScreenPresenterProps {
  subtitle?: string;
  hoveredOptionLabel?: string;
}
```

#### After (Explicit)
```typescript
interface ScreenPresenterProps {
  subtitle?: string | undefined;
  hoveredOptionLabel?: string | undefined;
}
```

### Optional Property Assignment

#### Before (Implicit)
```typescript
const presenterProps: ScreenPresenterProps = {
  subtitle,
  hoveredOptionLabel: hoveredText,
};
```

#### After (Explicit)
```typescript
const presenterProps: ScreenPresenterProps = {
  subtitle: subtitle ?? undefined,
  hoveredOptionLabel: hoveredText ?? undefined,
};
```

## Type Definition Updates

### AppState Interface
Changed `currentSubtitle` from optional to required with empty string default:

```typescript
// Before
interface AppState {
  currentSubtitle?: string;
}

// After
interface AppState {
  currentSubtitle: string;
}
```

**Rationale**: Simplifies type handling by always having a defined value.

### UserResponse Interface
Explicitly marked optional property with undefined union:

```typescript
// Before
interface UserResponse {
  textInput?: string;
}

// After
interface UserResponse {
  textInput?: string | undefined;
}
```

## Benefits

### 1. Runtime Safety
- Prevents "Cannot read property of undefined" errors
- Catches array out-of-bounds access at compile time
- Forces explicit handling of missing values

### 2. Code Clarity
- Makes optional vs. undefined distinction explicit
- Documents which properties can be undefined
- Improves code readability and intent

### 3. Early Error Detection
- Catches edge cases during development
- Reduces production bugs
- Improves developer confidence

### 4. Better IDE Support
- More accurate autocomplete
- Better error messages
- Improved refactoring safety

## Common Patterns

### Pattern 1: Array Access with Guard
```typescript
const item = array[index];
if (item !== undefined) {
  // Safe to use item
}
```

### Pattern 2: Array Access with Nullish Coalescing
```typescript
const item = array[index] ?? defaultValue;
```

### Pattern 3: Array Filter for Defined Values
```typescript
const definedItems = array
  .map(transform)
  .filter((item): item is NonNullable<typeof item> => item !== undefined);
```

### Pattern 4: Optional Property with Explicit Undefined
```typescript
const props = {
  optionalProp: value ?? undefined,
};
```

### Pattern 5: Early Return on Undefined
```typescript
const item = array[index];
if (!item) return;
// Continue with defined item
```

## Migration Checklist

When enabling these strict options in a new codebase:

- [ ] Enable `noUncheckedIndexedAccess` in tsconfig.json
- [ ] Enable `exactOptionalPropertyTypes` in tsconfig.json
- [ ] Run `npx tsc --noEmit` to find all errors
- [ ] Add guards for all array index accesses
- [ ] Update optional property type annotations
- [ ] Add explicit undefined assignments where needed
- [ ] Test all code paths with edge cases
- [ ] Run full build to verify no regressions

## Performance Impact

**Minimal to None**: These are compile-time checks only. No runtime overhead is added.

## Testing Recommendations

### Test Edge Cases
- Empty arrays
- Out-of-bounds indices
- Undefined optional properties
- Null vs undefined distinctions

### Example Test Cases
```typescript
// Test array bounds
expect(getItem([], 0)).toBeUndefined();
expect(getItem([1, 2, 3], 5)).toBeUndefined();

// Test optional properties
expect(processProps({ required: 'value' })).toBeDefined();
expect(processProps({ required: 'value', optional: undefined })).toBeDefined();
```

## Future Considerations

### Additional Strict Options to Consider
- `noImplicitReturns`: Ensure all code paths return a value
- `noFallthroughCasesInSwitch`: Prevent accidental fallthrough
- `noPropertyAccessFromIndexSignature`: Require bracket notation for index signatures

### Not Recommended (Yet)
- `noImplicitAny`: Already covered by `strict: true`
- `strictNullChecks`: Already covered by `strict: true`
- `strictFunctionTypes`: Already covered by `strict: true`

## Version History
- **v1.0** (2025-01-XX): Initial TypeScript strictness enhancement
  - Enabled `noUncheckedIndexedAccess`
  - Enabled `exactOptionalPropertyTypes`
  - Added guards for all array index accesses
  - Updated type definitions for optional properties
  - Zero runtime performance impact

---

*These strictness improvements follow TypeScript best practices and significantly reduce the risk of runtime errors caused by undefined values.*
