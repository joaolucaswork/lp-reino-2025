---
type: "always_apply"
---

# Webflow Project Rules - Reino Capital Landing Page

## 🚨 CRITICAL: Read-Only Source Files

### Absolute Protection Rules

**The `webflow-source-files/` directory is STRICTLY READ-ONLY.**

- **NEVER** modify, edit, or overwrite any files in `webflow-source-files/`
- **NEVER** use `str-replace-editor` on files in this directory
- **NEVER** use `save-file` to overwrite these files
- **NEVER** suggest changes to these files
- These files are the **source of truth** for the entire project

### Source Files

1. **`webflow-source-files/index.html`** (280 lines)
   - Complete HTML structure for the landing page
   - Embedded global styles and utilities
   - Typebot integration for lead capture
   - Profile card component with Reino Capital branding
   - Reference ONLY - never modify

2. **`webflow-source-files/style.css`** (12,562 lines)
   - Complete CSS styling system
   - Custom font definitions (Satoshi, Firacode, Departuremono, Fontspringdemo)
   - CSS custom properties for theming (dark/light modes)
   - Comprehensive component library
   - Responsive utilities and helper classes
   - Reference ONLY - never modify

## 📋 Project Structure

### Technology Stack

- **Build Tool**: esbuild
- **Language**: TypeScript
- **Package Manager**: pnpm (>=10)
- **Testing**: Playwright
- **Linting**: ESLint + Prettier
- **Framework**: Finsweet Developer Starter

### Directory Structure

```
lp-reino-2025/
├── webflow-source-files/    # 🔒 READ-ONLY - Source of truth
│   ├── index.html           # HTML structure reference
│   └── style.css            # CSS styling reference
├── src/                     # ✅ Development source code
│   ├── index.ts            # Main entry point
│   └── utils/              # Utility functions
├── dist/                    # 🔒 Build output (auto-generated)
├── bin/                     # Build scripts
│   ├── build.js            # Build configuration
│   └── live-reload.js      # Development server
└── tests/                   # Playwright tests
```

## 🎯 Development Workflow

### When Implementing Features

1. **ALWAYS** reference `webflow-source-files/` for structure and styling
2. **NEVER** modify the source files directly
3. Implement features in `src/` directory
4. Build outputs go to `dist/` directory
5. Test with Playwright in `tests/` directory

### Key Commands

```bash
pnpm dev          # Development mode with live reload
pnpm build        # Production build
pnpm test         # Run Playwright tests
pnpm lint         # Check code quality
pnpm format       # Format code with Prettier
```

## 🎨 Design System Reference

### Color System (from style.css)

**Brand Colors:**
- Primary Gold: `#daa521` (--swatch--brand-1)
- Dark Brown: `#3b2f10` (--swatch--brand-2)
- Background Light: `#fef4da` (--swatch--nav-bg)
- Dark Gray: `#565656` (--swatch--dark)
- White: `#fff` (--swatch--light)

**Theme Variables:**
- Background: `var(--color--background)`
- Text: `var(--color--text)`
- Button Background: `var(--color--button-background)`
- Button Text: `var(--color--button-text)`

### Typography System

**Font Families:**
- Primary: `Satoshi Variable, Arial, sans-serif`
- Monospace: `Firacode Retina Webfont`
- Alternative: `Departuremono`, `Fontspringdemo`

**Heading Sizes:**
- H1: `6.25em` (clamp: 3rem to 6rem)
- H2: `3rem` (clamp: 2.5rem to 6rem)
- H3: `2rem` (clamp: 1.5rem to 2rem)
- H4: `1.25rem`
- H5: `1.25rem`
- H6: `1rem`

**Text Sizes:**
- Large: `1.5rem`
- Regular: `1rem`
- Small: `0.875rem`
- Tiny: `0.75rem`

### Spacing System

**Margin/Padding Classes:**
- `margin-0` / `padding-0`: 0
- `margin-tiny` / `padding-tiny`: 0.125rem
- `margin-xxsmall` / `padding-xxsmall`: 0.25rem
- `margin-xsmall` / `padding-xsmall`: 0.5rem
- `margin-small` / `padding-small`: 1rem
- `margin-medium` / `padding-medium`: 2rem
- `margin-large` / `padding-large`: 3rem
- `margin-xlarge` / `padding-xlarge`: 4rem
- `margin-xxlarge` / `padding-xxlarge`: 5rem
- `margin-huge` / `padding-huge`: 6rem
- `margin-xhuge` / `padding-xhuge`: 8rem
- `margin-xxhuge` / `padding-xxhuge`: 12rem

