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
    this.swiper.slideTo(index);
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

    this.swiper.slideNext();
  }

  /**
   * Manually transition to the previous slide (useful for testing)
   */
  public prev(): void {
    if (!this.swiper) {
      this.log('Swiper not initialized');
      return;
    }

    this.swiper.slidePrev();
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
      this.swiper.slideTo(0);
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
