/**
 * Logo Card Toggle Handler
 *
 * Handles click interactions on the Reino Capital logo to toggle card rotation.
 * The logo appears on both the front and back faces of the card.
 *
 * Features:
 * - Click logo to rotate card (front -> back)
 * - Click logo again to reverse rotation (back -> front)
 * - Prevents event propagation to avoid triggering card click handler
 * - Uses shared CardRotationManager for consistent rotation behavior
 */

import { CardRotationManager, CardRotationState } from './card-rotation-manager';

/**
 * Configuration for logo toggle handler
 */
interface LogoToggleConfig {
  /** Selector for logo elements (both front and back) */
  logoSelector?: string;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<LogoToggleConfig> = {
  logoSelector: '.logo_card',
  debug: false,
};

/**
 * LogoCardToggle class
 * Manages click interactions on logo elements to toggle card rotation
 */
export class LogoCardToggle {
  private config: Required<LogoToggleConfig>;
  private rotationManager: CardRotationManager;
  private isInitialized = false;
  private boundHandleClick: (event: Event) => void;

  constructor(config: LogoToggleConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.rotationManager = new CardRotationManager({ debug: this.config.debug });
    this.boundHandleClick = this.handleLogoClick.bind(this);
  }

  /**
   * Initialize the logo toggle handler
   * Attaches click event listeners to all logo elements
   */
  public init(): void {
    if (this.isInitialized) {
      this.log('Logo toggle handler already initialized');
      return;
    }

    this.attachEventListeners();
    this.isInitialized = true;
    this.log('Logo toggle handler initialized');
  }

  /**
   * Attach click event listeners to all logo elements
   */
  private attachEventListeners(): void {
    const logoElements = document.querySelectorAll<HTMLElement>(this.config.logoSelector);

    if (logoElements.length === 0) {
      this.log('No logo elements found with selector:', this.config.logoSelector);
      return;
    }

    this.log(`Found ${logoElements.length} logo element(s) to attach listeners`);

    logoElements.forEach((logo, index) => {
      logo.addEventListener('click', this.boundHandleClick);
      // Add cursor pointer to indicate clickability
      logo.style.cursor = 'pointer';
      this.log(`Attached click listener to logo element ${index + 1}`);
    });
  }

  /**
   * Handle click event on logo element
   * @param event The click event
   */
  private handleLogoClick(event: Event): void {
    // Stop event propagation to prevent triggering card click handler
    event.stopPropagation();
    event.preventDefault();

    this.log('Logo clicked, toggling card rotation');

    // Find the parent card element that contains this logo
    const logoElement = event.target as HTMLElement;
    const parentCard = logoElement.closest('.profile-card_wrapper, .profile-card_wrapper-mobile');

    if (!parentCard) {
      this.log('Could not find parent card for logo element');
      return;
    }

    this.log('Found parent card:', parentCard.className);

    // Set the target card for the rotation manager
    this.rotationManager.setTargetCard(parentCard as HTMLElement);

    // Toggle the card rotation
    const newState = this.rotationManager.toggleRotation();

    this.log(`Card rotation toggled to: ${newState}`);

    // Dispatch custom event for other components to listen to
    this.dispatchRotationEvent(newState);
  }

  /**
   * Dispatch a custom event when rotation state changes
   * @param newState The new rotation state
   */
  private dispatchRotationEvent(newState: CardRotationState): void {
    const event = new CustomEvent('card-rotation-toggle', {
      detail: {
        state: newState,
        isRotated: newState === CardRotationState.BACK,
      },
      bubbles: true,
    });

    document.dispatchEvent(event);
    this.log('Dispatched card-rotation-toggle event:', newState);
  }

  /**
   * Get the current rotation state
   * @returns The current rotation state
   */
  public getRotationState(): CardRotationState {
    return this.rotationManager.getRotationState();
  }

  /**
   * Check if the card is currently rotated
   * @returns true if card is showing back face
   */
  public isRotated(): boolean {
    return this.rotationManager.isRotated();
  }

  /**
   * Manually rotate the card to show the back face
   * @param targetCard Optional specific card to rotate (if not provided, uses first found)
   * @returns true if rotation was successful
   */
  public rotateToBack(targetCard?: HTMLElement): boolean {
    if (targetCard) {
      this.rotationManager.setTargetCard(targetCard);
    }
    const success = this.rotationManager.rotateToBack();
    if (success) {
      this.dispatchRotationEvent(CardRotationState.BACK);
    }
    return success;
  }

  /**
   * Manually rotate the card to show the front face
   * @param targetCard Optional specific card to rotate (if not provided, uses first found)
   * @returns true if rotation was successful
   */
  public rotateToFront(targetCard?: HTMLElement): boolean {
    if (targetCard) {
      this.rotationManager.setTargetCard(targetCard);
    }
    const success = this.rotationManager.rotateToFront();
    if (success) {
      this.dispatchRotationEvent(CardRotationState.FRONT);
    }
    return success;
  }

  /**
   * Manually toggle the card rotation
   * @param targetCard Optional specific card to rotate (if not provided, uses first found)
   * @returns The new rotation state
   */
  public toggle(targetCard?: HTMLElement): CardRotationState {
    if (targetCard) {
      this.rotationManager.setTargetCard(targetCard);
    }
    const newState = this.rotationManager.toggleRotation();
    this.dispatchRotationEvent(newState);
    return newState;
  }

  /**
   * Remove event listeners and clean up
   */
  public destroy(): void {
    const logoElements = document.querySelectorAll<HTMLElement>(this.config.logoSelector);

    logoElements.forEach((logo, index) => {
      logo.removeEventListener('click', this.boundHandleClick);
      logo.style.cursor = '';
      this.log(`Removed click listener from logo element ${index + 1}`);
    });

    this.isInitialized = false;
    this.log('Logo toggle handler destroyed');
  }

  /**
   * Log messages if debug mode is enabled
   */
  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[LogoCardToggle]', ...args);
    }
  }
}

/**
 * Initialize the logo card toggle handler with default configuration
 * @param config Optional configuration
 * @returns LogoCardToggle instance
 */
export function initLogoCardToggle(config: LogoToggleConfig = {}): LogoCardToggle {
  const toggle = new LogoCardToggle({
    ...config,
    debug: config.debug ?? true, // Enable debug logging by default
  });

  toggle.init();

  return toggle;
}

/**
 * Listen for card rotation toggle events
 * @param callback Function to call when rotation state changes
 * @returns Function to remove the event listener
 */
export function onCardRotationToggle(
  callback: (state: CardRotationState, isRotated: boolean) => void
): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ state: CardRotationState; isRotated: boolean }>;
    callback(customEvent.detail.state, customEvent.detail.isRotated);
  };

  document.addEventListener('card-rotation-toggle', handler);

  // Return cleanup function
  return () => {
    document.removeEventListener('card-rotation-toggle', handler);
  };
}
