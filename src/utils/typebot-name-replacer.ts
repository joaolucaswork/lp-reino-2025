/**
 * Typebot Name Replacer Utility
 *
 * This utility listens for Typebot variable changes and dynamically replaces
 * asterisks (***) on the page with the user's entered name.
 *
 * Features:
 * - Listens for Typebot postMessage events
 * - Captures the "nome" variable from Typebot
 * - Replaces all asterisks with the user's name
 * - Updates profile card elements in real-time
 * - Handles multiple asterisk patterns (*, **, ***, etc.)
 */

interface TypebotMessage {
  type: string;
  data?: {
    nome?: string;
    userId?: string;
    [key: string]: unknown;
  };
}

interface TypebotVariableUpdate {
  type: string;
  variable?: string;
  value?: string;
  variableId?: string;
}

/**
 * Configuration for the name replacer
 */
interface NameReplacerConfig {
  /** Selector for elements containing asterisks to replace with name */
  targetSelector?: string;
  /** Selector for elements containing asterisks to replace with user ID */
  userIdSelector?: string;
  /** Selector for the profile card wrapper element */
  profileCardSelector?: string;
  /** Class to add to profile card when name is filled */
  activeClass?: string;
  /** Attribute to identify card info elements */
  cardInfoAttribute?: string;
  /** Value of the card info attribute for name elements */
  nameAttributeValue?: string;
  /** Value of the card info attribute for user ID elements */
  userIdAttributeValue?: string;
  /** Pattern to match asterisks (default: /\*+/g) */
  asteriskPattern?: RegExp;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<NameReplacerConfig> = {
  targetSelector: '[card-info="name"]',
  userIdSelector: '[card-info="random-code"]',
  profileCardSelector: '.profile-card_wrapper',
  activeClass: 'active_fill',
  cardInfoAttribute: 'card-info',
  nameAttributeValue: 'name',
  userIdAttributeValue: 'random-code',
  asteriskPattern: /\*+/g,
  debug: false,
};

/**
 * TypebotNameReplacer class
 * Handles listening for Typebot events and replacing asterisks with user names
 */
export class TypebotNameReplacer {
  private config: Required<NameReplacerConfig>;
  private userName: string | null = null;
  private userId: string | null = null;
  private isListening = false;

  constructor(config: NameReplacerConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize the name replacer and start listening for Typebot events
   */
  public init(): void {
    if (this.isListening) {
      this.log('Already listening for Typebot events');
      return;
    }

    this.setupMessageListener();
    this.isListening = true;
    this.log('TypebotNameReplacer initialized and listening for events');
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
        this.handleTypebotCompletion(data as TypebotMessage);
      }

      // Check for Typebot variable update event
      if (this.isTypebotVariableUpdate(data)) {
        this.handleTypebotVariableUpdate(data as TypebotVariableUpdate);
      }
    } catch (error) {
      console.error('Error handling Typebot message:', error);
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
   * Check if the message is a Typebot variable update event
   */
  private isTypebotVariableUpdate(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      'type' in data &&
      (data as TypebotVariableUpdate).type === 'typebot-variable-update' &&
      'variable' in data &&
      (data as TypebotVariableUpdate).variable === 'nome'
    );
  }

  /**
   * Handle Typebot completion event
   */
  private handleTypebotCompletion(message: TypebotMessage): void {
    if (message.data && message.data.nome) {
      const { nome } = message.data;
      this.log('Typebot completed with nome:', nome);
      this.updateUserName(nome);
    }

    // Also capture user ID if provided
    if (message.data && message.data.userId) {
      const { userId } = message.data;
      this.log('Typebot completed with userId:', userId);
      this.updateUserId(userId);
    }
  }

  /**
   * Handle Typebot variable update event
   */
  private handleTypebotVariableUpdate(message: TypebotVariableUpdate): void {
    if (message.value) {
      this.log('Typebot variable "nome" updated:', message.value);
      this.updateUserName(message.value);
    }

    // Also capture the variable ID if provided
    if (message.variableId) {
      this.log('Typebot variable ID captured:', message.variableId);
      this.updateUserId(message.variableId);
    }
  }

  /**
   * Update the stored user name and replace asterisks on the page
   */
  private updateUserName(name: string): void {
    // Sanitize the name
    const sanitizedName = this.sanitizeName(name);

    if (!sanitizedName) {
      this.log('Invalid or empty name, skipping update');
      return;
    }

    this.userName = sanitizedName;
    this.log('User name updated to:', this.userName);

    // Replace asterisks on the page
    this.replaceAsterisks();

    // Activate the profile card
    this.activateProfileCard();
  }

