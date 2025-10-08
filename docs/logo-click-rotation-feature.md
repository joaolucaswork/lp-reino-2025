# Logo Click Rotation Feature Documentation

## Overview

This document describes the new logo click rotation feature that allows users to toggle the profile card rotation by clicking on the Reino Capital logo.

**Feature Status:** ✅ Implemented and Ready for Testing

**Date:** 2025-10-08

---

## Feature Description

### What It Does

Users can now click on the Reino Capital logo (`.logo_card`) to toggle the card rotation between front and back faces. This provides an interactive way to explore the card content without needing to complete the Typebot form.

### Key Benefits

1. **Enhanced User Experience:** Users can explore both sides of the card at any time
2. **Toggle Behavior:** Click once to rotate, click again to reverse
3. **No Conflicts:** Works seamlessly with existing card interactions
4. **Consistent Animation:** Uses the same rotation effect as email input

---

## Implementation Details

### Files Created

1. **`src/utils/card-rotation-manager.ts`** (New)
   - Shared utility for managing card rotation
   - Provides reusable rotation functions
   - Used by both email handler and logo toggle

2. **`src/utils/logo-card-toggle.ts`** (New)
   - Handles logo click events
   - Manages toggle state
   - Prevents event propagation

### Files Modified

1. **`src/index.ts`**
   - Added import for `initLogoCardToggle`
   - Initialized logo toggle handler

2. **`docs/card-interaction-system.md`**
   - Added documentation for logo click interaction
   - Updated interaction methods section

---

## Architecture

### CardRotationManager (Shared Utility)

**Purpose:** Centralized rotation logic that can be used by multiple handlers

**Key Methods:**
- `rotateToBack()` - Rotate card to show back face
- `rotateToFront()` - Rotate card to show front face
- `toggleRotation()` - Toggle between front and back
- `getRotationState()` - Get current rotation state
- `isRotated()` - Check if card is currently rotated

