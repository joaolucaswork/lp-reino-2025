/**
 * SVG Illustration Generator
 *
 * Transforms static illustration div elements into dynamic SVG elements
 * that display randomly generated abstract shapes on each page load.
 *
 * Features:
 * - Replaces [card-info="ilustration"] div elements with SVG
 * - Generates unique abstract shapes using multiple algorithms
 * - Supports geometric polygons, organic blobs, and abstract forms
 * - Infinite variety through algorithmic generation
 * - Seeded random generation for reproducible testing
 * - Maintains existing styling and positioning
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Configuration for SVG illustration generator
 */
export interface SVGIllustrationConfig {
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

/**
 * Shape generator function interface
 */
export interface ShapeGenerator {
  /** Name of the shape generator */
  name: string;
  /** Generate SVG element(s) */
  generate: (config: ShapeConfig) => SVGElement | SVGElement[];
}

/**
 * Configuration passed to shape generators
 */
export interface ShapeConfig {
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

/**
 * 2D point coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Bézier curve control point with handles
 */
export interface BezierControlPoint {
  /** Main point position */
  point: Point;
  /** First control point (incoming curve) */
  controlPoint1: Point;
  /** Second control point (outgoing curve) */
  controlPoint2: Point;
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_CONFIG: Required<SVGIllustrationConfig> = {
  illustrationSelector: '[card-info="ilustration"]',
  viewBox: { width: 120, height: 120 },
  brandColor: '#daa521',
  opacityRange: { min: 0.3, max: 0.8 },
  seed: Date.now(),
  debug: false,
};

// ============================================================================
// Seeded Random Number Generator
// ============================================================================

/**
 * Seeded random number generator for reproducible randomization
 * Uses Linear Congruential Generator (LCG) algorithm
 */
export class SeededRandom {
  private seed: number;

  /**
   * Create a new seeded random generator
   * @param seed Initial seed value (defaults to current timestamp)
   */
  constructor(seed?: number) {
    this.seed = seed ?? Date.now();
  }

  /**
   * Generate next random float between 0 and 1
   * @returns Random float in range [0, 1)
   */
  public next(): number {
    // LCG parameters (from Numerical Recipes)
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;

    this.seed = (a * this.seed + c) % m;
    return this.seed / m;
  }

  /**
   * Generate random integer between min and max (inclusive)
   * @param min Minimum value (inclusive)
   * @param max Maximum value (inclusive)
   * @returns Random integer in range [min, max]
   */
  public nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Generate random float between min and max
   * @param min Minimum value
   * @param max Maximum value
   * @returns Random float in range [min, max)
   */
  public nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Select random item from array
   * @param array Array to select from
   * @returns Random item from array
   */
  public choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

// ============================================================================
// SVG Builder Utilities
// ============================================================================

/**
 * Create an SVG element with specified attributes
 * @param tag SVG element tag name
 * @param attributes Object containing attribute key-value pairs
 * @returns Created SVG element
 */
function createSVGElement(tag: string, attributes: Record<string, string | number>): SVGElement {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, String(value));
  });

  return element;
}

/**
 * Convert array of points to SVG path data string
 * @param points Array of points
 * @param closed Whether to close the path
 * @returns SVG path data string
 */
function pointsToPathData(points: Point[], closed: boolean): string {
  if (points.length === 0) return '';

  let pathData = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i].x} ${points[i].y}`;
  }

  if (closed) {
    pathData += ' Z';
  }

  return pathData;
}

/**
 * Generate polygon vertices with optional irregularity
 * @param sides Number of polygon sides
 * @param centerX Center X coordinate
 * @param centerY Center Y coordinate
 * @param radius Polygon radius
 * @param rotation Rotation angle in degrees
 * @param irregularity Amount of irregularity (0-1)
 * @returns Array of polygon vertices
 */
function createPolygonPath(
  sides: number,
  centerX: number,
  centerY: number,
  radius: number,
  rotation: number,
  irregularity: number
): Point[] {
  const points: Point[] = [];
  const angleStep = (Math.PI * 2) / sides;
  const rotationRad = (rotation * Math.PI) / 180;

  for (let i = 0; i < sides; i++) {
    const angle = angleStep * i + rotationRad;
    // Add irregularity by varying the radius slightly
    const irregularOffset = irregularity * (Math.random() - 0.5) * radius;
    const r = radius + irregularOffset;

    points.push({
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    });
  }

  return points;
}

/**
 * Create SVG path data from Bézier control points
 * @param points Array of Bézier control points
 * @param closed Whether to close the path
 * @returns SVG path data string
 */
function createBezierPath(points: BezierControlPoint[], closed: boolean): string {
  if (points.length === 0) return '';

  const first = points[0];
  let pathData = `M ${first.point.x} ${first.point.y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    pathData += ` C ${prev.controlPoint2.x} ${prev.controlPoint2.y}, ${curr.controlPoint1.x} ${curr.controlPoint1.y}, ${curr.point.x} ${curr.point.y}`;
  }

  if (closed && points.length > 1) {
    const last = points[points.length - 1];
    pathData += ` C ${last.controlPoint2.x} ${last.controlPoint2.y}, ${first.controlPoint1.x} ${first.controlPoint1.y}, ${first.point.x} ${first.point.y}`;
  }

  if (closed) {
    pathData += ' Z';
  }

  return pathData;
}

