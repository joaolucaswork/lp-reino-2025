/**
 * Card Color Switcher
 *
 * Implements an interactive color-switching feature for the profile card.
 * Clicking the visual block element cycles through different investment category color themes.
 *
 * Features:
 * - Cycles through 7 investment category color themes
 * - Automatically adjusts text colors for proper contrast
 * - Updates all card elements including borders, backgrounds, and text
 * - Maintains glassmorphism effect with semi-transparent backgrounds
 * - Smooth color transitions
 */

/**
 * Color theme interface for investment categories
 */
interface ColorTheme {
  /** Category name */
  name: string;
  /** Main background color (will be converted to rgba with transparency) */
  backgroundColor: string;
  /** Border color for card and info elements */
  borderColor: string;
  /** Text color (light or dark based on background) */
  textColor: string;
  /** Visual block background color */
  visualBlockColor: string;
}

/**
 * Configuration for card color switcher
 */
interface CardColorSwitcherConfig {
  /** Selector for the main card container */
  cardSelector?: string;
  /** Selector for the clickable visual block element */
  visualBlockSelector?: string;
  /** Selector for the info-data element */
  infoDataSelector?: string;
  /** Background opacity (0-1) */
  backgroundOpacity?: number;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<CardColorSwitcherConfig> = {
  cardSelector: '.profile-card_wrapper[is-main="true"]',
  visualBlockSelector: '[card-info="mini"].visual-block-card',
  infoDataSelector: '.info-data',
  backgroundOpacity: 0.64,
  debug: false,
};

/**
 * Investment category color themes
 * Based on the color palette from docs/paleta-cores.md
 *
 * Each theme uses a monochromatic color scheme:
 * - Background: Base category color (with transparency applied)
 * - Text: Lighter variation of the same hue for readability
 * - Border: Lighter variation for visual hierarchy
 * - Visual Block: Lighter variation for contrast against background
 *
 * All colors maintain the same hue family, only varying in lightness.
 */
const COLOR_THEMES: ColorTheme[] = [
  {
    name: 'Renda Fixa',
    backgroundColor: '#a2883b', // Medium gold (HSL: 45°, 47%, 43%)
    borderColor: '#c9a84d', // Lighter gold (HSL: 45°, 47%, 55%)
    textColor: '#e5d4a0', // Light gold (HSL: 45°, 47%, 75%)
    visualBlockColor: '#c9a84d', // Lighter gold
  },
  {
    name: 'Fundo de Investimento',
    backgroundColor: '#e3ad0c', // Bright gold (HSL: 43°, 91%, 47%)
    borderColor: '#f5c93d', // Lighter gold (HSL: 43°, 91%, 60%)
    textColor: '#fce89f', // Very light gold (HSL: 43°, 91%, 80%)
    visualBlockColor: '#f5c93d', // Lighter gold
  },
  {
    name: 'Renda Variável',
    backgroundColor: '#5d4e2a', // Dark bronze (HSL: 42°, 38%, 26%)
    borderColor: '#9a8a5e', // Medium bronze (HSL: 42°, 38%, 50%)
    textColor: '#c9bc95', // Light bronze (HSL: 42°, 38%, 68%)
    visualBlockColor: '#9a8a5e', // Medium bronze
  },
  {
    name: 'Internacional',
    backgroundColor: '#bdaa6f', // Light gold (HSL: 45°, 40%, 59%)
    borderColor: '#d4c28f', // Lighter gold (HSL: 45°, 40%, 70%)
    textColor: '#ebe3c9', // Very light gold (HSL: 45°, 40%, 85%)
    visualBlockColor: '#d4c28f', // Lighter gold
  },
  {
    name: 'COE',
    backgroundColor: '#d17d00', // Dark orange (HSL: 36°, 100%, 41%)
    borderColor: '#f59d33', // Medium orange (HSL: 36°, 100%, 55%)
    textColor: '#ffc780', // Light orange (HSL: 36°, 100%, 75%)
    visualBlockColor: '#f59d33', // Medium orange
  },
  {
    name: 'Previdência',
    backgroundColor: '#8c5e00', // Dark brown (HSL: 40°, 100%, 27%)
    borderColor: '#b37d1a', // Medium brown (HSL: 40°, 100%, 40%)
    textColor: '#e0b324', // Light brown/gold (HSL: 40°, 100%, 55%)
    visualBlockColor: '#b37d1a', // Medium brown
  },
  {
    name: 'Outros',
    backgroundColor: '#4f4f4f', // Dark gray (HSL: 0°, 0%, 31%)
    borderColor: '#8c8c8c', // Medium gray (HSL: 0°, 0%, 55%)
    textColor: '#b3b3b3', // Light gray (HSL: 0°, 0%, 70%)
    visualBlockColor: '#8c8c8c', // Medium gray
  },
];

/**
 * Convert hex color to rgba with specified opacity
 * @param hex Hex color code (e.g., '#a2883b')
 * @param opacity Opacity value (0-1)
 * @returns RGBA color string
 */
const hexToRgba = (hex: string, opacity: number): string => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Parse RGB values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * CardColorSwitcher class
 * Manages color theme switching for the profile card
 */
export class CardColorSwitcher {
  private config: Required<CardColorSwitcherConfig>;
  private currentThemeIndex = 0;
  private isInitialized = false;
  private boundHandleClick: (event: Event) => void;

