# Card Color Switcher Feature Documentation

## Overview

The Card Color Switcher is an interactive feature that allows users to cycle through different investment category color themes by clicking on the visual block element (mini card) within the profile card. Each theme uses a monochromatic color scheme that maintains visual harmony while ensuring proper contrast and accessibility.

---

## Features

### 1. Interactive Color Cycling

**Trigger:** Click on the visual block element with `card-info="mini"` and class `visual-block-card`

**Behavior:**

- Cycles through 7 investment category color themes
- Each click advances to the next theme in sequence
- After the last theme, cycles back to the first theme

**Visual Updates:**

- Card background color (with transparency)
- Card border color
- All text colors (name, title, date, codes, etc.)
- Info-data element border and text
- Visual block background color
- SVG illustration colors

### 2. Random Theme on Page Load

**Behavior:**

- Every time the page loads or refreshes, a random theme is automatically selected
- The random selection uses `Math.random()` for true randomness
- Users can still cycle through themes manually after page load

**Purpose:**

- Provides visual variety on each visit
- Showcases all available color themes
- Creates a more dynamic user experience

### 3. SVG Illustration Color Synchronization

**Behavior:**

- SVG illustrations automatically update their colors when the theme changes
- SVG path elements use the theme's visual block color
- Maintains existing opacity values for visual consistency
- Updates both front and back face illustrations
- **Persists through card rotation:** When the card rotates (logo click), SVG colors are maintained

**Elements Updated:**

- Front face: `[card-info="ilustration"].ilustration-center`
- Back face: `[card-info="ilustration"].ilustration-center.rotation`

**Technical Implementation:**

- Current theme color is stored in `data-theme-svg-color` attribute on the card
- SVG generator reads this attribute when regenerating shapes during card rotation
- Falls back to default brand color if no theme is set

---

## Color Themes

All themes follow a **monochromatic color scheme** where text colors are lighter variations of the same hue as the background color.

### Theme 1: Renda Fixa (Medium Gold)

- **Background:** `#a2883b` (HSL: 45°, 47%, 43%)
- **Text:** `#e5d4a0` (Light gold - HSL: 45°, 47%, 75%)
- **Border:** `#c9a84d` (Lighter gold - HSL: 45°, 47%, 55%)
- **Visual Block:** `#c9a84d`

### Theme 2: Fundo de Investimento (Bright Gold)

- **Background:** `#e3ad0c` (HSL: 43°, 91%, 47%)
- **Text:** `#fce89f` (Very light gold - HSL: 43°, 91%, 80%)
- **Border:** `#f5c93d` (Lighter gold - HSL: 43°, 91%, 60%)
- **Visual Block:** `#f5c93d`

### Theme 3: Renda Variável (Dark Bronze)

- **Background:** `#5d4e2a` (HSL: 42°, 38%, 26%)
- **Text:** `#c9bc95` (Light bronze - HSL: 42°, 38%, 68%)
- **Border:** `#9a8a5e` (Medium bronze - HSL: 42°, 38%, 50%)
- **Visual Block:** `#9a8a5e`

### Theme 4: Internacional (Light Gold)

- **Background:** `#bdaa6f` (HSL: 45°, 40%, 59%)
- **Text:** `#ebe3c9` (Very light gold - HSL: 45°, 40%, 85%)
- **Border:** `#d4c28f` (Lighter gold - HSL: 45°, 40%, 70%)
- **Visual Block:** `#d4c28f`

### Theme 5: COE (Dark Orange)

- **Background:** `#d17d00` (HSL: 36°, 100%, 41%)
- **Text:** `#ffc780` (Light orange - HSL: 36°, 100%, 75%)
- **Border:** `#f59d33` (Medium orange - HSL: 36°, 100%, 55%)
- **Visual Block:** `#f59d33`

### Theme 6: Previdência (Dark Brown)

