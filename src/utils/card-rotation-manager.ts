/**
 * Card Rotation Manager
 *
 * Shared utility for managing card rotation animations.
 * Used by both email input handler and logo click handler.
 *
 * Rotation involves:
 * 1. Adding/removing 'rotate' class on profile card
 * 2. Toggling 'active' class between front and rotation elements
 * 3. Ensuring 'active_fill' class is present on profile card
 */

/**
 * Configuration for card rotation
 */
export interface CardRotationConfig {
  /** Selector for the profile card wrapper */
  profileCardSelector?: string;
  /** Selector for the front elements container */
  frontElementsSelector?: string;
  /** Selector for the rotation elements container */
  rotationElementsSelector?: string;
  /** Class to add to profile card for active state */
  activeFillClass?: string;
  /** Class to add to profile card to trigger rotation */
  rotateClass?: string;
  /** Class to toggle on front/rotation elements */
  activeClass?: string;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<CardRotationConfig> = {
  profileCardSelector: '.profile-card_wrapper',
  frontElementsSelector: '.front-elements',
  rotationElementsSelector: '.rotation-elements',
  activeFillClass: 'active_fill',
  rotateClass: 'rotate',
  activeClass: 'active',
  debug: false,
};

/**
 * Card rotation state
 */
export enum CardRotationState {
  /** Card is showing front face */
  FRONT = 'front',
  /** Card is showing back face (rotated) */
  BACK = 'back',
}

/**
 * CardRotationManager class
 * Manages card rotation animations and state
 */
export class CardRotationManager {
  private config: Required<CardRotationConfig>;
  private targetCard: HTMLElement | null = null;