  constructor(config: CardColorSwitcherConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.boundHandleClick = this.handleVisualBlockClick.bind(this);

    // Initialize with random theme index
    this.currentThemeIndex = Math.floor(Math.random() * COLOR_THEMES.length);
  }

  /**
   * Log debug messages if debug mode is enabled
   */
  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[CardColorSwitcher]', ...args);
    }
  }

  /**
   * Apply a color theme to the card
   * @param theme The color theme to apply
   */
  private applyTheme(theme: ColorTheme): void {
    const card = document.querySelector<HTMLElement>(this.config.cardSelector);
    if (!card) {
      this.log('Card element not found');
      return;
    }

    // Convert background color to rgba with transparency
    const bgColorRgba = hexToRgba(theme.backgroundColor, this.config.backgroundOpacity);

    // Update main card styles
    card.style.backgroundColor = bgColorRgba;
    card.style.borderColor = theme.borderColor;
    card.style.color = theme.textColor;

    // Update ALL info-data elements (both front and back faces)
    const infoDataElements = card.querySelectorAll<HTMLElement>(this.config.infoDataSelector);
    if (infoDataElements.length > 0) {
      this.log(`Updating ${infoDataElements.length} info-data element(s)`);
      infoDataElements.forEach((infoData, index) => {
        infoData.style.color = theme.textColor;
        infoData.style.borderColor = theme.borderColor;
        this.log(`Updated info-data element ${index + 1}/${infoDataElements.length}`);
      });
    } else {
      this.log('No info-data elements found');
    }

    // Update visual block element
    const visualBlock = card.querySelector<HTMLElement>(this.config.visualBlockSelector);
    if (visualBlock) {
      visualBlock.style.backgroundColor = theme.visualBlockColor;
    }

    // Update SVG illustration colors
    this.updateSVGIllustrationColors(theme);

    // Store current theme name and SVG color as data attributes
    // This allows other modules (like SVG generator) to access the current theme color
    card.setAttribute('data-color-theme', theme.name);
    card.setAttribute('data-theme-svg-color', theme.visualBlockColor);

    this.log(`Applied theme: ${theme.name}`, theme);
  }

  /**
   * Update SVG illustration colors to match the current theme
   * @param theme The color theme to apply to SVG illustrations
   */
  private updateSVGIllustrationColors(theme: ColorTheme): void {
    // Find all SVG illustrations with card-info="ilustration"
    const svgElements = document.querySelectorAll<SVGSVGElement>('[card-info="ilustration"]');

    if (svgElements.length === 0) {
      this.log('No SVG illustration elements found');
      return;
    }

    this.log(`Updating ${svgElements.length} SVG illustration(s) with theme colors`);

    svgElements.forEach((svgElement, index) => {
      try {
        // Find all path elements within the SVG
        const pathElements = svgElement.querySelectorAll<SVGPathElement>('path');

        pathElements.forEach((path) => {
          // Update fill color to match theme's visual block color
          path.setAttribute('fill', theme.visualBlockColor);

          // Optionally adjust opacity for better visual effect
          const currentOpacity = path.getAttribute('fill-opacity');
          if (currentOpacity) {
            // Keep the existing opacity value
            path.setAttribute('fill-opacity', currentOpacity);
          }
        });

        this.log(`Updated SVG illustration ${index + 1}/${svgElements.length}`);
      } catch (error) {
        this.log(`Failed to update SVG illustration ${index + 1}:`, error);
      }
    });
  }

  /**
   * Cycle to the next color theme
   */
  private cycleTheme(): void {
    this.currentThemeIndex = (this.currentThemeIndex + 1) % COLOR_THEMES.length;
    const theme = COLOR_THEMES[this.currentThemeIndex];
    this.applyTheme(theme);
  }

  /**
   * Handle click event on visual block element
   * @param event The click event
   */
  private handleVisualBlockClick(event: Event): void {
    // Stop event propagation to prevent triggering other card interactions
    event.stopPropagation();
    event.preventDefault();

    this.log('Visual block clicked, cycling color theme');
    this.cycleTheme();
  }

  /**
   * Initialize the color switcher
   * Attaches click event listener to the visual block element
   * Applies a random theme on initialization
   */
  public init(): void {
    if (this.isInitialized) {
      this.log('Already initialized');
      return;
    }

    const card = document.querySelector<HTMLElement>(this.config.cardSelector);
    if (!card) {
      this.log('Card element not found, cannot initialize');
      return;
    }

    const visualBlock = card.querySelector<HTMLElement>(this.config.visualBlockSelector);
    if (!visualBlock) {
      this.log('Visual block element not found, cannot initialize');
      return;
    }

    // Add click event listener
    visualBlock.addEventListener('click', this.boundHandleClick);

    // Add cursor pointer to indicate clickability
    visualBlock.style.cursor = 'pointer';

    // Apply random initial theme (already set in constructor)
    const initialTheme = COLOR_THEMES[this.currentThemeIndex];
    this.applyTheme(initialTheme);
    this.log(
      `Initialized with random theme: ${initialTheme.name} (index: ${this.currentThemeIndex})`
    );

    this.isInitialized = true;
    this.log('Color switcher initialized');
  }

  /**
   * Set a specific theme by index
   * @param index Theme index (0-6)
   */
  public setTheme(index: number): void {
    if (index < 0 || index >= COLOR_THEMES.length) {
      this.log(`Invalid theme index: ${index}`);
      return;
    }

    this.currentThemeIndex = index;
    this.applyTheme(COLOR_THEMES[index]);
  }

  /**
   * Set a specific theme by category name
   * @param categoryName Category name (e.g., 'Renda Fixa')
   */
  public setThemeByName(categoryName: string): void {
    const index = COLOR_THEMES.findIndex((theme) => theme.name === categoryName);
    if (index === -1) {
      this.log(`Theme not found: ${categoryName}`);
      return;
    }

    this.setTheme(index);
  }

  /**
   * Get current theme
   * @returns Current color theme
   */
  public getCurrentTheme(): ColorTheme {
    return COLOR_THEMES[this.currentThemeIndex];
  }

  /**
   * Get all available themes
   * @returns Array of all color themes
   */
  public getAllThemes(): ColorTheme[] {
    return [...COLOR_THEMES];
  }

  /**
   * Remove event listeners and clean up
   */
  public destroy(): void {
    const card = document.querySelector<HTMLElement>(this.config.cardSelector);
    if (!card) {
      return;
    }

    const visualBlock = card.querySelector<HTMLElement>(this.config.visualBlockSelector);
    if (visualBlock) {
      visualBlock.removeEventListener('click', this.boundHandleClick);
      visualBlock.style.cursor = '';
    }

    this.isInitialized = false;
    this.log('Color switcher destroyed');
  }
}

/**
 * Initialize card color switcher with default configuration
 * Also sets up listener for name-based personalization events
 * @param config Optional configuration
 * @returns CardColorSwitcher instance
 */
export const initCardColorSwitcher = (config: CardColorSwitcherConfig = {}): CardColorSwitcher => {
  const switcher = new CardColorSwitcher(config);
  switcher.init();

  // Listen for user name personalization events to apply name-based theme
  document.addEventListener('user-name-personalization', ((event: CustomEvent) => {
    if (config.debug) {
      console.log('[CardColorSwitcher] User name personalization detected:', event.detail);
    }

    const { themeIndex, themeName } = event.detail;

    // Apply the name-based theme
    switcher.setTheme(themeIndex);

    if (config.debug) {
      console.log(
        `[CardColorSwitcher] Applied name-based theme: ${themeName} (index: ${themeIndex})`
      );
    }
  }) as EventListener);

  return switcher;
};