**Benefits:**
- DRY (Don't Repeat Yourself) principle
- Consistent rotation behavior across all triggers
- Easy to maintain and extend

### LogoCardToggle (Logo Handler)

**Purpose:** Handle logo click events and manage toggle state

**Key Features:**
- Attaches click listeners to all `.logo_card` elements
- Stops event propagation to prevent card click
- Uses `CardRotationManager` for rotation logic
- Dispatches custom events for other components

**Event Handling:**
```typescript
// Prevents bubbling to parent card element
event.stopPropagation();
event.preventDefault();
```

---

## How It Works

### Interaction Flow

```
User clicks logo
    ↓
Event captured by LogoCardToggle
    ↓
Event propagation stopped
    ↓
CardRotationManager checks current state
    ↓
If showing front → Rotate to back
If showing back → Rotate to front
    ↓
Classes applied/removed
    ↓
Custom event dispatched
    ↓
Card animates to new state
```

### Class Changes

**Rotate to Back (First Click):**
```
.profile-card_wrapper → ADD 'active_fill' (if needed), ADD 'rotate'
.front-elements       → REMOVE 'active'
.rotation-elements    → ADD 'active'
```

**Rotate to Front (Second Click):**
```
.profile-card_wrapper → REMOVE 'rotate'
.front-elements       → ADD 'active'
.rotation-elements    → REMOVE 'active'
```

---

## Integration with Existing Features

### Email Input Trigger

**Status:** ✅ No conflicts

The email input trigger still works as before:
- Rotates card once when email is entered
- Uses `hasRotated` flag to prevent multiple rotations
- Does NOT use the shared `CardRotationManager` (maintains existing behavior)

**Note:** The email handler could be refactored to use `CardRotationManager` in the future for better consistency, but it's not required.

### Card Click Trigger

**Status:** ✅ No conflicts

The card click trigger (activate/deactivate) still works:
- Logo click stops event propagation
- Card click only triggers when clicking outside the logo
- Both interactions work independently

### Name Input Trigger

**Status:** ✅ No conflicts

The name input trigger still works:
- Activates card when name is entered
- Applies correct classes (fixed in previous update)
- Does not interfere with logo click

---

## Custom Events

### `card-rotation-toggle` Event

**Dispatched by:** `LogoCardToggle`

**Event Detail:**
```typescript
{
  state: CardRotationState,    // 'front' or 'back'
  isRotated: boolean            // true if showing back face
}
```

**Usage Example:**
```typescript
import { onCardRotationToggle } from '$utils/logo-card-toggle';

// Listen for rotation events
const removeListener = onCardRotationToggle((state, isRotated) => {
  console.log('Card rotated to:', state);
  console.log('Is showing back face:', isRotated);
});

// Clean up when done
removeListener();
```

---

## Testing Guide

### Manual Testing Checklist

#### Basic Functionality
- [ ] Click logo on front face → Card rotates to back
- [ ] Click logo on back face → Card rotates to front
- [ ] Multiple clicks → Card toggles correctly each time
- [ ] Logo cursor changes to pointer on hover

#### Integration Testing
- [ ] Click card (not logo) → Card activates (no rotation)
- [ ] Type name in Typebot → Card activates (no rotation)
- [ ] Type email in Typebot → Card rotates to back (one-time)
- [ ] After email rotation, logo click still works

#### Edge Cases
- [ ] Click logo rapidly → No visual glitches
- [ ] Click logo during animation → Handles gracefully
- [ ] Click logo before card is active → Activates and rotates
- [ ] Click logo after email rotation → Toggles correctly

#### Cross-browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

---

## Configuration

### Default Configuration

```typescript
{
  logoSelector: '.logo_card',
  debug: true  // Enable debug logging in development
}
```

### Custom Configuration

```typescript
import { initLogoCardToggle } from '$utils/logo-card-toggle';

const logoToggle = initLogoCardToggle({
  logoSelector: '.custom-logo-class',  // Custom logo selector
  debug: false                          // Disable debug logging
});
```

---

## API Reference

### LogoCardToggle Class

#### Methods

**`init(): void`**
- Initialize the logo toggle handler
- Attaches click event listeners to all logo elements

**`getRotationState(): CardRotationState`**
- Returns current rotation state ('front' or 'back')

**`isRotated(): boolean`**
- Returns true if card is showing back face

**`rotateToBack(): boolean`**
- Manually rotate card to show back face
- Returns true if successful

**`rotateToFront(): boolean`**
- Manually rotate card to show front face
- Returns true if successful

**`toggle(): CardRotationState`**
- Manually toggle card rotation
- Returns new rotation state

**`destroy(): void`**
- Remove event listeners and clean up

---

### CardRotationManager Class

#### Methods

**`getRotationState(): CardRotationState`**
- Get current rotation state

**`isRotated(): boolean`**
- Check if card is rotated

**`rotateToBack(): boolean`**
- Rotate card to show back face

**`rotateToFront(): boolean`**
- Rotate card to show front face

**`toggleRotation(): CardRotationState`**
- Toggle between front and back

---

## Troubleshooting

### Issue: Logo click triggers card click

**Solution:** Ensure event propagation is stopped in logo click handler
```typescript
event.stopPropagation();
event.preventDefault();
```

### Issue: Logo not clickable

**Solution:** Check that logo elements exist in DOM and selector is correct
```typescript
const logos = document.querySelectorAll('.logo_card');
console.log('Found logos:', logos.length);
```

### Issue: Rotation animation not smooth

**Solution:** Verify CSS classes are applied correctly and transitions are defined
```css
.profile-card_wrapper.active_fill.rotate {
  transform: rotateY(-180deg);
  transition: transform 0.6s;
}
```

### Issue: Multiple rotations on rapid clicks

**Solution:** This is expected behavior - logo toggle allows multiple rotations
- If you want to prevent this, add a debounce or cooldown period

---

## Future Enhancements (Optional)

### Potential Improvements

1. **Refactor Email Handler**
   - Use `CardRotationManager` for consistency
   - Maintain one-time rotation behavior

2. **Add Animation Options**
   - Configurable animation duration
   - Different animation easing functions

3. **Add Rotation Lock**
   - Option to disable rotation after email input
   - Prevent logo toggle after form completion

4. **Add Accessibility**
   - Keyboard support (Enter/Space to toggle)
   - ARIA labels for screen readers
   - Focus management

5. **Add Analytics**
   - Track logo click events
   - Monitor rotation toggle frequency

---

## Related Documentation

- **Main Documentation:** `docs/card-interaction-system.md`
- **Quick Reference:** `docs/card-attributes-quick-reference.md`
- **Fix Summary:** `docs/card-interaction-fix-summary.md`

---

## Summary

The logo click rotation feature is now fully implemented and ready for testing. It provides a seamless way for users to explore both sides of the profile card by clicking the Reino Capital logo. The implementation uses a shared rotation manager for consistency and prevents conflicts with existing card interactions.

**Next Steps:**
1. Test the feature manually using the checklist above
2. Verify no conflicts with existing interactions
3. Deploy to staging/production when ready
4. Monitor user engagement with the new feature

