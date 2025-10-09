# Design Document: Random SVG Illustration

## Overview

This document outlines the technical design for transforming the static "Illustration Center" div elements into dynamic SVG elements that display randomly generated abstract shapes. The implementation follows the existing codebase patterns and integrates seamlessly with the Reino Capital landing page architecture.

### Goals
- Replace `<div class="ilustration-center">` elements with `<svg>` elements
- Generate unique, visually appealing abstract shapes on each page load
- Support multiple shape generation algorithms (geometric, organic, abstract)
- Maintain existing styling, positioning, and animations
- Provide infinite variety through algorithmic generation
- Ensure high performance and browser compatibility

### Non-Goals
- Modifying the read-only source files in `webflow-source-files/`
- Creating animated or interactive shapes (static shapes only)
- Supporting user customization of shapes
- Persisting shapes across page loads

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      src/index.ts                           │
│  (Webflow initialization - calls initSVGIllustration)      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           src/utils/svg-illustration-generator.ts           │
│  - initSVGIllustration() - Main entry point                │
│  - SVGIllustrationGenerator class - Core logic             │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Geometric  │  │   Organic   │  │  Abstract   │
│  Generator  │  │    Blob     │  │    Form     │
│             │  │  Generator  │  │  Generator  │
└─────────────┘  └─────────────┘  └─────────────┘
         │               │               │
         └───────────────┼───────────────┘
                         ▼
              ┌─────────────────────┐
              │   SVG Builder       │
              │   Utilities         │
              └─────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   Random Number     │
              │   Generator         │
              └─────────────────────┘
```

### Module Structure

```
src/utils/svg-illustration-generator.ts
├── Types & Interfaces
│   ├── SVGIllustrationConfig
│   ├── ShapeGenerator
│   ├── ShapeConfig
│   └── Point
├── SVGIllustrationGenerator (Main Class)
│   ├── init()
│   ├── replaceIllustrationElements()
│   ├── createSVGElement()
│   └── selectAndGenerateShape()
├── Shape Generators
│   ├── generateGeometricPolygon()
│   ├── generateOrganicBlob()
│   └── generateAbstractForm()
├── SVG Utilities
│   ├── createSVGElement()
│   ├── createPathFromPoints()
│   └── createBezierPath()
└── Random Utilities
    ├── SeededRandom class
    ├── randomInt()
    ├── randomFloat()
    └── randomChoice()
```

## Components and Interfaces

### 1. Main Configuration Interface

```typescript
interface SVGIllustrationConfig {
  /** Selector for illustration elements to replace */
  illustrationSelector?: string;
  /** SVG viewBox dimensions */
  viewBox?: { width: number; height: number };
  /** Brand color for shapes */
  brandColor?: string;
  /** Opacity range for shapes */
  opacityRange?: { min: number; max: number };
  /** Random seed for reproducible generation (testing) */
  seed?: number;
  /** Enable debug logging */
  debug?: boolean;
}
```

### 2. Shape Generator Interface

```typescript
interface ShapeGenerator {
  /** Name of the shape generator */
  name: string;
  /** Generate SVG path data or elements */
  generate: (config: ShapeConfig) => SVGElement | SVGElement[];
}

interface ShapeConfig {
  /** Available width for the shape */
  width: number;
  /** Available height for the shape */
  height: number;
  /** Color to use for the shape */
  color: string;
  /** Opacity value */
  opacity: number;
  /** Random number generator instance */
  random: SeededRandom;
}
```

### 3. Geometric Types

```typescript
interface Point {
  x: number;
  y: number;
}

interface BezierControlPoint {
  point: Point;
  controlPoint1: Point;
  controlPoint2: Point;
}
```

### 4. SVGIllustrationGenerator Class

```typescript
class SVGIllustrationGenerator {
  private config: Required<SVGIllustrationConfig>;
  private random: SeededRandom;
  private shapeGenerators: ShapeGenerator[];

  constructor(config?: SVGIllustrationConfig);
  
  /** Initialize and replace all illustration elements */
  public init(): void;
  
  /** Find and replace illustration div elements with SVG */
  private replaceIllustrationElements(): void;
  
  /** Create an SVG element with generated shape */
  private createSVGElement(hasRotationClass: boolean): SVGSVGElement;
  
  /** Select a random shape generator and generate shape */
  private selectAndGenerateShape(config: ShapeConfig): SVGElement | SVGElement[];
  
  /** Log debug messages */
  private log(...args: unknown[]): void;
}
```

## Data Models

### Shape Generation Data Flow

```
1. Page Load
   ↓
2. Webflow.push() callback
   ↓
3. initSVGIllustration() called
   ↓
4. SVGIllustrationGenerator instantiated
   ↓
