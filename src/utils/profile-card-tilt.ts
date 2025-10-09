import VanillaTilt from 'vanilla-tilt';

/**
 * Configuration options for the profile card tilt effect
 */
export interface ProfileCardTiltConfig {
  /**
   * CSS selector for the profile card element
   * @default '.profile-card_wrapper[is-main="true"]'
   */
  cardSelector?: string;

  /**
   * Maximum tilt rotation in degrees
   * @default 15
   */
  max?: number;

  /**
   * Speed of the enter/exit transition in milliseconds
   * @default 400
   */
  speed?: number;

  /**
   * Transform perspective (lower = more extreme tilt)
   * @default 1000
   */
  perspective?: number;

  /**
   * Scale factor on hover (1 = no scale, 1.02 = 2% larger)
   * @default 1.02
   */
  scale?: number;

  /**
   * Enable glare/shine effect
   * @default true
   */
  glare?: boolean;

  /**
   * Maximum glare opacity (0 to 1)
   * @default 0.5
   */
  maxGlare?: number;

  /**
   * Minimum window width to enable tilt effect (responsive breakpoint)
   * @default 992
   */
  minWidth?: number;

  /**
   * CSS class name that indicates the card is rotated (flipped)
   * When this class is present, tilt effect will be disabled to prevent transform conflicts
   * @default 'rotate'
   */
  rotateClass?: string;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Default configuration for the profile card tilt effect
 */
const DEFAULT_CONFIG: Required<ProfileCardTiltConfig> = {
  cardSelector: '.profile-card_wrapper[is-main="true"]',
  max: 15,
  speed: 400,
  perspective: 1000,
  scale: 1.02,
  glare: true,
  maxGlare: 0.5,
  minWidth: 992,
  rotateClass: 'rotate',
  debug: false,
};

/**
 * Initializes the vanilla-tilt.js effect on the profile card with glare/shine effect.
 * The tilt effect is only enabled on desktop devices (width >= 992px) for optimal UX.
 *
 * @param config - Configuration options for the tilt effect
 * @returns Cleanup function to destroy the tilt instance
 *
 * @example
 * ```typescript
 * // Use default settings
 * initProfileCardTilt();
 *
 * // Custom configuration
 * initProfileCardTilt({
 *   max: 20,
 *   maxGlare: 0.8,
 *   debug: true
 * });
 * ```
 */
export function initProfileCardTilt(config?: ProfileCardTiltConfig): () => void {
  const settings = { ...DEFAULT_CONFIG, ...config };

  if (settings.debug) {
    console.log('[ProfileCardTilt] Initializing with config:', settings);
  }

  // Find the profile card element
  const cardElement = document.querySelector<HTMLElement>(settings.cardSelector);

  if (!cardElement) {
    if (settings.debug) {
      console.warn(
        `[ProfileCardTilt] Card element not found with selector: ${settings.cardSelector}`
      );
    }
    return () => {}; // Return empty cleanup function
  }

  if (settings.debug) {
    console.log('[ProfileCardTilt] Card element found:', cardElement);
  }

  /**
   * Track whether tilt is currently active
   */
  let isTiltActive = false;

  /**
   * Check if the current viewport width is above the minimum threshold
   */
  const isDesktop = (): boolean => {
    return window.innerWidth >= settings.minWidth;
  };

  /**
   * Check if the card is currently rotated (has the rotate class)
   */
  const isCardRotated = (): boolean => {
    return cardElement.classList.contains(settings.rotateClass);
  };

  /**
   * Initialize the tilt effect
   * Only initializes if desktop viewport and card is not rotated
   */
  const initTilt = (): void => {
    // Don't initialize if already active
    if (isTiltActive) {
      if (settings.debug) {
        console.log('[ProfileCardTilt] Tilt already active, skipping initialization');
      }
      return;
    }

    // Don't initialize if viewport is too small
    if (!isDesktop()) {
      if (settings.debug) {
        console.log(
          `[ProfileCardTilt] Viewport width (${window.innerWidth}px) is below minimum (${settings.minWidth}px). Tilt disabled.`
        );
      }
      return;
    }

    // Don't initialize if card is rotated (to prevent transform conflicts)
    if (isCardRotated()) {
      if (settings.debug) {
        console.log(
          '[ProfileCardTilt] Card is rotated (has rotate class). Tilt disabled to prevent transform conflicts.'
        );
      }
      return;
    }

    if (settings.debug) {
      console.log('[ProfileCardTilt] Initializing tilt effect on desktop viewport');
    }

    // Initialize VanillaTilt with configured options
    VanillaTilt.init(cardElement, {
      max: settings.max,
      speed: settings.speed,
      perspective: settings.perspective,
      scale: settings.scale,
      glare: settings.glare,
      'max-glare': settings.maxGlare,
      transition: true,
      reset: true,
      easing: 'cubic-bezier(.03,.98,.52,.99)',
    });

    isTiltActive = true;

    if (settings.debug) {
      console.log('[ProfileCardTilt] Tilt effect initialized successfully');
    }
  };

  /**
   * Type definition for VanillaTilt instance attached to HTMLElement
   */
  interface VanillaTiltElement extends HTMLElement {
    vanillaTilt?: {
      destroy: () => void;
    };
  }

  /**
   * Destroy the tilt effect
   */
  const destroyTilt = (): void => {
    if (!isTiltActive) {
      return; // Already destroyed or never initialized
    }

    const tiltElement = cardElement as VanillaTiltElement;
    if (tiltElement.vanillaTilt) {
      tiltElement.vanillaTilt.destroy();
      isTiltActive = false;
      if (settings.debug) {
        console.log('[ProfileCardTilt] Tilt effect destroyed');
      }
    }
  };

  // Initialize tilt on load
  initTilt();

  /**
   * Setup MutationObserver to watch for rotation class changes
   * This prevents transform conflicts between tilt and card rotation
   */
  const setupRotationObserver = (): MutationObserver => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const hasRotateClass = isCardRotated();

          if (hasRotateClass && isTiltActive) {
            // Card is being rotated, disable tilt to prevent transform conflict
            if (settings.debug) {
              console.log(
                '[ProfileCardTilt] Rotate class detected. Disabling tilt to prevent transform conflicts.'
              );
            }
            destroyTilt();
          } else if (!hasRotateClass && !isTiltActive && isDesktop()) {
            // Card rotation removed and we're on desktop, re-enable tilt
            if (settings.debug) {
              console.log('[ProfileCardTilt] Rotate class removed. Re-enabling tilt effect.');
            }
            initTilt();
          }
        }
      }
    });

    // Start observing class attribute changes
    observer.observe(cardElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    if (settings.debug) {
      console.log('[ProfileCardTilt] Rotation observer initialized');
    }

    return observer;
  };

  const rotationObserver = setupRotationObserver();

  // Handle window resize to enable/disable tilt based on viewport width
  let resizeTimeout: number | undefined;
  const handleResize = (): void => {
    // Debounce resize events
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    resizeTimeout = window.setTimeout(() => {
      const tiltElement = cardElement as VanillaTiltElement;
      const wasInitialized = !!tiltElement.vanillaTilt;
      const shouldBeInitialized = isDesktop();

      if (wasInitialized && !shouldBeInitialized) {
        // Viewport became too small, destroy tilt
        destroyTilt();
        if (settings.debug) {
          console.log('[ProfileCardTilt] Viewport resized below threshold. Tilt disabled.');
        }
      } else if (!wasInitialized && shouldBeInitialized) {
        // Viewport became large enough, initialize tilt
        initTilt();
        if (settings.debug) {
          console.log('[ProfileCardTilt] Viewport resized above threshold. Tilt enabled.');
        }
      }
    }, 250);
  };

  window.addEventListener('resize', handleResize);

  // Return cleanup function
  return () => {
    // Disconnect rotation observer
    rotationObserver.disconnect();

    // Remove resize listener
    window.removeEventListener('resize', handleResize);
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    // Destroy tilt instance
    destroyTilt();

    if (settings.debug) {
      console.log('[ProfileCardTilt] Cleanup completed (observer disconnected, tilt destroyed)');
    }
  };
}