// ============================================================================
// Shape Generators
// ============================================================================

/**
 * Generate a star shape with rounded points
 * Creates stars with 4-12 points, random scale, rotation, and distortion
 * @param config Shape configuration
 * @returns SVG path element
 */
function generateRoundedStar(config: ShapeConfig): SVGElement {
  const { width, height, color, opacity, random } = config;

  // Random parameters
  const points = random.nextInt(4, 12); // Number of star points
  const scale = random.nextFloat(0.6, 1.0);
  const rotation = random.nextFloat(0, 360);
  const innerRadiusRatio = random.nextFloat(0.3, 0.6); // How deep the star points go
  const pointDistortion = random.nextFloat(0, 0.3); // Distortion on individual points
  const roundness = random.nextFloat(0.1, 0.4); // How rounded the points are

  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = (Math.min(width, height) / 2) * scale;
  const innerRadius = outerRadius * innerRadiusRatio;

  // Generate star points with Bézier curves for roundness
  const bezierPoints: BezierControlPoint[] = [];
  const angleStep = (Math.PI * 2) / points;
  const rotationRad = (rotation * Math.PI) / 180;

  for (let i = 0; i < points; i++) {
    // Outer point (tip of star)
    const outerAngle = angleStep * i + rotationRad;
    const distortion = random.nextFloat(-pointDistortion, pointDistortion);
    const distortedOuterRadius = outerRadius * (1 + distortion);

    const outerPoint: Point = {
      x: centerX + distortedOuterRadius * Math.cos(outerAngle),
      y: centerY + distortedOuterRadius * Math.sin(outerAngle),
    };

    // Inner point (valley between star points)
    const innerAngle = outerAngle + angleStep / 2;
    const innerDistortion = random.nextFloat(-pointDistortion, pointDistortion);
    const distortedInnerRadius = innerRadius * (1 + innerDistortion);

    const innerPoint: Point = {
      x: centerX + distortedInnerRadius * Math.cos(innerAngle),
      y: centerY + distortedInnerRadius * Math.sin(innerAngle),
    };

    // Calculate control points for rounded outer point
    const controlDistance = distortedOuterRadius * roundness;
    const prevAngle = outerAngle - angleStep / 4;
    const nextAngle = outerAngle + angleStep / 4;

    const outerControl1: Point = {
      x: outerPoint.x + controlDistance * Math.cos(prevAngle),
      y: outerPoint.y + controlDistance * Math.sin(prevAngle),
    };

    const outerControl2: Point = {
      x: outerPoint.x + controlDistance * Math.cos(nextAngle),
      y: outerPoint.y + controlDistance * Math.sin(nextAngle),
    };

    bezierPoints.push({
      point: outerPoint,
      controlPoint1: outerControl1,
      controlPoint2: outerControl2,
    });

    // Add inner point with slight rounding
    const innerControlDistance = distortedInnerRadius * roundness * 0.5;
    const innerPrevAngle = innerAngle - angleStep / 4;
    const innerNextAngle = innerAngle + angleStep / 4;

    const innerControl1: Point = {
      x: innerPoint.x + innerControlDistance * Math.cos(innerPrevAngle),
      y: innerPoint.y + innerControlDistance * Math.sin(innerPrevAngle),
    };

    const innerControl2: Point = {
      x: innerPoint.x + innerControlDistance * Math.cos(innerNextAngle),
      y: innerPoint.y + innerControlDistance * Math.sin(innerNextAngle),
    };

    bezierPoints.push({
      point: innerPoint,
      controlPoint1: innerControl1,
      controlPoint2: innerControl2,
    });
  }

  const pathData = createBezierPath(bezierPoints, true);

  return createSVGElement('path', {
    d: pathData,
    fill: color,
    'fill-opacity': opacity,
  });
}