5. SeededRandom initialized (with seed or Date.now())
   ↓
6. Query all [card-info="ilustration"] elements
   ↓
7. For each element:
   ├── Check for .rotation class
   ├── Select random shape generator
   ├── Generate shape with ShapeConfig
   ├── Create SVG element
   ├── Append shape to SVG
   ├── Replace div with SVG
   └── Preserve attributes and classes
```

### Random Number Generation

```typescript
class SeededRandom {
  private seed: number;
  
  constructor(seed?: number);
  
  /** Generate random float between 0 and 1 */
  public next(): number;
  
  /** Generate random integer between min and max (inclusive) */
  public nextInt(min: number, max: number): number;
  
  /** Generate random float between min and max */
  public nextFloat(min: number, max: number): number;
  
  /** Select random item from array */
  public choice<T>(array: T[]): T;
}
```

## Shape Generation Algorithms

### 1. Geometric Polygon Generator

**Algorithm:**
1. Randomly select number of sides (3-12)
2. Calculate vertices on a circle
3. Apply random scale (0.6-1.0)
4. Apply random rotation (0-360°)
5. Optionally add irregularity to vertices
6. Create SVG polygon element

**Parameters:**
- `sides`: 3-12 (random)
- `scale`: 0.6-1.0 (random)
- `rotation`: 0-360° (random)
- `irregularity`: 0-0.3 (random, applied to vertex positions)

**Output:** Single `<polygon>` element

### 2. Organic Blob Generator

**Algorithm:**
1. Randomly select number of control points (4-8)
2. Place control points around a circle with random distances
3. Calculate Bézier curve control points for smooth transitions
4. Create closed path using cubic Bézier curves
5. Apply random rotation

**Parameters:**
- `controlPoints`: 4-8 (random)
- `radiusVariation`: 0.3-0.7 (random per point)
- `rotation`: 0-360° (random)
- `smoothness`: 0.5 (fixed for natural curves)

**Output:** Single `<path>` element with Bézier curves

### 3. Abstract Form Generator

**Algorithm:**
1. Randomly select number of primitives (2-5)
2. For each primitive:
   - Select type (circle, rectangle, triangle)
   - Random position within bounds
   - Random scale (0.2-0.6)
   - Random rotation
   - Random opacity (0.3-0.8)
3. Combine all primitives in a `<g>` group

**Parameters:**
- `primitiveCount`: 2-5 (random)
- `primitiveTypes`: ['circle', 'rect', 'polygon']
- `scaleRange`: 0.2-0.6 (random per primitive)
- `opacityRange`: 0.3-0.8 (random per primitive)

**Output:** `<g>` element containing multiple shapes

## SVG Builder Utilities

### createSVGElement

```typescript
function createSVGElement(
  tag: string,
  attributes: Record<string, string | number>
): SVGElement;
```

Creates an SVG element with specified attributes.

### createPolygonPath

```typescript
function createPolygonPath(
  sides: number,
  centerX: number,
  centerY: number,
  radius: number,
  rotation: number,
  irregularity: number
): Point[];
```

Generates polygon vertices with optional irregularity.

### createBezierPath

```typescript
function createBezierPath(
  points: BezierControlPoint[],
  closed: boolean
): string;
```

Creates SVG path data string from Bézier control points.

### pointsToPathData

```typescript
function pointsToPathData(points: Point[], closed: boolean): string;
```

Converts array of points to SVG path data string.

## Error Handling

### Error Scenarios

1. **Illustration elements not found**
   - Log warning message
   - Continue execution (graceful degradation)
   - No errors thrown

2. **SVG creation fails**
   - Log error with details
   - Leave original div element intact
   - Continue with other elements

3. **Shape generation fails**
   - Log error with generator name
   - Fall back to simple circle shape
   - Continue execution

4. **Invalid configuration**
   - Use default values
   - Log warning about invalid config
   - Continue with defaults

### Error Logging

```typescript
private handleError(context: string, error: Error): void {
  if (this.config.debug) {
    console.error(`[SVGIllustration] ${context}:`, error);
  }
}
```

## Testing Strategy

### Unit Testing Approach

1. **Shape Generator Tests**
   - Test each generator with fixed seed
   - Verify output is valid SVG
   - Verify shapes are within bounds
   - Test edge cases (min/max parameters)

2. **Random Number Generator Tests**
   - Test seeded generation is reproducible
   - Test random ranges are correct
   - Test distribution is uniform

3. **SVG Builder Tests**
   - Test element creation
   - Test attribute setting
   - Test path data generation

4. **Integration Tests**
   - Test full initialization flow
   - Test element replacement
   - Test with/without rotation class
   - Test multiple elements

### Manual Testing Checklist

- [ ] Shapes appear on page load
- [ ] Shapes are different on each refresh
- [ ] Shapes work with front card face
- [ ] Shapes work with back card face (rotation)
- [ ] Shapes respect border-radius clipping
- [ ] No console errors
- [ ] Performance is acceptable (<100ms init)
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Works on mobile devices
- [ ] Card animations still work correctly

### Test Utilities

```typescript
// For testing with fixed seed
initSVGIllustration({ seed: 12345, debug: true });