  constructor(config: CardRotationConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Set the target card element to operate on
   * @param cardElement The specific card element to rotate
   */
  public setTargetCard(cardElement: HTMLElement): void {
    this.targetCard = cardElement;
    this.log('Target card set:', cardElement);
  }

  /**
   * Find the profile card element (either target card or first match)
   * @returns The profile card element or null
   */
  private findProfileCard(): HTMLElement | null {
    if (this.targetCard) {
      return this.targetCard;
    }
    return document.querySelector(this.config.profileCardSelector);
  }

  /**
   * Get the current rotation state of the card
   * @returns CardRotationState.FRONT or CardRotationState.BACK
   */
  public getRotationState(): CardRotationState {
    const profileCard = this.findProfileCard();

    if (!profileCard) {
      this.log('Profile card not found, assuming FRONT state');
      return CardRotationState.FRONT;
    }

    const hasRotateClass = profileCard.classList.contains(this.config.rotateClass);
    return hasRotateClass ? CardRotationState.BACK : CardRotationState.FRONT;
  }

  /**
   * Check if the card is currently rotated (showing back face)
   * @returns true if card is showing back face, false otherwise
   */
  public isRotated(): boolean {
    return this.getRotationState() === CardRotationState.BACK;
  }

  /**
   * Rotate the card to show the back face
   * @returns true if rotation was successful, false otherwise
   */
  public rotateToBack(): boolean {
    this.log('Rotating card to show back face');

    // Find the profile card element
    const profileCard = this.findProfileCard();

    if (!profileCard) {
      this.log('Profile card not found with selector:', this.config.profileCardSelector);
      return false;
    }

    // Ensure active_fill class is present (card should be active before rotating)
    if (!profileCard.classList.contains(this.config.activeFillClass)) {
      profileCard.classList.add(this.config.activeFillClass);
      this.log(`Added ${this.config.activeFillClass} class to profile card`);
    }

    // Add rotate class to profile card
    profileCard.classList.add(this.config.rotateClass);
    this.log(`Added ${this.config.rotateClass} class to profile card`);

    // Find front and rotation elements within the target card
    const frontElements = this.targetCard
      ? this.targetCard.querySelector(this.config.frontElementsSelector)
      : document.querySelector(this.config.frontElementsSelector);

    const rotationElements = this.targetCard
      ? this.targetCard.querySelector(this.config.rotationElementsSelector)
      : document.querySelector(this.config.rotationElementsSelector);

    if (!frontElements) {
      this.log('Front elements not found with selector:', this.config.frontElementsSelector);
    } else {
      // Remove active class from front elements
      frontElements.classList.remove(this.config.activeClass);
      this.log(`Removed ${this.config.activeClass} class from front elements`);
    }

    if (!rotationElements) {
      this.log('Rotation elements not found with selector:', this.config.rotationElementsSelector);
    } else {
      // Add active class to rotation elements
      rotationElements.classList.add(this.config.activeClass);
      this.log(`Added ${this.config.activeClass} class to rotation elements`);
    }

    this.log('Card rotation to back completed');
    return true;
  }

  /**
   * Rotate the card to show the front face
   * @returns true if rotation was successful, false otherwise
   */
  public rotateToFront(): boolean {
    this.log('Rotating card to show front face');

    // Find the profile card element
    const profileCard = this.findProfileCard();

    if (!profileCard) {
      this.log('Profile card not found with selector:', this.config.profileCardSelector);
      return false;
    }

    // Remove rotate class from profile card
    profileCard.classList.remove(this.config.rotateClass);
    this.log(`Removed ${this.config.rotateClass} class from profile card`);

    // Find front and rotation elements within the target card
    const frontElements = this.targetCard
      ? this.targetCard.querySelector(this.config.frontElementsSelector)
      : document.querySelector(this.config.frontElementsSelector);

    const rotationElements = this.targetCard
      ? this.targetCard.querySelector(this.config.rotationElementsSelector)
      : document.querySelector(this.config.rotationElementsSelector);

    if (!frontElements) {
      this.log('Front elements not found with selector:', this.config.frontElementsSelector);
    } else {
      // Add active class to front elements
      frontElements.classList.add(this.config.activeClass);
      this.log(`Added ${this.config.activeClass} class to front elements`);
    }

    if (!rotationElements) {
      this.log('Rotation elements not found with selector:', this.config.rotationElementsSelector);
    } else {
      // Remove active class from rotation elements
      rotationElements.classList.remove(this.config.activeClass);
      this.log(`Removed ${this.config.activeClass} class from rotation elements`);
    }

    this.log('Card rotation to front completed');
    return true;
  }

  /**
   * Toggle the card rotation (front <-> back)
   * @returns The new rotation state after toggling
   */
  public toggleRotation(): CardRotationState {
    const currentState = this.getRotationState();

    if (currentState === CardRotationState.FRONT) {
      this.rotateToBack();
      return CardRotationState.BACK;
    }
    this.rotateToFront();
    return CardRotationState.FRONT;
  }

  /**
   * Log messages if debug mode is enabled
   */
  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[CardRotationManager]', ...args);
    }
  }
}

/**
 * Create a new CardRotationManager instance
 * @param config Optional configuration
 * @returns CardRotationManager instance
 */
export function createCardRotationManager(config: CardRotationConfig = {}): CardRotationManager {
  return new CardRotationManager(config);
}

/**
 * Rotate the card to show the back face (convenience function)
 * @param config Optional configuration
 * @returns true if rotation was successful
 */
export function rotateCardToBack(config: CardRotationConfig = {}): boolean {
  const manager = new CardRotationManager(config);
  return manager.rotateToBack();
}

/**
 * Rotate the card to show the front face (convenience function)
 * @param config Optional configuration
 * @returns true if rotation was successful
 */
export function rotateCardToFront(config: CardRotationConfig = {}): boolean {
  const manager = new CardRotationManager(config);
  return manager.rotateToFront();
}

/**
 * Toggle the card rotation (convenience function)
 * @param config Optional configuration
 * @returns The new rotation state
 */
export function toggleCardRotation(config: CardRotationConfig = {}): CardRotationState {
  const manager = new CardRotationManager(config);
  return manager.toggleRotation();
}

/**
 * Check if the card is currently rotated (convenience function)
 * @param config Optional configuration
 * @returns true if card is showing back face
 */
export function isCardRotated(config: CardRotationConfig = {}): boolean {
  const manager = new CardRotationManager(config);
  return manager.isRotated();
}
