# Webflow Integration Guide - Reino Capital Landing Page

## 📖 Overview

This document provides comprehensive guidance for integrating custom TypeScript/JavaScript functionality with the Reino Capital landing page built in Webflow.

## 🚨 Critical Information

### Read-Only Source Files

The `webflow-source-files/` directory contains **READ-ONLY** reference files:

- **`index.html`** - Complete HTML structure exported from Webflow
- **`style.css`** - Complete CSS styling system from Webflow

**These files must NEVER be modified.** They serve as the source of truth for the project structure and styling.

## 🏗️ Architecture

### File Structure

```
lp-reino-2025/
├── webflow-source-files/     # 🔒 READ-ONLY Webflow exports
│   ├── index.html            # HTML structure reference
│   └── style.css             # CSS styling reference
│
├── src/                      # ✅ Your custom TypeScript code
│   ├── index.ts             # Main entry point
│   └── utils/               # Utility functions
│       └── greet.ts         # Example utility
│
├── dist/                     # 🔨 Build output (auto-generated)
│   ├── index.js             # Compiled JavaScript
│   └── index.js.map         # Source maps
│
├── bin/                      # Build scripts
│   ├── build.js             # esbuild configuration
│   └── live-reload.js       # Development server
│
└── tests/                    # Playwright tests
    └── example.spec.ts      # Test examples
```

### Integration Flow

```
Webflow Design → Export → webflow-source-files/ (reference)
                                    ↓
                          Analyze structure & classes
                                    ↓
                    Write TypeScript in src/
                                    ↓
                    Build with esbuild → dist/
                                    ↓
                    Include in Webflow project
```

## 🎯 Development Workflow

### 1. Setup

```bash
# Install dependencies
pnpm install

# Start development server with live reload
pnpm dev
```

### 2. Development

1. **Reference the source files** in `webflow-source-files/` to understand:
   - HTML structure and class names
   - Available CSS classes and utilities
   - Component patterns and layouts

2. **Write your TypeScript code** in `src/`:
   - Use existing class names from the Webflow export
   - Follow TypeScript best practices
   - Add proper type definitions

3. **Test locally**:
   ```bash
   pnpm test        # Run Playwright tests
   pnpm test:ui     # Run tests with UI
   ```

4. **Build for production**:
   ```bash
   pnpm build       # Creates optimized dist/index.js
   ```

### 3. Integration with Webflow

#### Option A: Custom Code Embed (Recommended)

1. In Webflow Designer, go to **Project Settings → Custom Code**
2. Add before `</body>`:
   ```html
   <script src="https://your-cdn.com/dist/index.js"></script>
   ```

#### Option B: Page-Specific Embed

1. Select the page in Webflow
2. Open **Page Settings → Custom Code**
3. Add the script tag in "Before </body> tag"

#### Option C: Embed Element

1. Drag an **Embed** element where you want the script
2. Add:
   ```html
   <script src="https://your-cdn.com/dist/index.js"></script>
   ```

## 🎨 Working with Webflow Classes

### Understanding the Class System

Webflow generates semantic class names. Here are the key patterns from this project:

#### Layout Classes

```css
.page-wrapper          /* Main page container */
.main-wrapper          /* Main content wrapper */
.container             /* Responsive container (max-width: 1920px) */
.container-large       /* Large container (max-width: 76em) */
.container-small       /* Small container (max-width: 48rem) */
```

#### Hero Section Classes

```css
.hero-lp-reino                  /* Hero section */
.hero-lp-main_wrapper           /* Hero main container */
.hero-left-content_wrapper      /* Left column */
.hero-right-content_wrapper     /* Right column (Typebot) */
.copy-content                   /* Text content wrapper */
.h1-reino-lp                    /* Main heading */
.paragraph-reino                /* Paragraph wrapper */
```

#### Profile Card Classes

```css
.profile-card_wrapper           /* Card container */
.top-card_wrapper              /* Top section of card */
.name-people                   /* Name field */
.titulo-lead                   /* Title/role field */
.logo_card                     /* Logo container */
.info-data                     /* Info section */
.ilustration-center            /* Illustration area */
```

#### Button Classes

```css
.button                        /* Base button */
.button.is-brand              /* Brand styled (gold) */
.button.is-secondary          /* Secondary style */
.button.is-small              /* Small variant */
.button.is-large              /* Large variant */
.button.is-icon               /* With icon */
```

#### Utility Classes

```css
/* Spacing */
.margin-0, .padding-0         /* No spacing */
.margin-small, .padding-small /* 1rem */
.margin-medium, .padding-medium /* 2rem */
.margin-large, .padding-large /* 3rem */

/* Visibility */
.hide                         /* Hide element */
.hide-tablet                  /* Hide on tablet and below */
.hide-mobile                  /* Hide on mobile */

/* Text */
.text-align-center           /* Center text */
.text-weight-bold            /* Bold (700) */
.text-weight-medium          /* Medium (500) */
.text-style-muted            /* Muted (opacity: 0.75) */
.text-size-large             /* 1.5rem */
.text-size-regular           /* 1rem */
.text-size-small             /* 0.875rem */
```

### Selecting Elements in TypeScript

```typescript
// By class name
const hero = document.querySelector('.hero-lp-reino');
const heading = document.querySelector('.h1-reino-lp');

// By custom attribute
const card = document.querySelector('[card-info="bg-text-color"]');
const cardName = document.querySelector('[card-info="name"]');

// Multiple elements
const buttons = document.querySelectorAll('.button.is-brand');
```

