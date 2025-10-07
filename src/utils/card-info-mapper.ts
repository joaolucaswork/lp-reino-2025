/**
 * Card Info Attribute Mapper
 *
 * Maps and manages all card-info attributes from the HTML structure.
 * Reference: webflow-source-files/index.html (lines 210-253)
 */

/**
 * Card Info attribute types
 */
export enum CardInfoAttribute {
  /** Main wrapper - controls background and text color */
  BG_TEXT_COLOR = 'bg-text-color',
  /** Name of the person/user */
  NAME = 'name',
  /** Title or role of the person */
  TITLE = 'title',
  /** Container for data elements (RC, mini block, date) */
  ELEMENTS = 'elements',
  /** Mini visual block indicator */
  MINI = 'mini',
  /** Registration/creation date */
  DATE = 'date',
  /** Central illustration element */
  ILUSTRATION = 'ilustration',
}

/**
 * Card Info selector mapping
 */
export const CARD_INFO_SELECTORS = {
  [CardInfoAttribute.BG_TEXT_COLOR]: '[card-info="bg-text-color"]',
  [CardInfoAttribute.NAME]: '[card-info="name"]',
  [CardInfoAttribute.TITLE]: '[card-info="title"]',
  [CardInfoAttribute.ELEMENTS]: '[card-info="elements"]',
  [CardInfoAttribute.MINI]: '[card-info="mini"]',
  [CardInfoAttribute.DATE]: '[card-info="date"]',
  [CardInfoAttribute.ILUSTRATION]: '[card-info="ilustration"]',
} as const;

/**
 * Card Info element structure
 */
export interface CardInfoElements {
  /** Main wrapper element (.profile-card_wrapper) */
  wrapper: HTMLElement | null;
  /** Name element (.name-people) */
  name: HTMLElement | null;
  /** Title element (.titulo-lead) */
  title: HTMLElement | null;
  /** Elements container (.info-data) */
  elements: HTMLElement | null;
  /** Mini block element (.visual-block-card) */
  mini: HTMLElement | null;
  /** Date element (.data-cadastro) */
  date: HTMLElement | null;
  /** Illustration element (.ilustration-center) */
  ilustration: HTMLElement | null;
}

/**
 * Card data interface for updating card information
 */
export interface CardData {
  /** User's name (default: "******") */
  name?: string;
  /** User's title/role (default: "Investidor Explorador") */
  title?: string;
  /** Registration date in DD.MM.YYYY format (default: "07.10.2025") */
  date?: string;
  /** Background and text color theme */
  theme?: 'light' | 'dark' | string;
}

/**
 * Card Info Mapper Class
 */
export class CardInfoMapper {
  private elements: CardInfoElements;

  constructor() {
    this.elements = this.queryAllElements();
  }

  /**
   * Query all card-info elements from the DOM
   * @returns CardInfoElements object with all queried elements
   */
  private queryAllElements(): CardInfoElements {
    return {
      wrapper: document.querySelector(CARD_INFO_SELECTORS[CardInfoAttribute.BG_TEXT_COLOR]),
      name: document.querySelector(CARD_INFO_SELECTORS[CardInfoAttribute.NAME]),
      title: document.querySelector(CARD_INFO_SELECTORS[CardInfoAttribute.TITLE]),
      elements: document.querySelector(CARD_INFO_SELECTORS[CardInfoAttribute.ELEMENTS]),
      mini: document.querySelector(CARD_INFO_SELECTORS[CardInfoAttribute.MINI]),
      date: document.querySelector(CARD_INFO_SELECTORS[CardInfoAttribute.DATE]),
      ilustration: document.querySelector(CARD_INFO_SELECTORS[CardInfoAttribute.ILUSTRATION]),
    };
  }

  /**
   * Get a specific card-info element
   * @param attribute The card-info attribute to query
   * @returns The HTML element or null if not found
   */
  public getElement(attribute: CardInfoAttribute): HTMLElement | null {
    const elementMap: Record<CardInfoAttribute, keyof CardInfoElements> = {
      [CardInfoAttribute.BG_TEXT_COLOR]: 'wrapper',
      [CardInfoAttribute.NAME]: 'name',
      [CardInfoAttribute.TITLE]: 'title',
      [CardInfoAttribute.ELEMENTS]: 'elements',
      [CardInfoAttribute.MINI]: 'mini',
      [CardInfoAttribute.DATE]: 'date',
      [CardInfoAttribute.ILUSTRATION]: 'ilustration',
    };

    const key = elementMap[attribute];
    return this.elements[key] || null;
  }

  /**
   * Get all card-info elements
   * @returns CardInfoElements object
   */
  public getAllElements(): CardInfoElements {
    return this.elements;
  }

  /**
   * Refresh all element queries (useful after DOM updates)
   */
  public refresh(): void {
    this.elements = this.queryAllElements();
  }

  /**
   * Update card data
   * @param data CardData object with values to update
   */
  public updateCard(data: CardData): void {
    if (data.name && this.elements.name) {
      this.elements.name.textContent = data.name;
    }

    if (data.title && this.elements.title) {
      this.elements.title.textContent = data.title;
    }

    if (data.date && this.elements.date) {
      this.elements.date.textContent = data.date;
    }

    if (data.theme && this.elements.wrapper) {
      this.elements.wrapper.setAttribute('data-theme', data.theme);
    }
  }

  /**
   * Check if all required elements are present in the DOM
   * @returns true if all elements exist, false otherwise
   */
  public validateElements(): boolean {
    return Object.values(this.elements).every((element) => element !== null);
  }

  /**
   * Get missing elements
   * @returns Array of attribute names for missing elements
   */
  public getMissingElements(): CardInfoAttribute[] {
    const missing: CardInfoAttribute[] = [];

    Object.entries(this.elements).forEach(([key, element]) => {
      if (element === null) {
        missing.push(key as CardInfoAttribute);
      }
    });

    return missing;
  }
}

/**
 * Initialize and return a new CardInfoMapper instance
 * @returns CardInfoMapper instance
 */
export const initCardInfoMapper = (): CardInfoMapper => {
  return new CardInfoMapper();
};

/**
 * Get an element by card-info attribute
 * @param attribute The card-info attribute value
 * @returns The HTML element or null
 */
export const getCardInfoElement = (attribute: CardInfoAttribute): HTMLElement | null => {
  return document.querySelector(`[card-info="${attribute}"]`);
};

/**
 * Get all elements with card-info attribute
 * @returns NodeList of all elements with card-info attribute
 */
export const getAllCardInfoElements = (): NodeListOf<HTMLElement> => {
  return document.querySelectorAll('[card-info]');
};