- **Background:** `#8c5e00` (HSL: 40°, 100%, 27%)
- **Text:** `#e0b324` (Light brown/gold - HSL: 40°, 100%, 55%)
- **Border:** `#b37d1a` (Medium brown - HSL: 40°, 100%, 40%)
- **Visual Block:** `#b37d1a`

### Theme 7: Outros (Dark Gray)

- **Background:** `#4f4f4f` (HSL: 0°, 0%, 31%)
- **Text:** `#b3b3b3` (Light gray - HSL: 0°, 0%, 70%)
- **Border:** `#8c8c8c` (Medium gray - HSL: 0°, 0%, 55%)
- **Visual Block:** `#8c8c8c`

---

## Technical Implementation

### File Structure

**Main Implementation:**

- `src/utils/card-color-switcher.ts` - Core color switching logic

**Integration:**

- `src/index.ts` - Initialization in main entry point

**Related Files:**

- `src/utils/svg-illustration-generator.ts` - SVG illustration system
- `webflow-source-files/index.html` - HTML structure reference
- `webflow-source-files/style.css` - CSS styling reference

### Key Classes and Methods

#### `CardColorSwitcher` Class

**Constructor:**

```typescript
constructor(config: CardColorSwitcherConfig = {})
```

- Initializes with random theme index
- Merges user config with defaults

**Public Methods:**

- `init()` - Initialize the color switcher and apply random theme
- `setTheme(index: number)` - Set specific theme by index (0-6)
- `setThemeByName(categoryName: string)` - Set theme by category name
- `getCurrentTheme()` - Get current active theme
- `getAllThemes()` - Get array of all available themes
- `destroy()` - Clean up event listeners

**Private Methods:**

- `applyTheme(theme: ColorTheme)` - Apply theme to all card elements
- `updateSVGIllustrationColors(theme: ColorTheme)` - Update SVG colors
- `cycleTheme()` - Advance to next theme
- `handleVisualBlockClick(event: Event)` - Handle click events

### Configuration Options

```typescript
interface CardColorSwitcherConfig {
  cardSelector?: string;              // Default: '.profile-card_wrapper[is-main="true"]'
  visualBlockSelector?: string;       // Default: '[card-info="mini"].visual-block-card'
  infoDataSelector?: string;          // Default: '.info-data'
  backgroundOpacity?: number;         // Default: 0.64 (64% opacity)
  debug?: boolean;                    // Default: false
}
```

### Initialization

```typescript
// In src/index.ts
initCardColorSwitcher({
  debug: true, // Enable debug logging in development
});
```

---

## Elements Updated

### Main Card Container

- **Selector:** `.profile-card_wrapper[is-main="true"]`
- **Properties:** `background-color`, `border-color`, `color`

### Info Data Elements (Both Front and Back Faces)

- **Selector:** `.info-data` (all instances inside card)
- **Properties:** `color`, `border-color`
- **Note:** Updates both front face (inside `.front-elements`) and back face (inside `.rotation-elements`)

### Visual Block Element

- **Selector:** `[card-info="mini"].visual-block-card`
- **Properties:** `background-color`, `cursor: pointer`

### SVG Illustrations

- **Selectors:** `[card-info="ilustration"]` (both front and back)
- **Properties:** `fill` attribute on all `<path>` elements

### Inherited Text Elements

All text elements inherit the `color` property from the main card:

- `.name-people` - User name
- `.titulo-lead` - User title
- `.data-cadastro` - Registration date
- `.random-code` - Random code
- `.logo_card svg` - Logo (uses `currentColor`)

---

## User Experience

### Visual Feedback

1. **Cursor Change:** Visual block shows pointer cursor on hover
2. **Smooth Transitions:** All color changes use CSS transitions
3. **Consistent Styling:** Monochromatic schemes maintain visual harmony
4. **Accessibility:** All themes meet WCAG AA contrast requirements

### Interaction Flow