## 🎨 Using Webflow Styles

### CSS Custom Properties

The project uses CSS variables for theming:

```typescript
// Get CSS variable value
const bgColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--color--background');

// Set CSS variable
document.documentElement.style.setProperty('--color--background', '#fff');
```

### Available CSS Variables

```css
/* Colors */
--color--background          /* Background color */
--color--text               /* Text color */
--color--button-background  /* Button background */
--color--button-text        /* Button text */

/* Brand Colors */
--swatch--brand-1           /* Primary gold: #daa521 */
--swatch--brand-2           /* Dark brown: #3b2f10 */
--swatch--dark              /* Dark gray: #565656 */
--swatch--light             /* White: #fff */
--swatch--nav-bg            /* Nav background: #fef4da */
```

### Applying Webflow Classes Dynamically

```typescript
// Add Webflow class
element.classList.add('button', 'is-brand');

// Toggle visibility
element.classList.toggle('hide-mobile');

// Check if has class
if (element.classList.contains('hero-lp-reino')) {
  // Do something
}
```

## 🔧 Common Integration Patterns

### 1. Form Enhancement

```typescript
// Enhance Webflow form
const form = document.querySelector('.form_component');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Your custom logic
  const formData = new FormData(e.target as HTMLFormElement);
  
  // Submit to your backend
  await fetch('/api/submit', {
    method: 'POST',
    body: formData
  });
});
```

### 2. Dynamic Content Loading

```typescript
// Load dynamic content into Webflow structure
async function loadContent() {
  const container = document.querySelector('.copy-content');
  
  const data = await fetch('/api/content').then(r => r.json());
  
  if (container) {
    container.innerHTML = `
      <h1 class="h1-reino-lp">${data.title}</h1>
      <div class="paragraph-reino">
        <p class="text-size-large text-style-muted-60">${data.description}</p>
      </div>
    `;
  }
}
```

### 3. Animation Triggers

```typescript
// Trigger animations on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
});

document.querySelectorAll('.hero-lp-reino').forEach(el => {
  observer.observe(el);
});
```

### 4. Profile Card Customization

```typescript
// Update profile card dynamically
function updateProfileCard(data: {
  name: string;
  title: string;
  date: string;
}) {
  const nameEl = document.querySelector('[card-info="name"]');
  const titleEl = document.querySelector('[card-info="title"]');
  const dateEl = document.querySelector('[card-info="date"]');
  
  if (nameEl) nameEl.textContent = data.name;
  if (titleEl) titleEl.textContent = data.title;
  if (dateEl) dateEl.textContent = data.date;
}
```

## 📱 Responsive Considerations

### Breakpoints

```typescript
// Match Webflow breakpoints
const breakpoints = {
  mobile: 479,
  mobileLandscape: 767,
  tablet: 991,
  desktop: 1920
};

// Check current breakpoint
function getCurrentBreakpoint(): string {
  const width = window.innerWidth;
  
  if (width <= breakpoints.mobile) return 'mobile';
  if (width <= breakpoints.mobileLandscape) return 'mobileLandscape';
  if (width <= breakpoints.tablet) return 'tablet';
  return 'desktop';
}

// Responsive behavior
window.addEventListener('resize', () => {
  const breakpoint = getCurrentBreakpoint();
  console.log('Current breakpoint:', breakpoint);
});
```

## 🧪 Testing

### Testing with Webflow Classes

```typescript
// tests/integration.spec.ts
import { test, expect } from '@playwright/test';

test('hero section displays correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check Webflow classes exist
  const hero = page.locator('.hero-lp-reino');
  await expect(hero).toBeVisible();
  
  // Check heading
  const heading = page.locator('.h1-reino-lp');
  await expect(heading).toContainText('Seus investimentos');
});

test('profile card has correct structure', async ({ page }) => {
  await page.goto('/');
  
  const card = page.locator('.profile-card_wrapper');
  await expect(card).toBeVisible();
  
  const name = page.locator('[card-info="name"]');
  await expect(name).toBeVisible();
});
```

## 🚀 Deployment

### 1. Build Production Bundle

```bash
pnpm build
```

This creates `dist/index.js` - a minified, production-ready bundle.

### 2. Host the JavaScript

Upload `dist/index.js` to your hosting:

- **CDN** (recommended): Cloudflare, AWS CloudFront, etc.
- **Static hosting**: Netlify, Vercel, GitHub Pages
- **Your server**: Any web server

### 3. Add to Webflow

In Webflow Project Settings → Custom Code:

```html
<script src="https://your-domain.com/dist/index.js"></script>
```

### 4. Publish

Publish your Webflow site. The custom JavaScript will now be included.

## 🔍 Debugging

### Development

```bash
# Run with source maps
pnpm dev

# Check for errors
pnpm lint

# Type check
pnpm check
```

### In Browser

```javascript
// Check if script loaded
console.log('Custom script loaded');

// Inspect Webflow elements
console.log(document.querySelector('.hero-lp-reino'));

// Check CSS variables
console.log(getComputedStyle(document.documentElement)
  .getPropertyValue('--color--background'));
```

## 📚 Additional Resources

- [Webflow University](https://university.webflow.com/)
- [Finsweet Developer Starter](https://github.com/finsweet/developer-starter)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [esbuild Documentation](https://esbuild.github.io/)

---

**Remember**: Always reference `webflow-source-files/` for the latest structure and classes. Never modify these files directly.

