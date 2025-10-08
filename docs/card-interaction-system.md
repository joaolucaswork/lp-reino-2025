# Card Interaction System Documentation

## Overview

This document provides a comprehensive analysis of the profile card interaction system in the Reino Capital landing page. The system manages card states through two primary interaction methods: **clicking the card** and **typing the user's name in Typebot**.

---

## Table of Contents

1. [Card Attributes Mapping](#card-attributes-mapping)
2. [Card Toggle Behavior](#card-toggle-behavior)
3. [Active State Inconsistency Analysis](#active-state-inconsistency-analysis)
4. [Proposed Solution](#proposed-solution)

---

## 1. Card Attributes Mapping

### Custom Attributes Overview

The card system uses two types of custom attributes to organize and identify elements:

#### A. `card-info` Attribute

Used to identify specific data elements within the card that can be dynamically updated.

| Attribute Value | Element Class | Purpose | Location in HTML |
|----------------|---------------|---------|------------------|
| `bg-text-color` | `.profile-card_wrapper` | Main wrapper - controls background and text color | Line 210 |
| `name` | `.name-people` | User's name display | Lines 213, 298 |
| `title` | `.titulo-lead` | User's title/role | Line 214 |
| `elements` | `.info-data` | Container for data elements (RC, mini block, date) | Lines 250, 302 |
| `mini` | `.visual-block-card` | Mini visual block indicator | Line 252 |
| `date` | `.data-cadastro` | Registration/creation date | Line 253 |
| `random-code` | `.random-code` | User ID/random code display | Lines 256, 306 |
| `email` | `.email-lead` | User's email address | Line 299 |
| `telefone` | N/A | User's phone number | Line 303 |
| `ilustration` | `.ilustration-center` | Central illustration element | Lines 261, 311 |

#### B. `card-face` Attribute

Used to identify which side of the card is being displayed (front or back).

| Attribute Value | Element Class | Purpose | Location in HTML |
|----------------|---------------|---------|------------------|
| `front` | `.front-elements` | Front face of the card (initial view) | Line 211 |
| `back` | `.rotation-elements` | Back face of the card (after rotation) | Line 263 |

#### C. `is-main` Attribute

Used to identify the main card wrapper that handles click interactions.

| Attribute Value | Element | Purpose | Location in HTML |
|----------------|---------|---------|------------------|
| `true` | `.profile-card_wrapper` | Marks the main card for click handling | Line 210 |

---

## 2. Card Toggle Behavior

### A. Card Click Interaction (Method 1)

**Trigger:** User clicks on `.profile-card_wrapper` element

**Handler:** `src/utils/profile-card-toggle.ts` - `handleCardClick()`

**Classes Applied:**

1. **Profile Card Wrapper** (`.profile-card_wrapper`)
   - ✅ **ADD:** `active_fill`

2. **Visual Block Card** (`.visual-block-card`)
   - ✅ **ADD:** `active`

3. **Shadow Element** (`.shadow-yellow`)
   - ✅ **ADD:** `active`

**Visual Effects:**

- **Profile Card:**
  - Transform: `scale(1.1) rotate(-7deg) rotate(4deg)`
  - Cursor: `pointer`
  - Transition: `transform .5s cubic-bezier(.175, .885, .32, 1.275)`

- **Visual Block Card:**
  - Width expands from `49px` to `5rem`
  - Transition: `width .5s cubic-bezier(.175, .885, .32, 1.275)`

- **Shadow Element:**
  - Background color changes to `#ffc63852`
  - Height changes to `140px`

**Toggle Behavior:**

- Click once: Activates (adds classes)
- Click again: Deactivates (removes classes)
- Uses `toggleState` counter (0 or 1) to track state

---

### B. Name Input Interaction (Method 2)

**Trigger:** User types their name in Typebot (variable: `nome`)

**Handler:** `src/utils/typebot-name-replacer.ts` - `activateProfileCard()`

**Classes Applied:**

1. **Profile Card Wrapper** (`.profile-card_wrapper`)
   - ✅ **ADD:** `active_fill`

2. **Shadow Element** (`.shadow-yellow`)
   - ✅ **ADD:** `active_fill` (⚠️ **INCORRECT** - should be `active`)

3. **Visual Block Card** (`.visual-block-card`)
   - ✅ **ADD:** `active_fill` (⚠️ **INCORRECT** - should be `active`)

**Visual Effects:**

- **Profile Card:** Same as click interaction
- **Visual Block Card:** ❌ **NO EFFECT** (wrong class applied)
- **Shadow Element:** ❌ **NO EFFECT** (wrong class applied)

**Additional Actions:**

- Replaces asterisks (`******`) with user's name in all `[card-info="name"]` elements
- Adds `name-updated` class to updated elements

---

### C. Email Input Interaction (Card Rotation)

**Trigger:** User enters their email in Typebot (variable: `email`)

**Handler:** `src/utils/typebot-email-handler.ts` - `triggerCardRotation()`

**Classes Applied:**

1. **Profile Card Wrapper** (`.profile-card_wrapper`)
   - ✅ **ADD:** `active_fill`
   - ✅ **ADD:** `rotate`

2. **Front Elements** (`.front-elements`)
   - ✅ **REMOVE:** `active`

3. **Rotation Elements** (`.rotation-elements`)
   - ✅ **ADD:** `active`

**Visual Effects:**

- **Profile Card with `rotate` class:**
  - Transform: `rotateX(0) rotateY(-180deg) rotateZ(0) scale(1.1) translate(0, -25px) rotate(0)`
  - Transform-style: `preserve-3d`
  - Transition: `cubic-bezier(.25, .46, .45, .94)`
  - **Result:** Card flips to show back face

- **Front Elements:**
  - Becomes hidden (z-index and display changes)

- **Rotation Elements with `active` class:**
  - Opacity: `100`
  - Pointer-events: `auto`
  - Transform: `rotateX(0) rotateY(-180deg) rotateZ(0)`
  - **Result:** Back face becomes visible

**Additional Actions:**

- Updates email display in `[card-info="email"]` elements
- Updates phone display in `[card-info="telefone"]` elements (if provided)
- Only rotates once (uses `hasRotated` flag)

---

### D. Logo Click Interaction (Card Rotation Toggle) - NEW ✨

**Trigger:** User clicks on the Reino Capital logo (`.logo_card`)

**Handler:** `src/utils/logo-card-toggle.ts` - `handleLogoClick()`

**Classes Applied (First Click - Rotate to Back):**

1. **Profile Card Wrapper** (`.profile-card_wrapper`)
   - ✅ **ADD:** `active_fill` (if not already present)
   - ✅ **ADD:** `rotate`

2. **Front Elements** (`.front-elements`)
   - ✅ **REMOVE:** `active`

3. **Rotation Elements** (`.rotation-elements`)
   - ✅ **ADD:** `active`

**Classes Applied (Second Click - Rotate to Front):**

1. **Profile Card Wrapper** (`.profile-card_wrapper`)
   - ✅ **REMOVE:** `rotate`

2. **Front Elements** (`.front-elements`)
   - ✅ **ADD:** `active`

3. **Rotation Elements** (`.rotation-elements`)
   - ✅ **REMOVE:** `active`

**Visual Effects:**

Same as email input interaction, but with **toggle behavior**:

- First click: Card flips to show back face
- Second click: Card flips back to show front face
- Can be toggled indefinitely

**Special Features:**

- **Event Propagation Prevention:** Stops click event from bubbling to parent card
- **Both Logos Clickable:** Works on both front face logo and back face logo
- **Custom Event Dispatch:** Emits `card-rotation-toggle` event for other components
- **Shared Rotation Logic:** Uses `CardRotationManager` for consistent behavior

**Additional Actions:**

- Dispatches custom `card-rotation-toggle` event with rotation state
- Adds cursor pointer to logo elements for better UX
- Prevents conflict with card click handler

---

## 3. Active State Inconsistency Analysis

### Problem Summary

When the user types their name in Typebot, the card should become active with the same visual state as clicking it, but **WITHOUT the rotation animation**. Currently, the visual states are inconsistent.

### Detailed Comparison

#### Method 1: Clicking the Card

**File:** `src/utils/profile-card-toggle.ts` (lines 48-69)

```typescript
// Classes applied:
profileCard.classList.add('active_fill');
visualBlockCard.classList.add('active');
shadowYellow.classList.add('active');
```

**Result:**

- ✅ Profile card scales and rotates
- ✅ Visual block expands width
- ✅ Shadow changes color and height

---

#### Method 2: Typing the Name

**File:** `src/utils/typebot-name-replacer.ts` (lines 315-336)

```typescript
// Classes applied:
profileCard.classList.add('active_fill');
shadowYellow.classList.add('active_fill');  // ❌ WRONG CLASS
visualBlockCard.classList.add('active_fill');  // ❌ WRONG CLASS
```

**Result:**

- ✅ Profile card scales and rotates
- ❌ Visual block does NOT expand (wrong class)
- ❌ Shadow does NOT change (wrong class)

---

### Root Cause

The `typebot-name-replacer.ts` utility is applying the **wrong class name** to the additional elements:

- **Current (Incorrect):** Applies `active_fill` to `.shadow-yellow` and `.visual-block-card`
- **Expected (Correct):** Should apply `active` to these elements

**Code Location:** `src/utils/typebot-name-replacer.ts`, lines 329-335

```typescript
// Current implementation (INCORRECT):
this.config.additionalActiveElements.forEach((selector) => {
  const element = profileCard.querySelector(selector);
  if (element) {
    element.classList.add(this.config.activeClass);  // activeClass = 'active_fill'
    this.log(`Additional element activated: ${selector}`);
  }
});
```

**Issue:** The `activeClass` configuration is set to `'active_fill'` (line 64), but it should be `'active'` for the additional elements.

---

### CSS Class Definitions

#### `.active_fill` Class

**Applied to:** `.profile-card_wrapper` only

**CSS Effects:**

```css
.profile-card_wrapper.active_fill {
  backdrop-filter: blur(2px);
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform .5s cubic-bezier(.175, .885, .32, 1.275);
  transform: scale(1.1) rotate(-7deg) rotate(4deg);
}
```

#### `.active` Class

**Applied to:** `.visual-block-card`, `.shadow-yellow`, `.front-elements`, `.rotation-elements`

**CSS Effects:**

```css
.visual-block-card.active {
  width: 5rem;  /* Expands from 49px */
}

.shadow-yellow.active {
  background-color: #ffc63852;
  height: 140px;
}

.front-elements.active {
  z-index: 10;
  display: flex;
}

.rotation-elements.active {
  opacity: 100;
  pointer-events: auto;
  transform-style: preserve-3d;
  transform: rotateX(0) rotateY(-180deg) rotateZ(0);
}
```

---

## 4. Proposed Solution

### Option A: Fix the Existing Implementation (Recommended)

**Goal:** Make the name input interaction apply the same classes as the click interaction.

**Changes Required:**

1. **Update `typebot-name-replacer.ts` configuration** (line 69)
   - Change `additionalActiveElements` to use `'active'` class instead of `activeClass`

2. **Modify `activateProfileCard()` method** (lines 315-336)
   - Apply `active_fill` to profile card
   - Apply `active` to additional elements (not `active_fill`)

**Implementation:**

```typescript
// In src/utils/typebot-name-replacer.ts

// Update the activateProfileCard method:
private activateProfileCard(): void {
  const profileCard = document.querySelector(this.config.profileCardSelector);

  if (!profileCard) {
    this.log('Profile card not found with selector:', this.config.profileCardSelector);
    return;
  }

  // Add active_fill class to the profile card
  profileCard.classList.add(this.config.activeClass);
  this.log(`Profile card activated with class: ${this.config.activeClass}`);

  // Activate additional elements with 'active' class (not 'active_fill')
  this.config.additionalActiveElements.forEach((selector) => {
    const element = profileCard.querySelector(selector);
    if (element) {
      element.classList.add('active');  // ✅ Use 'active' instead of activeClass
      this.log(`Additional element activated: ${selector}`);
    }
  });
}
```

**Benefits:**

- ✅ Minimal code changes
- ✅ Maintains existing architecture
- ✅ Synchronizes both interaction methods
- ✅ No breaking changes to other parts of the system

---

### Option B: Create a Unified Card State Manager (Advanced)

**Goal:** Create a single source of truth for card states that both interaction methods use.

**Architecture:**

```typescript
// New file: src/utils/card-state-manager.ts

export class CardStateManager {
  private isActive: boolean = false;
  private isRotated: boolean = false;

  /**
   * Activate the card (without rotation)
   * Used by: Click interaction, Name input
   */
  public activate(): void {
    this.isActive = true;
    this.applyActiveState();
  }

  /**
   * Deactivate the card
   * Used by: Click interaction (toggle)
   */
  public deactivate(): void {
    this.isActive = false;
    this.removeActiveState();
  }

  /**
   * Rotate the card (requires active state)
   * Used by: Email input
   */
  public rotate(): void {
    if (!this.isActive) {
      this.activate();
    }
    this.isRotated = true;
    this.applyRotationState();
  }

  /**
   * Apply active state classes to all elements
   */
  private applyActiveState(): void {
    const profileCard = document.querySelector('.profile-card_wrapper');
    const visualBlock = document.querySelector('.visual-block-card');
    const shadow = document.querySelector('.shadow-yellow');

    profileCard?.classList.add('active_fill');
    visualBlock?.classList.add('active');
    shadow?.classList.add('active');
  }

  /**
   * Remove active state classes from all elements
   */
  private removeActiveState(): void {
    const profileCard = document.querySelector('.profile-card_wrapper');
    const visualBlock = document.querySelector('.visual-block-card');
    const shadow = document.querySelector('.shadow-yellow');

    profileCard?.classList.remove('active_fill');
    visualBlock?.classList.remove('active');
    shadow?.classList.remove('active');
  }

  /**
   * Apply rotation state classes
   */
  private applyRotationState(): void {
    const profileCard = document.querySelector('.profile-card_wrapper');
    const frontElements = document.querySelector('.front-elements');
    const rotationElements = document.querySelector('.rotation-elements');

    profileCard?.classList.add('rotate');
    frontElements?.classList.remove('active');
    rotationElements?.classList.add('active');
  }
}
```

**Benefits:**

- ✅ Single source of truth for card states
- ✅ Easier to maintain and extend
- ✅ Prevents inconsistencies between interaction methods
- ✅ Better separation of concerns

**Drawbacks:**

- ❌ Requires refactoring existing code
- ❌ More complex implementation
- ❌ Potential for breaking changes

---

## Recommendation

**Use Option A (Fix the Existing Implementation)** because:

1. It's a simple one-line fix
2. It maintains the existing architecture
3. It solves the immediate problem without introducing complexity
4. It's low-risk and easy to test

The fix should be applied in `src/utils/typebot-name-replacer.ts` at line 333, changing:

```typescript
element.classList.add(this.config.activeClass);  // ❌ Wrong
```

To:

```typescript
element.classList.add('active');  // ✅ Correct
```

This ensures that when the user types their name, the card becomes active with the exact same visual state as clicking it, creating a consistent user experience.