// For testing specific shape types
const generator = new SVGIllustrationGenerator({ debug: true });
generator['generateGeometricPolygon'](config); // Access private method for testing
```

## Performance Considerations

### Optimization Strategies

1. **Lazy Initialization**
   - Only initialize when Webflow is ready
   - Only process elements that exist

2. **Efficient DOM Manipulation**
   - Create SVG elements in memory first
   - Single DOM operation per replacement
   - No layout thrashing

3. **Shape Complexity Limits**
   - Max 12 sides for polygons
   - Max 8 control points for blobs
   - Max 5 primitives for abstract forms

4. **Memory Management**
   - No global state retention
   - Clean up references after initialization
   - No event listeners (static shapes)

### Performance Targets

- **Initialization**: < 100ms total
- **Shape Generation**: < 50ms per shape
- **DOM Replacement**: < 10ms per element
- **Memory**: < 1MB additional

## Browser Compatibility

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari 14+
- Chrome Mobile 90+

### SVG Features Used

- `<svg>` element ✓ (Universal support)
- `<polygon>` element ✓ (Universal support)
- `<path>` element with Bézier curves ✓ (Universal support)
- `<g>` grouping ✓ (Universal support)
- `<circle>` and `<rect>` ✓ (Universal support)
- `viewBox` attribute ✓ (Universal support)
- `transform` attribute ✓ (Universal support)

### Fallback Strategy

If SVG is not supported (extremely rare):
- Leave original div element
- Log warning message
- No visual breakage

## Integration Points

### 1. Webflow Initialization

```typescript
// src/index.ts
import { initSVGIllustration } from '$utils/svg-illustration-generator';

window.Webflow ||= [];
window.Webflow.push(() => {
  // ... existing initializations ...
  
  // Initialize SVG illustrations
  initSVGIllustration({
    debug: true, // Enable in development
  });
});
```

### 2. Card Info Mapper Integration

The illustration elements are already mapped in `CardInfoMapper`:

```typescript
// src/utils/card-info-mapper.ts
export enum CardInfoAttribute {
  ILUSTRATION = 'ilustration',
}
```

No changes needed to existing mapper - SVG replacement happens after mapper initialization.

### 3. CSS Compatibility

Existing CSS will work with SVG elements:

```css
.ilustration-center {
  background-color: #382c10; /* Still applies to container */
  border-radius: 13px; /* Clips SVG content */
  width: 120px;
  height: 120px;
  /* ... other styles ... */
}
```

The SVG will inherit the container's dimensions and clipping.

## Design Decisions

### Decision 1: Single Module vs Multiple Files

**Decision:** Single module file (`svg-illustration-generator.ts`)

**Rationale:**
- Feature is cohesive and self-contained
- Total code size is manageable (~500-700 lines)
- Easier to maintain and understand
- Follows existing pattern (see `typebot-name-replacer.ts`)

### Decision 2: Class-Based vs Functional

**Decision:** Class-based with functional init wrapper

**Rationale:**
- Matches existing codebase patterns
- Encapsulates state (random generator, config)
- Easier to test and extend
- Provides clean public API via init function

### Decision 3: Shape Selection Strategy

**Decision:** Random selection with equal probability

**Rationale:**
- Simplest implementation
- Ensures variety
- Can be extended later with weighted selection
- No user preference to consider

### Decision 4: Color Strategy

**Decision:** Single brand color with opacity variation

**Rationale:**
- Maintains brand consistency
- Simpler implementation
- Opacity provides visual variety
- Matches existing design system

### Decision 5: Seeded Random Generator

**Decision:** Implement custom seeded RNG

**Rationale:**
- Enables reproducible testing
- Math.random() is not seedable
- Lightweight implementation
- Full control over randomization

## Future Enhancements

Potential future improvements (out of scope for initial implementation):

1. **Additional Shape Types**
   - Spirals
   - Fractals
   - Line patterns
   - Gradient fills

2. **Animation Support**
   - Subtle morphing between shapes
   - Rotation animations
   - Opacity transitions

3. **User Preferences**
   - Shape type selection
   - Color customization
   - Complexity settings

4. **Performance Monitoring**
   - Generation time tracking
   - Performance metrics logging

5. **A/B Testing Support**
   - Track which shapes perform better
   - User engagement metrics