/**
 * Generate a star with subtle variations
 * Creates stars with slight variations in point length and roundness
 * @param config Shape configuration
 * @returns SVG path element
 */
function generateVariantStar(config: ShapeConfig): SVGElement {
  const { width, height, color, opacity, random } = config;

  // Random parameters with more variation
  const points = random.nextInt(5, 10); // 5-10 points
  const scale = random.nextFloat(0.65, 0.95);
  const rotation = random.nextFloat(0, 360);
  const innerRadiusRatio = random.nextFloat(0.35, 0.55);
  const pointDistortion = random.nextFloat(0.1, 0.4); // More distortion
  const roundness = random.nextFloat(0.15, 0.35);

  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = (Math.min(width, height) / 2) * scale;
  const innerRadius = outerRadius * innerRadiusRatio;

  const bezierPoints: BezierControlPoint[] = [];
  const angleStep = (Math.PI * 2) / points;
  const rotationRad = (rotation * Math.PI) / 180;

  for (let i = 0; i < points; i++) {
    const outerAngle = angleStep * i + rotationRad;
    const distortion = random.nextFloat(-pointDistortion, pointDistortion);
    const distortedOuterRadius = outerRadius * (1 + distortion);

    const outerPoint: Point = {
      x: centerX + distortedOuterRadius * Math.cos(outerAngle),
      y: centerY + distortedOuterRadius * Math.sin(outerAngle),
    };

    const innerAngle = outerAngle + angleStep / 2;
    const innerDistortion = random.nextFloat(-pointDistortion, pointDistortion);
    const distortedInnerRadius = innerRadius * (1 + innerDistortion);

    const innerPoint: Point = {
      x: centerX + distortedInnerRadius * Math.cos(innerAngle),
      y: centerY + distortedInnerRadius * Math.sin(innerAngle),
    };

    const controlDistance = distortedOuterRadius * roundness;
    const prevAngle = outerAngle - angleStep / 4;
    const nextAngle = outerAngle + angleStep / 4;

    bezierPoints.push({
      point: outerPoint,
      controlPoint1: {
        x: outerPoint.x + controlDistance * Math.cos(prevAngle),
        y: outerPoint.y + controlDistance * Math.sin(prevAngle),
      },
      controlPoint2: {
        x: outerPoint.x + controlDistance * Math.cos(nextAngle),
        y: outerPoint.y + controlDistance * Math.sin(nextAngle),
      },
    });

    const innerControlDistance = distortedInnerRadius * roundness * 0.5;
    const innerPrevAngle = innerAngle - angleStep / 4;
    const innerNextAngle = innerAngle + angleStep / 4;

    bezierPoints.push({
      point: innerPoint,
      controlPoint1: {
        x: innerPoint.x + innerControlDistance * Math.cos(innerPrevAngle),
        y: innerPoint.y + innerControlDistance * Math.sin(innerPrevAngle),
      },
      controlPoint2: {
        x: innerPoint.x + innerControlDistance * Math.cos(innerNextAngle),
        y: innerPoint.y + innerControlDistance * Math.sin(innerNextAngle),
      },
    });
  }

  const pathData = createBezierPath(bezierPoints, true);

  return createSVGElement('path', {
    d: pathData,
    fill: color,
    'fill-opacity': opacity,
  });
}

/**
 * Generate a star with extreme distortion
 * Creates stars with more dramatic variations in point lengths
 * @param config Shape configuration
 * @returns SVG path element
 */
