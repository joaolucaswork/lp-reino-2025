/**
 * Profile Card Toggle Interaction
 *
 * Handles click interactions for profile card elements to toggle active state.
 * Reference: webflow-source-files/index.html (line 210)
 */

/**
 * Configuration for additional elements to toggle
 */
interface AdditionalToggleElement {
  /** CSS selector for the element (relative to profile card) */
  selector: string;
  /** Class name to toggle */
  activeClass: string;
}

/**
 * Profile card wrapper selector
 */
const PROFILE_CARD_SELECTOR = '.profile-card_wrapper';

/**
 * Active state class name for profile card
 */
const ACTIVE_CLASS = 'active_fill';

/**
 * Additional elements to toggle when profile card is activated
 */
const ADDITIONAL_TOGGLE_ELEMENTS: AdditionalToggleElement[] = [
  { selector: '.visual-block-card', activeClass: 'active' },
  { selector: '.shadow-yellow', activeClass: 'active' },
];

/**
 * Extended HTMLElement interface with toggle state
 */
interface ProfileCardElement extends HTMLElement {
  /** Toggle state counter (0 or 1) */
  toggleState?: number;
}

/**
 * Toggle active state for all profile card elements
 * @param isActive Whether to add or remove the active class
 */
const toggleAllCards = (isActive: boolean): void => {
  const cards = document.querySelectorAll<HTMLElement>(PROFILE_CARD_SELECTOR);
  cards.forEach((card) => {
    // Toggle active class on the profile card itself
    if (isActive) {
      card.classList.add(ACTIVE_CLASS);
    } else {
      card.classList.remove(ACTIVE_CLASS);
    }

    // Toggle active class on additional elements
    ADDITIONAL_TOGGLE_ELEMENTS.forEach(({ selector, activeClass }) => {
      const element = card.querySelector<HTMLElement>(selector);
      if (element) {
        if (isActive) {
          element.classList.add(activeClass);
        } else {
          element.classList.remove(activeClass);
        }
      }
    });
  });
};

/**
 * Handle click event on profile card
 * @param event The click event
 */
const handleCardClick = (event: Event): void => {
  const target = event.currentTarget as ProfileCardElement;

  // Toggle state: 0 -> 1 -> 0 -> 1...
  target.toggleState = ((target.toggleState || 0) + 1) % 2;

  // Apply or remove active class based on toggle state
  toggleAllCards(target.toggleState === 1);
};

/**
 * Initialize profile card toggle interactions
 * Attaches click event listeners to all profile card elements
 */
export const initProfileCardToggle = (): void => {
  const cards = document.querySelectorAll<ProfileCardElement>(PROFILE_CARD_SELECTOR);

  cards.forEach((card) => {
    // Initialize toggle state
    card.toggleState = 0;

    // Attach click event listener
    card.addEventListener('click', handleCardClick);
  });
};

/**
 * Remove profile card toggle interactions
 * Removes click event listeners from all profile card elements
 */
export const destroyProfileCardToggle = (): void => {
  const cards = document.querySelectorAll<ProfileCardElement>(PROFILE_CARD_SELECTOR);

  cards.forEach((card) => {
    card.removeEventListener('click', handleCardClick);
    delete card.toggleState;
  });
};

/**
 * Get current active state of profile cards
 * @returns true if cards are active, false otherwise
 */
export const isProfileCardActive = (): boolean => {
  const card = document.querySelector<HTMLElement>(PROFILE_CARD_SELECTOR);
  return card?.classList.contains(ACTIVE_CLASS) || false;
};

/**
 * Manually set active state for all profile cards
 * @param isActive Whether to activate or deactivate cards
 */
export const setProfileCardActive = (isActive: boolean): void => {
  toggleAllCards(isActive);

  // Update toggle state for all cards
  const cards = document.querySelectorAll<ProfileCardElement>(PROFILE_CARD_SELECTOR);
  cards.forEach((card) => {
    card.toggleState = isActive ? 1 : 0;
  });
};
