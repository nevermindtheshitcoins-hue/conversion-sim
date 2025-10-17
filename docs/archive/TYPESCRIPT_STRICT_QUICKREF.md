# TypeScript Strict Mode - Quick Reference

## Enabled Strict Options

```json
{
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
}
```

## Common Patterns

### ✅ Array Access (Safe)
```typescript
// Pattern 1: Guard check
const item = array[index];
if (item !== undefined) {
  useItem(item);
}

// Pattern 2: Nullish coalescing
const item = array[index] ?? defaultValue;

// Pattern 3: Optional chaining
const value = array[index]?.property;
```

### ❌ Array Access (Unsafe)
```typescript
// DON'T: Direct use without check
const item = array[index];
useItem(item); // TypeScript error!
```

### ✅ Optional Properties (Safe)
```typescript
interface Props {
  optional?: string | undefined;
}

// Explicit undefined
const props: Props = {
  optional: value ?? undefined,
};

// Or omit entirely
const props: Props = {};
```

### ❌ Optional Properties (Unsafe)
```typescript
interface Props {
  optional?: string; // Missing | undefined
}

const props: Props = {
  optional: value, // Error if value is undefined
};
```

### ✅ Array Filtering (Safe)
```typescript
const defined = array
  .map(transform)
  .filter((item): item is string => item !== undefined);
```

### ✅ Early Return (Safe)
```typescript
const item = array[index];
if (!item) return;
// item is now defined
```

## Quick Fixes

### Error: "Object is possibly 'undefined'"
```typescript
// Before
const x = array[i];
doSomething(x);

// After
const x = array[i];
if (x !== undefined) {
  doSomething(x);
}
```

### Error: "Type 'undefined' is not assignable"
```typescript
// Before
interface Props {
  optional?: string;
}

// After
interface Props {
  optional?: string | undefined;
}
```

### Error: "Property assignment with undefined"
```typescript
// Before
const props = { optional: maybeUndefined };

// After
const props = { optional: maybeUndefined ?? undefined };
```

## Cheat Sheet

| Scenario | Solution |
|----------|----------|
| Array access | Add `if (item !== undefined)` guard |
| Optional prop type | Add `\| undefined` to type |
| Optional prop value | Use `value ?? undefined` |
| Multiple array items | Use `.filter((x): x is T => x !== undefined)` |
| Default value | Use `array[i] ?? default` |
| Early exit | Use `if (!item) return;` |

## Testing Edge Cases

```typescript
// Test empty arrays
expect(array[0]).toBeUndefined();

// Test out of bounds
expect(array[999]).toBeUndefined();

// Test optional properties
expect(obj.optional).toBeUndefined();
```

---

**Quick Tip**: When in doubt, add a guard check. TypeScript will tell you if it's unnecessary.
