/**
 * Name-Based Personalization Utility
 *
 * Generates unique, deterministic SVG illustrations and color themes based on user names.
 * The same name will always produce the same shape and color combination.
 *
 * Features:
 * - String hashing for consistent seed generation
 * - Theme selection from existing investment categories
 * - Shape variation based on name
 * - Deterministic results (same name = same output)
 */

/**
 * Simple string hash function (djb2 algorithm)
 * Converts a string into a consistent 32-bit integer
 * @param str String to hash
 * @returns Hash value as positive integer
 */
export function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    // hash * 33 + char code
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  // Convert to positive 32-bit integer
  return Math.abs(hash | 0);
}

/**
 * Get a theme index (0-6) based on a name
 * Uses hash to deterministically select one of 7 investment category themes
 * @param name User's name
 * @returns Theme index (0-6)
 */
export function getThemeIndexFromName(name: string): number {
  const hash = hashString(name);
  return hash % 7; // 7 themes available
}

/**
 * Get a shape generator index (0-2) based on a name
 * Uses hash to deterministically select one of 3 star shape generators
 * @param name User's name
 * @returns Shape generator index (0-2)
 */
export function getShapeIndexFromName(name: string): number {
  const hash = hashString(name);
  // Use a different part of the hash for shape selection
  return Math.floor((hash / 7) % 3); // 3 shape generators available
}

/**
 * Get a seed value for random generation based on a name
 * This seed will be used to generate consistent shape variations
 * @param name User's name
 * @returns Seed value for random number generator
 */
export function getSeedFromName(name: string): number {
  return hashString(name);
}

/**
 * Get theme category name from index
 * @param index Theme index (0-6)
 * @returns Theme category name
 */
export function getThemeNameFromIndex(index: number): string {
  const themeNames = [
    'Renda Fixa',
    'Fundo de Investimento',
    'Renda Variável',
    'Internacional',
    'COE',
    'Previdência',
    'Outros',
  ];
  return themeNames[index % 7];
}

/**
 * Get shape generator name from index
 * @param index Shape generator index (0-2)
 * @returns Shape generator name
 */
export function getShapeNameFromIndex(index: number): string {
  const shapeNames = ['Rounded Star', 'Variant Star', 'Distorted Star'];
  return shapeNames[index % 3];
}

/**
 * Personalization result containing all name-based values
 */
export interface PersonalizationResult {
  /** Original name */
  name: string;
  /** Hash value of the name */
  hash: number;
  /** Theme index (0-6) */
  themeIndex: number;
  /** Theme category name */
  themeName: string;
  /** Shape generator index (0-2) */
  shapeIndex: number;
  /** Shape generator name */
  shapeName: string;
  /** Seed for random generation */
  seed: number;
}

/**
 * Get complete personalization data for a name
 * @param name User's name
 * @returns Personalization result with all computed values
 */
export function getPersonalizationFromName(name: string): PersonalizationResult {
  const hash = hashString(name);
  const themeIndex = getThemeIndexFromName(name);
  const shapeIndex = getShapeIndexFromName(name);
  const seed = getSeedFromName(name);

  return {
    name,
    hash,
    themeIndex,
    themeName: getThemeNameFromIndex(themeIndex),
    shapeIndex,
    shapeName: getShapeNameFromIndex(shapeIndex),
    seed,
  };
}

/**
 * Example usage and testing
 */
export function testPersonalization(): void {
  const testNames = ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Carla', 'Bruno'];

  console.log('=== Name-Based Personalization Test ===\n');

  testNames.forEach((name) => {
    const result = getPersonalizationFromName(name);
    console.log(`Name: ${result.name}`);
    console.log(`  Hash: ${result.hash}`);
    console.log(`  Theme: ${result.themeName} (index: ${result.themeIndex})`);
    console.log(`  Shape: ${result.shapeName} (index: ${result.shapeIndex})`);
    console.log(`  Seed: ${result.seed}`);
    console.log('');
  });

  // Test consistency
  console.log('=== Consistency Test ===\n');
  const name = 'João';
  const result1 = getPersonalizationFromName(name);
  const result2 = getPersonalizationFromName(name);

  console.log(`Testing name: ${name}`);
  console.log(`First call:  Theme=${result1.themeName}, Shape=${result1.shapeName}`);
  console.log(`Second call: Theme=${result2.themeName}, Shape=${result2.shapeName}`);
  console.log(
    `Consistent: ${result1.themeName === result2.themeName && result1.shapeName === result2.shapeName ? '✅' : '❌'}`
  );
}

