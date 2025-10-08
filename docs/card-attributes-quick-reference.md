# Card Attributes Quick Reference

## Overview

This is a quick reference guide for all custom attributes used in the profile card system.

---

## Custom Attributes

### 1. `card-info` Attribute

Used to identify and update specific data elements within the card.

| Value | Element | Purpose | Updatable | Updated By |
|-------|---------|---------|-----------|------------|
| `bg-text-color` | `.profile-card_wrapper` | Main wrapper for theming | No | N/A |
| `name` | `.name-people` | User's name | Yes | `typebot-name-replacer.ts` |
| `title` | `.titulo-lead` | User's title/role | Yes | `card-updater.ts` |
| `elements` | `.info-data` | Data container | No | N/A |
| `mini` | `.visual-block-card` | Visual indicator block | No | N/A |
| `date` | `.data-cadastro` | Registration date | Yes | `card-updater.ts` |
| `random-code` | `.random-code` | User ID code | Yes | `typebot-name-replacer.ts` |
| `email` | `.email-lead` | User's email | Yes | `typebot-email-handler.ts` |
| `telefone` | N/A | User's phone | Yes | `typebot-email-handler.ts` |
| `ilustration` | `.ilustration-center` | Central illustration | No | N/A |

---

### 2. `card-face` Attribute

Used to identify which side of the card is displayed.

| Value | Element | Purpose | Initial State |
|-------|---------|---------|---------------|
| `front` | `.front-elements` | Front face of card | Visible (has `active` class) |
| `back` | `.rotation-elements` | Back face of card | Hidden (no `active` class) |

**State Changes:**
- When email is entered, `front` loses `active` class and `back` gains `active` class
- This creates the card flip effect

---

### 3. `is-main` Attribute

Used to identify the main card wrapper for click interactions.

| Value | Element | Purpose |
|-------|---------|---------|
| `true` | `.profile-card_wrapper` | Marks the clickable card |

---

## CSS Classes

### State Classes

| Class | Applied To | Purpose | Visual Effect |
|-------|-----------|---------|---------------|
| `active_fill` | `.profile-card_wrapper` | Activates card | Scale 1.1, rotate, cursor pointer |
| `active` | `.visual-block-card` | Expands visual block | Width: 49px → 5rem |
| `active` | `.shadow-yellow` | Enhances shadow | Color & height change |
| `active` | `.front-elements` | Shows front face | Display: flex, z-index: 10 |
| `active` | `.rotation-elements` | Shows back face | Opacity: 100, rotateY(-180deg) |
| `rotate` | `.profile-card_wrapper` | Triggers flip animation | rotateY(-180deg) |

---

## Interaction Methods

### Method 1: Click Interaction

**Trigger:** User clicks `.profile-card_wrapper`

**Handler:** `src/utils/profile-card-toggle.ts`

**Classes Applied:**
```
.profile-card_wrapper → + active_fill
.visual-block-card    → + active
.shadow-yellow        → + active
```

**Behavior:** Toggle on/off with each click

---

### Method 2: Name Input

**Trigger:** User types name in Typebot (variable: `nome`)

**Handler:** `src/utils/typebot-name-replacer.ts`

**Classes Applied:**
```
.profile-card_wrapper → + active_fill
.visual-block-card    → + active
.shadow-yellow        → + active
```

**Additional Actions:**
- Replaces `******` with user's name
- Adds `name-updated` class to updated elements

---

### Method 3: Email Input (Card Rotation)

**Trigger:** User enters email in Typebot (variable: `email`)

**Handler:** `src/utils/typebot-email-handler.ts`

**Classes Applied:**
```
.profile-card_wrapper  → + active_fill, + rotate
.front-elements        → - active
.rotation-elements     → + active
```

**Additional Actions:**
- Updates email display
- Updates phone display (if provided)
- Only rotates once (uses `hasRotated` flag)

---

## Element Hierarchy

```
.profile-card_wrapper [is-main="true"] [card-info="bg-text-color"]
├── .front-elements [card-face="front"]
│   ├── .top-card_wrapper
│   │   ├── .name-people [card-info="name"]
│   │   └── .titulo-lead [card-info="title"]
│   ├── .logo_card
│   ├── .bottom-elementos
│   │   ├── .info-data [card-info="elements"]
│   │   │   ├── RC text
│   │   │   ├── .visual-block-card [card-info="mini"]
│   │   │   └── .data-cadastro [card-info="date"]
│   │   └── .codigo-usuario
│   │       └── .random-code [card-info="random-code"]
│   └── .ilustration-center [card-info="ilustration"]
│
├── .rotation-elements [card-face="back"]
│   ├── .logo_card.rotate_version
│   ├── .top-card_wrapper
│   │   ├── .name-people [card-info="name"]
│   │   └── .email-lead [card-info="email"]
│   ├── .bottom-elementos.rotation_version
│   │   ├── .info-data [card-info="elements"]
│   │   │   └── [card-info="telefone"]
│   │   └── .codigo-usuario
│   │       └── .random-code [card-info="random-code"]
│   └── .ilustration-center.rotation [card-info="ilustration"]
│
└── .shadow-yellow
```