function generateDistortedStar(config: ShapeConfig): SVGElement {
  const { width, height, color, opacity, random } = config;

  // Random parameters with extreme variation
  const points = random.nextInt(4, 8); // 4-8 points
  const scale = random.nextFloat(0.7, 1.0);
  const rotation = random.nextFloat(0, 360);
  const innerRadiusRatio = random.nextFloat(0.25, 0.5);
  const pointDistortion = random.nextFloat(0.2, 0.6); // Extreme distortion
  const roundness = random.nextFloat(0.2, 0.5);

  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = (Math.min(width, height) / 2) * scale;
  const innerRadius = outerRadius * innerRadiusRatio;

  const bezierPoints: BezierControlPoint[] = [];
  const angleStep = (Math.PI * 2) / points;
  const rotationRad = (rotation * Math.PI) / 180;

  for (let i = 0; i < points; i++) {
    const outerAngle = angleStep * i + rotationRad;
    const distortion = random.nextFloat(-pointDistortion, pointDistortion);
    const distortedOuterRadius = outerRadius * (1 + distortion);

    const outerPoint: Point = {
      x: centerX + distortedOuterRadius * Math.cos(outerAngle),
      y: centerY + distortedOuterRadius * Math.sin(outerAngle),
    };

    const innerAngle = outerAngle + angleStep / 2;
    const innerDistortion = random.nextFloat(-pointDistortion, pointDistortion);
    const distortedInnerRadius = innerRadius * (1 + innerDistortion);

    const innerPoint: Point = {
      x: centerX + distortedInnerRadius * Math.cos(innerAngle),
      y: centerY + distortedInnerRadius * Math.sin(innerAngle),
    };

    const controlDistance = distortedOuterRadius * roundness;
    const prevAngle = outerAngle - angleStep / 4;
    const nextAngle = outerAngle + angleStep / 4;

    bezierPoints.push({
      point: outerPoint,
      controlPoint1: {
        x: outerPoint.x + controlDistance * Math.cos(prevAngle),
        y: outerPoint.y + controlDistance * Math.sin(prevAngle),
      },
      controlPoint2: {
        x: outerPoint.x + controlDistance * Math.cos(nextAngle),
        y: outerPoint.y + controlDistance * Math.sin(nextAngle),
      },
    });

    const innerControlDistance = distortedInnerRadius * roundness * 0.5;
    const innerPrevAngle = innerAngle - angleStep / 4;
    const innerNextAngle = innerAngle + angleStep / 4;

    bezierPoints.push({
      point: innerPoint,
      controlPoint1: {
        x: innerPoint.x + innerControlDistance * Math.cos(innerPrevAngle),
        y: innerPoint.y + innerControlDistance * Math.sin(innerPrevAngle),
      },
      controlPoint2: {
        x: innerPoint.x + innerControlDistance * Math.cos(innerNextAngle),
        y: innerPoint.y + innerControlDistance * Math.sin(innerNextAngle),
      },
    });
  }

  const pathData = createBezierPath(bezierPoints, true);

  return createSVGElement('path', {
    d: pathData,
    fill: color,
    'fill-opacity': opacity,
  });
}

// ============================================================================
// Main SVGIllustrationGenerator Class
// ============================================================================

/**
 * SVG Illustration Generator
 * Main class for replacing illustration divs with dynamic SVG shapes
 */
export class SVGIllustrationGenerator {
  private config: Required<SVGIllustrationConfig>;
  private random: SeededRandom;
  private shapeGenerators: ShapeGenerator[];

  /**
   * Create a new SVG illustration generator
   * @param config Optional configuration (merged with defaults)
   */
  constructor(config: SVGIllustrationConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.random = new SeededRandom(this.config.seed);

    // Initialize shape generators - all star variations
    this.shapeGenerators = [
      { name: 'Rounded Star', generate: generateRoundedStar },
      { name: 'Variant Star', generate: generateVariantStar },
      { name: 'Distorted Star', generate: generateDistortedStar },
    ];
  }

