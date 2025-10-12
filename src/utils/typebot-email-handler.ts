/**
 * Typebot Email Handler Utility
 *
 * This utility listens for Typebot email variable changes and triggers
 * the profile card rotation animation when the email is completed.
 *
 * Features:
 * - Listens for Typebot postMessage events for email variable
 * - Captures the "email" and "telefone" variables from Typebot
 * - Triggers card rotation animation when email is completed
 * - Updates email and phone elements in real-time
 * - Manages the active state transitions between front and rotation elements
 */

interface TypebotVariableUpdate {
  type: string;
  variable?: string;
  value?: string;
  variableId?: string;
}

/**
 * Configuration for the email handler
 */
interface EmailHandlerConfig {
  /** Selector for the profile card wrapper element */
  profileCardSelector?: string;
  /** Selector for the front elements container */
  frontElementsSelector?: string;
  /** Selector for the rotation elements container */
  rotationElementsSelector?: string;
  /** Selector for the email display element */
  emailSelector?: string;
  /** Selector for the phone display element */
  phoneSelector?: string;
  /** Class to add to profile card when email is filled */
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
const DEFAULT_CONFIG: Required<EmailHandlerConfig> = {
  profileCardSelector: '.profile-card_wrapper',
  frontElementsSelector: '.front-elements',
  rotationElementsSelector: '.rotation-elements',
  emailSelector: '[card-info="email"]',
  phoneSelector: '[card-info="telefone"]',
  activeFillClass: 'active_fill',
  rotateClass: 'rotate',
  activeClass: 'active',
  debug: false,
};

/**
 * TypebotEmailHandler class
 * Handles listening for Typebot email events and triggering card rotation
 */
export class TypebotEmailHandler {
  private config: Required<EmailHandlerConfig>;
  private userEmail: string | null = null;
  private userPhone: string | null = null;
  private isListening = false;
  private hasRotated = false;

  constructor(config: EmailHandlerConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize the email handler and start listening for Typebot events
   */
  public init(): void {
    if (this.isListening) {
      this.log('Already listening for Typebot events');
      return;
    }

    this.setupMessageListener();
    this.isListening = true;
    this.log('TypebotEmailHandler initialized and listening for events');
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

      // Check for Typebot variable update event
      if (this.isTypebotVariableUpdate(data)) {
        this.handleTypebotVariableUpdate(data as TypebotVariableUpdate);
      }
    } catch (error) {
      console.error('Error handling Typebot message:', error);
    }
  }

  /**
   * Check if the message is a Typebot variable update event
   */
  private isTypebotVariableUpdate(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      'type' in data &&
      (data as TypebotVariableUpdate).type === 'typebot-variable-update' &&
      'variable' in data
    );
  }

  /**
   * Handle Typebot variable update event
   */
  private handleTypebotVariableUpdate(message: TypebotVariableUpdate): void {
    const { variable, value } = message;

    if (!variable || !value) {
      return;
    }

    this.log(`Typebot variable "${variable}" updated:`, value);

    // Handle email variable
    if (variable === 'email') {
      this.updateUserEmail(value);
      this.triggerCardRotation();
    }

    // Handle phone variable
    if (variable === 'telefone' || variable === 'phone') {
      this.updateUserPhone(value);
    }
  }

  /**
   * Update the stored user email and display it on the page
   */
  private updateUserEmail(email: string): void {
    // Sanitize the email
    const sanitizedEmail = this.sanitizeInput(email);

    if (!sanitizedEmail) {
      this.log('Invalid or empty email, skipping update');
      return;
    }

    this.userEmail = sanitizedEmail;
    this.log('User email updated to:', this.userEmail);

    // Update email display on the page
    this.updateEmailDisplay();
  }

  /**
   * Update the stored user phone and display it on the page
   */
  private updateUserPhone(phone: string): void {
    // Sanitize the phone
    const sanitizedPhone = this.sanitizeInput(phone);

    if (!sanitizedPhone) {
      this.log('Invalid or empty phone, skipping update');
      return;
    }

    this.userPhone = sanitizedPhone;
    this.log('User phone updated to:', this.userPhone);

    // Update phone display on the page
    this.updatePhoneDisplay();
  }

