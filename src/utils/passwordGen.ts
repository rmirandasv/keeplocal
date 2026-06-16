import dicewareEn from "@/data/diceware-en.json";
import dicewareEs from "@/data/diceware-es.json";
import type { Locale } from "@/utils/i18n";

export type GeneratorMode = "password" | "passphrase";

export interface CharsetOptions {
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export interface PasswordGenOptions {
  mode: GeneratorMode;
  length: number;
  wordCount: number;
  charset: CharsetOptions;
  separator: string;
  capitalizeWords: boolean;
}

export type EntropyStrength = "weak" | "fair" | "strong" | "veryStrong";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

const DICEWARE_LISTS: Record<Locale, readonly string[]> = {
  en: dicewareEn,
  es: dicewareEs,
};

export const DEFAULT_CHARSET: CharsetOptions = {
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
};

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const DEFAULT_PASSWORD_LENGTH = 16;

export const MIN_WORD_COUNT = 4;
export const MAX_WORD_COUNT = 12;
export const DEFAULT_WORD_COUNT = 6;

function randomInt(max: number): number {
  if (max <= 0) {
    throw new Error("max must be positive");
  }

  const maxUint = 0x1_0000_0000;
  const limit = maxUint - (maxUint % max);
  const buffer = new Uint32Array(1);

  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);

  return buffer[0] % max;
}

export function buildCharset(options: CharsetOptions): string {
  let charset = "";

  if (options.lowercase) charset += LOWERCASE;
  if (options.uppercase) charset += UPPERCASE;
  if (options.numbers) charset += NUMBERS;
  if (options.symbols) charset += SYMBOLS;

  return charset;
}

export function getDicewareWords(locale: Locale): readonly string[] {
  return DICEWARE_LISTS[locale];
}

export function generatePassword(charset: string, length: number): string {
  if (charset.length === 0) {
    throw new Error("Charset must not be empty");
  }

  if (length < MIN_PASSWORD_LENGTH || length > MAX_PASSWORD_LENGTH) {
    throw new Error("Password length out of range");
  }

  const chars: string[] = [];

  for (let index = 0; index < length; index += 1) {
    chars.push(charset[randomInt(charset.length)]!);
  }

  return chars.join("");
}

export function generatePassphrase(
  words: readonly string[],
  wordCount: number,
  separator: string,
  capitalizeWords: boolean,
): string {
  if (words.length === 0) {
    throw new Error("Word list must not be empty");
  }

  if (wordCount < MIN_WORD_COUNT || wordCount > MAX_WORD_COUNT) {
    throw new Error("Word count out of range");
  }

  const selected: string[] = [];

  for (let index = 0; index < wordCount; index += 1) {
    const word = words[randomInt(words.length)]!;
    selected.push(capitalizeWords ? word.charAt(0).toUpperCase() + word.slice(1) : word);
  }

  return selected.join(separator);
}

export function estimateEntropyBits(options: PasswordGenOptions, locale: Locale): number {
  if (options.mode === "passphrase") {
    const listSize = getDicewareWords(locale).length;
    return options.wordCount * Math.log2(listSize);
  }

  const charset = buildCharset(options.charset);
  if (charset.length === 0) {
    return 0;
  }

  return options.length * Math.log2(charset.length);
}

export function getEntropyStrength(bits: number): EntropyStrength {
  if (bits < 40) return "weak";
  if (bits < 60) return "fair";
  if (bits < 80) return "strong";
  return "veryStrong";
}

export function generateSecret(options: PasswordGenOptions, locale: Locale): string {
  if (options.mode === "passphrase") {
    return generatePassphrase(
      getDicewareWords(locale),
      options.wordCount,
      options.separator,
      options.capitalizeWords,
    );
  }

  return generatePassword(buildCharset(options.charset), options.length);
}

export function isCharsetValid(options: CharsetOptions): boolean {
  return buildCharset(options).length > 0;
}
