/**
 * Profile Card Toggle Interaction
 *
 * Handles click interactions for profile card elements to toggle active state.
 * Reference: webflow-source-files/index.html (line 210)
 */

/**
 * Profile card wrapper selector
 */
const PROFILE_CARD_SELECTOR = '.profile-card_wrapper';

/**
 * Active state class name
 */
const ACTIVE_CLASS = 'active_fill';

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
    if (isActive) {
      card.classList.add(ACTIVE_CLASS);
    } else {
      card.classList.remove(ACTIVE_CLASS);
    }
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