  /**
   * Sanitize user input (remove HTML tags, trim, limit length)
   */
  private sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .trim()
      .substring(0, 200); // Limit to 200 characters
  }

  /**
   * Update the email display element on the page
   */
  private updateEmailDisplay(): void {
    if (!this.userEmail) {
      this.log('No user email available, skipping display update');
      return;
    }

    const emailElements = document.querySelectorAll(this.config.emailSelector);

    if (emailElements.length === 0) {
      this.log('No email elements found with selector:', this.config.emailSelector);
      return;
    }

    this.log(`Found ${emailElements.length} email element(s) to update`);

    emailElements.forEach((element) => {
      element.textContent = this.userEmail!;
      this.log(`Updated email element to: "${this.userEmail}"`);
    });
  }

  /**
   * Update the phone display element on the page
   */
  private updatePhoneDisplay(): void {
    if (!this.userPhone) {
      this.log('No user phone available, skipping display update');
      return;
    }

    const phoneElements = document.querySelectorAll(this.config.phoneSelector);

    if (phoneElements.length === 0) {
      this.log('No phone elements found with selector:', this.config.phoneSelector);
      return;
    }

    this.log(`Found ${phoneElements.length} phone element(s) to update`);

    phoneElements.forEach((element) => {
      element.textContent = this.userPhone!;
      this.log(`Updated phone element to: "${this.userPhone}"`);
    });
  }

  /**
   * Find the currently visible profile card (desktop or mobile)
   * @returns The visible profile card element or null
   */
  private findVisibleProfileCard(): HTMLElement | null {
    // Check both desktop and mobile card selectors
    const desktopCard = document.querySelector('.profile-card_wrapper') as HTMLElement;
    const mobileCard = document.querySelector('.profile-card_wrapper-mobile') as HTMLElement;

    // Determine which card is currently visible by checking computed styles
    if (desktopCard && this.isElementVisible(desktopCard)) {
      this.log('Using desktop profile card');
      return desktopCard;
    }

    if (mobileCard && this.isElementVisible(mobileCard)) {
      this.log('Using mobile profile card');
      return mobileCard;
    }

    // Fallback to the first card found
    const fallbackCard = desktopCard || mobileCard;
    if (fallbackCard) {
      this.log('Using fallback profile card:', fallbackCard.className);
      return fallbackCard;
    }

    this.log('No profile card found');
    return null;
  }

  /**
   * Check if an element is currently visible (not display: none)
   * @param element The element to check
   * @returns true if the element is visible, false otherwise
   */
  private isElementVisible(element: HTMLElement): boolean {
    const computedStyle = window.getComputedStyle(element);
    return computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
  }

  /**
   * Trigger the card rotation animation
   * This adds the rotate class and toggles active states
   * Now uses the same scoped element selection as the logo click handler
   */
  private triggerCardRotation(): void {
    // Only rotate once
    if (this.hasRotated) {
      this.log('Card has already been rotated, skipping');
      return;
    }

    this.log('Triggering card rotation animation');

    // Find the currently visible profile card (desktop or mobile)
    const profileCard = this.findVisibleProfileCard();

    if (!profileCard) {
      this.log('No visible profile card found');
      return;
    }

    // Add active_fill and rotate classes to profile card
    profileCard.classList.add(this.config.activeFillClass);
    profileCard.classList.add(this.config.rotateClass);
    this.log(
      `Added classes to profile card: ${this.config.activeFillClass}, ${this.config.rotateClass}`
    );

    // Find front and rotation elements within the specific card (scoped search)
    const frontElements = profileCard.querySelector(this.config.frontElementsSelector);
    const rotationElements = profileCard.querySelector(this.config.rotationElementsSelector);

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

    // Mark as rotated
    this.hasRotated = true;
    this.log('Card rotation completed');
  }

  /**
   * Manually trigger the card rotation (useful for testing)
   */
  public rotate(): void {
    this.hasRotated = false; // Reset the flag
    this.triggerCardRotation();
  }

  /**
   * Get the current user email
   */
  public getUserEmail(): string | null {
    return this.userEmail;
  }

  /**
   * Get the current user phone
   */
  public getUserPhone(): string | null {
    return this.userPhone;
  }

  /**
   * Reset the handler state
   */
  public reset(): void {
    this.userEmail = null;
    this.userPhone = null;
    this.hasRotated = false;
    this.log('Email handler reset');
  }

  /**
   * Log messages if debug mode is enabled
   */
  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[TypebotEmailHandler]', ...args);
    }
  }

  /**
   * Destroy the email handler and remove event listeners
   */
  public destroy(): void {
    window.removeEventListener('message', this.handleMessage.bind(this));
    this.isListening = false;
    this.log('TypebotEmailHandler destroyed');
  }
}

/**
 * Initialize the Typebot email handler with default configuration
 */
export function initTypebotEmailHandler(config: EmailHandlerConfig = {}): TypebotEmailHandler {
  const handler = new TypebotEmailHandler({
    ...config,
    debug: true, // Enable debug logging by default
  });

  handler.init();

  return handler;
}
