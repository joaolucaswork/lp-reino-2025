import type { CardInfoMapper } from './card-info-mapper';

/**
 * Format date to DD.MM.YYYY format
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

/**
 * List of creative investor titles
 */
export const investorTitles = [
  'Investidor Explorador',
  'Investidor Estratégico',
  'Investidor Visionário',
  'Investidor Inovador',
  'Investidor Consciente',
  'Investidor Analítico',
  'Investidor Empreendedor',
  'Investidor Resiliente',
] as const;

/**
 * Rotate through investor titles
 * @param mapper The CardInfoMapper instance
 * @param intervalMs Interval in milliseconds between title changes
 * @returns Interval ID for cleanup
 */
export const startTitleRotation = (mapper: CardInfoMapper, intervalMs: number = 3000): number => {
  let currentIndex = 0;

  const rotateTitle = () => {
    currentIndex = (currentIndex + 1) % investorTitles.length;
    mapper.updateCard({ title: investorTitles[currentIndex] });
  };

  return window.setInterval(rotateTitle, intervalMs);
};

/**
 * Initialize card updates with current date and title rotation
 * @param mapper The CardInfoMapper instance
 * @param titleIntervalMs Interval in milliseconds for title rotation
 * @returns Interval ID for cleanup
 */
export const initCardUpdates = (mapper: CardInfoMapper, titleIntervalMs: number = 3000): number => {
  // Update date with current system date
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);
  mapper.updateCard({ date: formattedDate });

  // Start title rotation
  return startTitleRotation(mapper, titleIntervalMs);
};