  /**
   * Initialize and replace all illustration elements
   */
  public init(): void {
    try {
      this.log('Initializing SVG Illustration Generator...');
      const startTime = performance.now();

      this.replaceIllustrationElements();

      const endTime = performance.now();
      this.log(`Initialization complete in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      this.handleError('Initialization failed', error as Error);
    }
  }

  /**
   * Regenerate all star illustrations with new random shapes
   * Useful for refreshing illustrations without page reload
   * Maintains the current theme color if set by the color switcher
   * @param seed Optional seed for deterministic generation (e.g., from user name)
   * @param shapeIndex Optional shape generator index (0-2) to use specific shape type
   */
  public regenerate(seed?: number, shapeIndex?: number): void {
    try {
      this.log('Regenerating star illustrations...');
      const startTime = performance.now();

      // Use provided seed or generate new one
      const useSeed = seed !== undefined ? seed : Date.now();
      this.random = new SeededRandom(useSeed);

      if (seed !== undefined) {
        this.log(`Using deterministic seed: ${seed}`);
      }
      if (shapeIndex !== undefined) {
        this.log(`Using specific shape generator index: ${shapeIndex}`);
      }

      // Get current theme color from card data attribute (set by color switcher)
      const currentThemeColor = this.getCurrentThemeColor();

      // Find all existing SVG illustrations and regenerate them
      const svgElements = document.querySelectorAll<SVGSVGElement>(
        `${this.config.illustrationSelector}`
      );

      if (svgElements.length === 0) {
        this.log('No illustration elements found to regenerate');
        return;
      }

      this.log(`Regenerating ${svgElements.length} illustration(s)`);
      if (currentThemeColor) {
        this.log(`Using current theme color: ${currentThemeColor}`);
      }

      svgElements.forEach((svgElement, index) => {
        try {
          const hasRotationClass = svgElement.classList.contains('rotation');

          // Clear existing content
          while (svgElement.firstChild) {
            svgElement.removeChild(svgElement.firstChild);
          }

          // Generate new shape with current theme color (or default brand color)
          const { viewBox, brandColor, opacityRange } = this.config;
          const shapeConfig: ShapeConfig = {
            width: viewBox.width,
            height: viewBox.height,
            color: currentThemeColor || brandColor, // Use theme color if available
            opacity: this.random.nextFloat(opacityRange.min, opacityRange.max),
            random: this.random,
          };

          const shape = this.selectAndGenerateShape(shapeConfig, shapeIndex);

          // Append new shape(s) to SVG
          if (Array.isArray(shape)) {
            shape.forEach((s) => svgElement.appendChild(s));
          } else {
            svgElement.appendChild(shape);
          }

          this.log(`Regenerated illustration ${index + 1}/${svgElements.length}`);
        } catch (error) {
          this.handleError(`Failed to regenerate element ${index + 1}`, error as Error);
        }
      });

      const endTime = performance.now();
      this.log(`Regeneration complete in ${(endTime - startTime).toFixed(2)}ms`);
    } catch (error) {
      this.handleError('Regeneration failed', error as Error);
    }
  }

  /**
   * Get the current theme color from the card's data attribute
   * This is set by the CardColorSwitcher when a theme is applied
   * @returns Current theme SVG color or null if not set
   */
  private getCurrentThemeColor(): string | null {
    try {
      // Query the main profile card
      const card = document.querySelector<HTMLElement>('.profile-card_wrapper[is-main="true"]');
      if (!card) {
        this.log('Card element not found, using default color');
        return null;
      }

      // Get the theme SVG color from data attribute
      const themeColor = card.getAttribute('data-theme-svg-color');
      if (themeColor) {
        this.log(`Found theme color in card data attribute: ${themeColor}`);
        return themeColor;
      }

      this.log('No theme color found in card data attribute, using default');
      return null;
    } catch (error) {
      this.log('Error getting theme color:', error);
      return null;
    }
  }

  /**
   * Find and replace illustration div elements with SVG
   */
  private replaceIllustrationElements(): void {
    const elements = document.querySelectorAll<HTMLElement>(this.config.illustrationSelector);

    if (elements.length === 0) {
      this.log('No illustration elements found');
      return;
    }

    this.log(`Found ${elements.length} illustration element(s)`);

    elements.forEach((element, index) => {
      try {
        const hasRotationClass = element.classList.contains('rotation');
        const svg = this.createSVGElement(hasRotationClass);

        // Copy attributes from div to SVG
        Array.from(element.attributes).forEach((attr) => {
          svg.setAttribute(attr.name, attr.value);
        });

        // Replace div with SVG
        element.parentNode?.replaceChild(svg, element);

        this.log(`Replaced illustration element ${index + 1}/${elements.length}`);
      } catch (error) {
        this.handleError(`Failed to replace element ${index + 1}`, error as Error);
      }
    });
  }

  /**
   * Create an SVG element with generated shape
   * @param hasRotationClass Whether the element has rotation class (affects shape selection)
   * @returns Complete SVG element with shape
   */
  private createSVGElement(hasRotationClass: boolean): SVGSVGElement {
    const { viewBox, brandColor, opacityRange } = this.config;

    // Create SVG container
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
    svg.setAttribute('viewBox', `0 0 ${viewBox.width} ${viewBox.height}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Generate shape
    const shapeConfig: ShapeConfig = {
      width: viewBox.width,
      height: viewBox.height,
      color: brandColor,
      opacity: this.random.nextFloat(opacityRange.min, opacityRange.max),
      random: this.random,
    };

    const shape = this.selectAndGenerateShape(shapeConfig);

    // Append shape(s) to SVG
    if (Array.isArray(shape)) {
      shape.forEach((s) => svg.appendChild(s));
    } else {
      svg.appendChild(shape);
    }

    return svg;
  }

  /**
   * Select a random shape generator and generate shape
   * @param config Shape configuration
   * @param shapeIndex Optional specific shape generator index to use
   * @returns Generated SVG element(s)
   */
  private selectAndGenerateShape(
    config: ShapeConfig,
    shapeIndex?: number
  ): SVGElement | SVGElement[] {
    try {
      // Use specific shape generator if index provided, otherwise random
      const generator =
        shapeIndex !== undefined && shapeIndex >= 0 && shapeIndex < this.shapeGenerators.length
          ? this.shapeGenerators[shapeIndex]
          : this.random.choice(this.shapeGenerators);

      this.log(`Selected generator: ${generator.name}`);

      const startTime = performance.now();
      const shape = generator.generate(config);
      const endTime = performance.now();

      this.log(`Shape generated in ${(endTime - startTime).toFixed(2)}ms`);

      return shape;
    } catch (error) {
      this.handleError('Shape generation failed, falling back to circle', error as Error);

      // Fallback to simple circle
      return createSVGElement('circle', {
        cx: config.width / 2,
        cy: config.height / 2,
        r: Math.min(config.width, config.height) / 3,
        fill: config.color,
        'fill-opacity': config.opacity,
      });
    }
  }

  /**
   * Log debug messages
   * @param args Arguments to log
   */
  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[SVGIllustration]', ...args);
    }
  }