  /**
   * Sanitize the user name (remove HTML tags, trim, limit length)
   */
  private sanitizeName(name: string): string {
    return name
      .replace(/[<>]/g, '') // Remove HTML tags
      .trim()
      .substring(0, 100); // Limit to 100 characters
  }

  /**
   * Replace all asterisks on the page with the user's name
   */
  private replaceAsterisks(): void {
    if (!this.userName) {
      this.log('No user name available, skipping replacement');
      return;
    }

    // Find all elements with the target selector
    const elements = document.querySelectorAll(this.config.targetSelector);

    if (elements.length === 0) {
      this.log('No elements found with selector:', this.config.targetSelector);
      return;
    }

    this.log(`Found ${elements.length} element(s) to update`);

    elements.forEach((element) => {
      const currentText = element.textContent || '';

      // Check if the element contains asterisks
      if (this.config.asteriskPattern.test(currentText)) {
        // Replace asterisks with the user's name
        const newText = currentText.replace(this.config.asteriskPattern, this.userName!);
        element.textContent = newText;

        this.log(`Updated element: "${currentText}" -> "${newText}"`);

        // Add a class to indicate the element has been updated
        element.classList.add('name-updated');
      }
    });
  }

  /**
   * Update the stored user ID and replace asterisks on the page
   */
  private updateUserId(id: string): void {
    // Sanitize the ID
    const sanitizedId = this.sanitizeName(id);

    if (!sanitizedId) {
      this.log('Invalid or empty user ID, skipping update');
      return;
    }

    this.userId = sanitizedId;
    this.log('User ID updated to:', this.userId);

    // Replace asterisks on the page
    this.replaceUserIdAsterisks();
  }

  /**
   * Replace all asterisks in user ID elements with the user's ID
   */
  private replaceUserIdAsterisks(): void {
    if (!this.userId) {
      this.log('No user ID available, skipping replacement');
      return;
    }

    // Find all elements with the user ID selector
    const elements = document.querySelectorAll(this.config.userIdSelector);

    if (elements.length === 0) {
      this.log('No user ID elements found with selector:', this.config.userIdSelector);
      return;
    }

    this.log(`Found ${elements.length} user ID element(s) to update`);

    elements.forEach((element) => {
      const currentText = element.textContent || '';

      // Check if the element contains asterisks
      if (this.config.asteriskPattern.test(currentText)) {
        // Replace asterisks with the user's ID
        const newText = currentText.replace(this.config.asteriskPattern, this.userId!);
        element.textContent = newText;

        this.log(`Updated user ID element: "${currentText}" -> "${newText}"`);

        // Add a class to indicate the element has been updated
        element.classList.add('user-id-updated');
      }
    });
  }

  /**
   * Activate the profile card by adding the active class
   */
  private activateProfileCard(): void {
    // Find the profile card element
    const profileCard = document.querySelector(this.config.profileCardSelector);

    if (!profileCard) {
      this.log('Profile card not found with selector:', this.config.profileCardSelector);
      return;
    }

    // Add the active class
    profileCard.classList.add(this.config.activeClass);
    this.log(`Profile card activated with class: ${this.config.activeClass}`);
  }

  /**
   * Manually set the user name (useful for testing or pre-filling)
   */
  public setUserName(name: string): void {
    this.updateUserName(name);
  }

  /**
   * Manually set the user ID (useful for testing or pre-filling)
   */
  public setUserId(id: string): void {
    this.updateUserId(id);
  }

  /**
   * Get the current user name
   */
  public getUserName(): string | null {
    return this.userName;
  }

  /**
   * Get the current user ID
   */
  public getUserId(): string | null {
    return this.userId;
  }

  /**
   * Reset the user name and user ID and restore asterisks
   */
  public reset(): void {
    this.userName = null;
    this.userId = null;
    this.log('User name and ID reset');

    // Optionally restore asterisks (if needed)
    // This would require storing the original text
  }

  /**
   * Log messages if debug mode is enabled
   */
  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[TypebotNameReplacer]', ...args);
    }
  }

  /**
   * Destroy the name replacer and remove event listeners
   */
  public destroy(): void {
    window.removeEventListener('message', this.handleMessage.bind(this));
    this.isListening = false;
    this.log('TypebotNameReplacer destroyed');
  }
}

/**
 * Initialize the Typebot name replacer with default configuration
 */
export function initTypebotNameReplacer(config: NameReplacerConfig = {}): TypebotNameReplacer {
  const replacer = new TypebotNameReplacer({
    ...config,
    debug: true, // Enable debug logging by default
  });

  replacer.init();

  return replacer;
}