**Directional Classes:**
- `margin-top`, `margin-right`, `margin-bottom`, `margin-left`
- `padding-top`, `padding-right`, `padding-bottom`, `padding-left`
- `margin-horizontal`, `margin-vertical`
- `padding-horizontal`, `padding-vertical`

### Component Classes

**Buttons:**
- `.button` - Base button style
- `.button.is-brand` - Brand styled button (gold)
- `.button.is-secondary` - Secondary button with border
- `.button.is-small` - Small button variant
- `.button.is-large` - Large button variant
- `.button.is-icon` - Button with icon

**Containers:**
- `.container` - Base container (max-width: 1920px)
- `.container-small` - Small container (max-width: 48rem)
- `.container-medium` - Medium container
- `.container-large` - Large container (max-width: 76em)

**Utility Classes:**
- `.hide` - Hide element
- `.hide-tablet` - Hide on tablet and below
- `.hide-mobile` - Hide on mobile
- `.text-align-center` - Center text
- `.text-weight-bold` - Bold text (700)
- `.text-weight-medium` - Medium text (500)
- `.text-style-muted` - Muted text (opacity: 0.75)

## 🏗️ HTML Structure Reference

### Main Layout (from index.html)

```html
<body class="body-lp">
  <div class="page-wrapper">
    <div class="estilo-global w-embed">
      <!-- Global styles -->
    </div>
    <div class="main-wrapper">
      <section class="hero-lp-reino">
        <div class="hero-lp-main_wrapper">
          <div class="hero-left-content_wrapper">
            <!-- Copy content -->
            <!-- Profile card -->
          </div>
          <div class="hero-right-content_wrapper">
            <!-- Typebot integration -->
          </div>
        </div>
      </section>
    </div>
  </div>
</body>
```

### Key Components

**Hero Section:**
- Class: `.hero-lp-reino`
- Two-column layout: left content + right Typebot
- Responsive design with breakpoints

**Profile Card:**
- Class: `.profile-card_wrapper`
- Attributes: `card-info="bg-text-color"`
- Contains: name, title, logo, date, illustration

**Typebot Integration:**
- Script: `@typebot.io/js@0/dist/web.js`
- Element: `<typebot-standard>`
- ID: `captura-landing-page-7sjfh99`

## 🔧 Implementation Guidelines

### When Adding New Features

1. **Reference First**: Always check `webflow-source-files/` for existing patterns
2. **Match Styling**: Use existing CSS classes and variables
3. **Maintain Structure**: Follow the HTML structure patterns
4. **TypeScript**: Write type-safe code in `src/`
5. **Test**: Add Playwright tests for new functionality

### CSS Class Usage

- **DO**: Use existing utility classes from style.css
- **DO**: Use CSS custom properties for colors and spacing
- **DO**: Follow the BEM-like naming convention
- **DON'T**: Create conflicting class names
- **DON'T**: Override source file styles inline

### Responsive Design

**Breakpoints (from style.css):**
- Desktop: `min-width: 1920px` (max font size)
- Tablet: `max-width: 991px`
- Mobile Landscape: `max-width: 767px`
- Mobile: `max-width: 479px`

**Responsive Font Sizing:**
- Base: `1.1111111111111112vw`
- Max: `21.333333333333332px` (at 1920px+)
- Min: `11.011111111111111px` (at 991px-)

## 📝 Code Quality Standards

### TypeScript

- Use strict type checking
- No `any` types without justification
- Proper interface definitions
- JSDoc comments for public APIs

### Formatting

- Prettier for code formatting
- ESLint for code quality
- 2-space indentation
- Single quotes for strings
- Trailing commas in objects/arrays

### Testing

- Write Playwright tests for user interactions
- Test responsive behavior
- Test form submissions
- Test animations and transitions

## ⚠️ Common Pitfalls to Avoid

1. **NEVER** edit `webflow-source-files/` directly
2. **NEVER** commit `dist/` or `node_modules/` to git
3. **NEVER** modify lock files manually
4. **NEVER** use inline styles that override source CSS
5. **NEVER** create duplicate class names
6. **ALWAYS** reference source files for styling patterns
7. **ALWAYS** use TypeScript for type safety
8. **ALWAYS** test responsive behavior
9. **ALWAYS** follow the existing code structure
10. **ALWAYS** run linting before committing

---

**Remember**: The `webflow-source-files/` directory is the single source of truth. Always reference it, never modify it.
