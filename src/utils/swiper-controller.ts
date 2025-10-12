/**
 * Swiper Controller Utility
 *
 * This utility initializes and controls a Swiper instance for the landing page.
 * It listens for Typebot form completion and automatically transitions to the
 * second slide with a minimal, smooth vertical effect.
 *
 * Features:
 * - Initializes Swiper with vertical direction
 * - Displays only one slide at a time
 * - Listens for Typebot completion event
 * - Automatically transitions to slide 2 when form is completed
 * - No user control (swipe disabled)
 * - Minimal transition effect
 */

import 'swiper/css';

import Swiper from 'swiper';

interface TypebotMessage {
  type: string;
  data?: {
    [key: string]: unknown;
  };
}

/**
 * Configuration for the Swiper controller
 */
interface SwiperControllerConfig {
  /** Selector for the Swiper container element */
  containerSelector?: string;
  /** Direction of the slider */
  direction?: 'horizontal' | 'vertical';
  /** Number of slides to show at once */
  slidesPerView?: number;
  /** Allow touch/mouse dragging */
  allowTouchMove?: boolean;
  /** Transition speed in milliseconds */
  speed?: number;
  /** Delay before auto-transitioning after form completion (ms) */
  transitionDelay?: number;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<SwiperControllerConfig> = {
  containerSelector: '.swiper.is-landingpage',
  direction: 'vertical',
  slidesPerView: 1,
  allowTouchMove: false,
  speed: 600,
  transitionDelay: 500,
  debug: false,
};

/**
 * SwiperController class
 * Handles Swiper initialization and Typebot form completion integration
 */
export class SwiperController {
  private config: Required<SwiperControllerConfig>;
  private swiper: Swiper | null = null;
  private isListening = false;
  private hasTransitioned = false;