---

## Selectors for JavaScript

### Query by Attribute

```typescript
// Get element by card-info attribute
const nameElement = document.querySelector('[card-info="name"]');
const emailElement = document.querySelector('[card-info="email"]');

// Get all elements with card-info attribute
const allCardInfoElements = document.querySelectorAll('[card-info]');

// Get element by card-face attribute
const frontFace = document.querySelector('[card-face="front"]');
const backFace = document.querySelector('[card-face="back"]');

// Get main card
const mainCard = document.querySelector('[is-main="true"]');
```

### Query by Class

```typescript
// Get profile card wrapper
const profileCard = document.querySelector('.profile-card_wrapper');

// Get front and rotation elements
const frontElements = document.querySelector('.front-elements');
const rotationElements = document.querySelector('.rotation-elements');

// Get additional elements
const visualBlock = document.querySelector('.visual-block-card');
const shadow = document.querySelector('.shadow-yellow');
```

---

## TypeScript Utilities

### CardInfoMapper

```typescript
import { initCardInfoMapper, CardInfoAttribute } from '$utils/card-info-mapper';

// Initialize mapper
const mapper = initCardInfoMapper();

// Get specific element
const nameElement = mapper.getElement(CardInfoAttribute.NAME);

// Update card data
mapper.updateCard({
  name: 'John Doe',
  title: 'Investidor Estratégico',
  date: '08.10.2025'
});

// Validate all elements exist
const isValid = mapper.validateElements();

// Get missing elements
const missing = mapper.getMissingElements();
```

### Profile Card Toggle

```typescript
import { 
  initProfileCardToggle, 
  setProfileCardActive,
  isProfileCardActive 
} from '$utils/profile-card-toggle';

// Initialize click handlers
initProfileCardToggle();

// Manually activate/deactivate
setProfileCardActive(true);  // Activate
setProfileCardActive(false); // Deactivate

// Check current state
const isActive = isProfileCardActive();
```

### Typebot Name Replacer

```typescript
import { initTypebotNameReplacer } from '$utils/typebot-name-replacer';

// Initialize with default config
const replacer = initTypebotNameReplacer({
  debug: true
});

// Manually set name (for testing)
replacer.setUserName('John Doe');

// Get current name
const name = replacer.getUserName();
```

### Typebot Email Handler

```typescript
import { initTypebotEmailHandler } from '$utils/typebot-email-handler';

// Initialize with default config
const handler = initTypebotEmailHandler({
  debug: true
});

// Manually trigger rotation (for testing)
handler.rotate();

// Get current email
const email = handler.getUserEmail();
```

---

## Testing Checklist

### Visual Testing

- [ ] Click card → All three visual effects occur
- [ ] Click again → All effects reverse
- [ ] Type name → All three visual effects occur
- [ ] Type email → Card rotates to back face
- [ ] Verify name appears on both faces
- [ ] Verify email appears on back face

### Functional Testing

- [ ] Name replaces asterisks correctly
- [ ] Email displays correctly
- [ ] Phone displays correctly (if provided)
- [ ] Card only rotates once
- [ ] Toggle state persists correctly

### Cross-browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

---

## Common Issues & Solutions

### Issue: Visual block not expanding on name input
**Solution:** Ensure `active` class (not `active_fill`) is applied to `.visual-block-card`

### Issue: Shadow not changing on name input
**Solution:** Ensure `active` class (not `active_fill`) is applied to `.shadow-yellow`

### Issue: Card rotates multiple times
**Solution:** Check `hasRotated` flag in `typebot-email-handler.ts`

### Issue: Name not replacing asterisks
**Solution:** Verify Typebot is sending `typebot-variable-update` event with `variable: 'nome'`

### Issue: Card doesn't rotate on email input
**Solution:** Verify Typebot is sending `typebot-variable-update` event with `variable: 'email'`

---

## Related Files

- **HTML Structure:** `webflow-source-files/index.html`
- **CSS Styles:** `webflow-source-files/style.css`
- **TypeScript Utilities:** `src/utils/`
- **Full Documentation:** `docs/card-interaction-system.md`
- **Fix Summary:** `docs/card-interaction-fix-summary.md`