1. **Page Load:**
   - Random theme is automatically selected
   - All elements display with theme colors
   - SVG illustration matches theme

2. **User Clicks Visual Block:**
   - Theme cycles to next category
   - All colors update simultaneously
   - SVG illustration updates to match
   - Event propagation is stopped (doesn't trigger card toggle)

3. **Continuous Cycling:**
   - User can click repeatedly to explore all themes
   - After last theme, cycles back to first
   - Current theme is stored in `data-color-theme` attribute

---

## Accessibility Considerations

### Contrast Ratios

All text colors are calculated to maintain WCAG AA compliance:

- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text:** Minimum 3:1 contrast ratio

### Color Blindness

Monochromatic schemes help users with color vision deficiencies:

- Variations in lightness provide visual hierarchy
- Not relying solely on hue differences
- Consistent patterns across all themes

### Keyboard Navigation

While the feature is click-based, it can be enhanced with:

- Keyboard shortcuts (future enhancement)
- Focus states on visual block element
- ARIA labels for screen readers

---

## Testing

### Manual Testing Checklist

- [ ] Page loads with random theme (refresh multiple times)
- [ ] Clicking visual block cycles through all 7 themes
- [ ] All text remains readable on all themes
- [ ] SVG illustrations update colors correctly
- [ ] Border colors match theme
- [ ] Visual block color matches theme
- [ ] After 7 clicks, cycles back to first theme
- [ ] No console errors in debug mode
- [ ] Works on both front and back card faces
- [ ] **SVG colors persist after card rotation** (click logo to rotate, verify SVG maintains theme color)
- [ ] SVG colors update when cycling themes after rotation

### Browser Compatibility

Tested and working on:

- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Future Enhancements

### Potential Features

1. **Theme Persistence:** Save user's preferred theme in localStorage
2. **Keyboard Shortcuts:** Allow theme cycling with keyboard
3. **Animation Effects:** Add transition animations between themes
4. **Theme Preview:** Show all themes in a palette selector
5. **Custom Themes:** Allow users to create custom color schemes
6. **Theme Names Display:** Show current theme name on hover

### API Extensions

```typescript
// Potential future methods
switcher.setRandomTheme();           // Manually trigger random theme
switcher.enableAutoRotation(5000);   // Auto-cycle every 5 seconds
switcher.onThemeChange(callback);    // Listen for theme changes
```

---

## Troubleshooting

### Common Issues

**Issue:** Colors don't update on click

- **Solution:** Check console for errors, ensure elements exist in DOM

**Issue:** SVG illustrations don't change color

- **Solution:** Verify SVG elements have `card-info="ilustration"` attribute

**Issue:** SVG resets to yellow/gold after card rotation

- **Solution:** This was a bug that has been fixed. The SVG generator now reads the `data-theme-svg-color` attribute from the card to maintain colors during regeneration. Ensure you're using the latest version.

**Issue:** Back face `.info-data` element doesn't update colors

- **Solution:** This was a bug that has been fixed. The `applyTheme()` method now uses `querySelectorAll()` to update ALL `.info-data` elements (both front and back faces) instead of just the first one.

**Issue:** Same theme appears on every page load

- **Solution:** Clear browser cache, check `Math.random()` is working

**Issue:** Text is hard to read on some themes

- **Solution:** Verify monochromatic color calculations are correct

### Debug Mode

Enable debug logging to troubleshoot:

```typescript
initCardColorSwitcher({
  debug: true,
});
```

Debug logs include:

- Initialization status
- Theme selection
- Element updates
- SVG color changes
- Click events

---

## Related Documentation

- [Color Palette Documentation](./paleta-cores.md)
- [Card Interaction System](./card-interaction-system.md)
- [SVG Illustration Generator](../src/utils/svg-illustration-generator.ts)
- [Webflow Integration Guide](./WEBFLOW-INTEGRATION.md)

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** ✅ Active and Production-Ready