  constructor(config: SwiperControllerConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize the Swiper controller
   */
  public init(): void {
    if (this.swiper) {
      this.log('Swiper already initialized');
      return;
    }

    this.initSwiper();
    this.setupMessageListener();
    this.isListening = true;
    this.log('SwiperController initialized and listening for Typebot events');
  }

  /**
   * Inject CSS to ensure touch events pass through for native scrolling
   */
  private injectTouchActionCSS(): void {
    const styleId = 'swiper-touch-action-fix';

    // Check if styles are already injected
    if (document.getElementById(styleId)) {
      this.log('Touch action CSS already injected');
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Allow native touch scrolling on Swiper elements */
      .swiper.is-landingpage {
        touch-action: pan-y !important;
        -webkit-touch-callout: default !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }

      .swiper-wrapper.is-landingpage {
        touch-action: pan-y !important;
      }

      .swiper-slide.is-landingpage {
        touch-action: pan-y !important;
        -webkit-touch-callout: default !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }

      /* Ensure text content is selectable */
      .swiper-slide.is-landingpage * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;

    document.head.appendChild(style);
    this.log('Touch action CSS injected successfully');
  }

  /**
   * Initialize the Swiper instance
   */
  private initSwiper(): void {
    const container = document.querySelector(this.config.containerSelector);

    if (!container) {
      console.error(
        `[SwiperController] Container not found with selector: ${this.config.containerSelector}`
      );
      return;
    }

    // Add CSS to ensure touch events pass through for native scrolling
    this.injectTouchActionCSS();

    this.log('Initializing Swiper with config:', {
      direction: this.config.direction,
      slidesPerView: this.config.slidesPerView,
      allowTouchMove: this.config.allowTouchMove,
      speed: this.config.speed,
    });

    this.swiper = new Swiper(this.config.containerSelector, {
      direction: this.config.direction,
      slidesPerView: this.config.slidesPerView,
      allowTouchMove: this.config.allowTouchMove,
      speed: this.config.speed,
      effect: 'slide',
      // Disable all manual interaction methods
      simulateTouch: false, // Disable mouse drag simulation
      touchStartPreventDefault: false, // Allow text selection and native touch events
      touchMoveStopPropagation: false, // Allow page scrolling
      touchStartForcePreventDefault: false, // Don't force prevent default on touch start
      touchReleaseOnEdges: true, // Release touch events on slider edges for page scrolling
      resistance: false, // Disable resistance when reaching slider edge
      resistanceRatio: 0, // No resistance effect
      preventInteractionOnTransition: true, // Prevent interaction during transitions
      allowSlideNext: false, // Disable manual slide next
      allowSlidePrev: false, // Disable manual slide prev
      // Disable mouse wheel control
      mousewheel: false,
      // Disable keyboard control
      keyboard: {
        enabled: false,
      },
      // Disable pagination interaction
      pagination: {
        clickable: false,
      },
      // Disable navigation buttons
      navigation: {
        enabled: false,
      },
      on: {
        init: () => {
          this.log('Swiper initialized successfully');
        },
        slideChange: () => {
          this.log(`Slide changed to index: ${this.swiper?.activeIndex}`);
        },
      },
    });
  }

  /**
   * Set up the message listener for Typebot events
   */
  private setupMessageListener(): void {
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  /**
   * Handle incoming postMessage events from Typebot
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const { data } = event;

      // Check for Typebot completion event
      if (this.isTypebotCompletion(data)) {
        this.handleTypebotCompletion();
      }
    } catch (error) {
      console.error('[SwiperController] Error handling Typebot message:', error);
    }
  }

  /**
   * Check if the message is a Typebot completion event
   */
  private isTypebotCompletion(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      'type' in data &&
      (data as TypebotMessage).type === 'typebot-completion'
    );
  }

  /**
   * Handle Typebot completion event
   */
  private handleTypebotCompletion(): void {
    // Only transition once
    if (this.hasTransitioned) {
      this.log('Already transitioned to slide 2, skipping');
      return;
    }

    this.log('Typebot form completed, transitioning to slide 2');

    // Add a small delay for a smoother experience
    setTimeout(() => {
      this.transitionToSlide(1); // Index 1 = second slide
    }, this.config.transitionDelay);
  }

  /**
   * Transition to a specific slide
   */
  private transitionToSlide(index: number): void {
    if (!this.swiper) {
      this.log('Swiper not initialized, cannot transition');
      return;
    }

    this.log(`Transitioning to slide ${index + 1}`);

    // Temporarily enable slide transitions for programmatic control
    this.swiper.allowSlideNext = true;
    this.swiper.allowSlidePrev = true;

    this.swiper.slideTo(index);

    // Re-disable slide transitions after the transition
    setTimeout(() => {
      if (this.swiper) {
        this.swiper.allowSlideNext = false;
        this.swiper.allowSlidePrev = false;
      }
    }, this.config.speed + 100); // Wait for transition to complete

    this.hasTransitioned = true;
  }

  /**
   * Manually transition to the next slide (useful for testing)
   */
  public next(): void {
    if (!this.swiper) {
      this.log('Swiper not initialized');
      return;
    }

    // Temporarily enable slide transitions for programmatic control
    this.swiper.allowSlideNext = true;
    this.swiper.slideNext();

    // Re-disable slide transitions after the transition
    setTimeout(() => {
      if (this.swiper) {
        this.swiper.allowSlideNext = false;
      }
    }, this.config.speed + 100);
  }

  /**
   * Manually transition to the previous slide (useful for testing)
   */
  public prev(): void {
    if (!this.swiper) {
      this.log('Swiper not initialized');
      return;
    }

    // Temporarily enable slide transitions for programmatic control
    this.swiper.allowSlidePrev = true;
    this.swiper.slidePrev();

    // Re-disable slide transitions after the transition
    setTimeout(() => {
      if (this.swiper) {
        this.swiper.allowSlidePrev = false;
      }
    }, this.config.speed + 100);
  }

  /**
   * Manually transition to slide 2 (useful for testing)
   */
  public goToSlide2(): void {
    this.hasTransitioned = false; // Reset flag
    this.transitionToSlide(1);
  }

  /**
   * Get the current active slide index
   */
  public getActiveIndex(): number | null {
    return this.swiper?.activeIndex ?? null;
  }

  /**
   * Reset the controller state
   */
  public reset(): void {
    this.hasTransitioned = false;
    if (this.swiper) {
      // Temporarily enable slide transitions for reset
      this.swiper.allowSlideNext = true;
      this.swiper.allowSlidePrev = true;
      this.swiper.slideTo(0);

      // Re-disable slide transitions after reset
      setTimeout(() => {
        if (this.swiper) {
          this.swiper.allowSlideNext = false;
          this.swiper.allowSlidePrev = false;
        }
      }, this.config.speed + 100);
    }
    this.log('SwiperController reset to initial state');
  }

  /**
   * Log messages if debug mode is enabled
   */
  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[SwiperController]', ...args);
    }
  }

  /**
   * Destroy the Swiper instance and remove event listeners
   */
  public destroy(): void {
    if (this.swiper) {
      this.swiper.destroy();
      this.swiper = null;
    }

    // Remove injected CSS
    const styleElement = document.getElementById('swiper-touch-action-fix');
    if (styleElement) {
      styleElement.remove();
      this.log('Touch action CSS removed');
    }

    window.removeEventListener('message', this.handleMessage.bind(this));
    this.isListening = false;
    this.log('SwiperController destroyed');
  }
}

/**
 * Initialize the Swiper controller with default configuration
 */
export function initSwiperController(config: SwiperControllerConfig = {}): SwiperController {
  const controller = new SwiperController({
    ...config,
    debug: true, // Enable debug logging by default
  });

  controller.init();

  return controller;
}