  /**
   * Handle and log errors
   * @param context Error context
   * @param error Error object
   */
  private handleError(context: string, error: Error): void {
    if (this.config.debug) {
      console.error(`[SVGIllustration] ${context}:`, error);
    }
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Initialize SVG illustration generator with optional configuration
 * Also sets up listeners for card rotation and name-based personalization events
 * @param config Optional configuration
 * @returns SVGIllustrationGenerator instance
 */
export function initSVGIllustration(config: SVGIllustrationConfig = {}): SVGIllustrationGenerator {
  const generator = new SVGIllustrationGenerator(config);
  generator.init();

  // Store the last personalization data for use during card rotation
  let lastPersonalization: { seed: number; shapeIndex: number } | null = null;

  // Listen for user name personalization events
  document.addEventListener('user-name-personalization', ((event: CustomEvent) => {
    if (config.debug) {
      console.log('[SVGIllustration] User name personalization detected:', event.detail);
    }

    const { seed, shapeIndex } = event.detail;

    // Store personalization data
    lastPersonalization = { seed, shapeIndex };

    // Regenerate with name-based seed and shape
    generator.regenerate(seed, shapeIndex);
  }) as EventListener);

  // Listen for card rotation toggle events to regenerate stars
  document.addEventListener('card-rotation-toggle', () => {
    if (config.debug) {
      console.log('[SVGIllustration] Card rotation detected, regenerating stars...');
    }

    // If we have personalization data, use it to maintain the user's unique shape
    if (lastPersonalization) {
      if (config.debug) {
        console.log('[SVGIllustration] Maintaining personalized shape during rotation');
      }
      generator.regenerate(lastPersonalization.seed, lastPersonalization.shapeIndex);
    } else {
      // No personalization, regenerate with random
      generator.regenerate();
    }
  });

  return generator;
}
