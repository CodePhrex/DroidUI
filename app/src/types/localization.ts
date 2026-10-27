export type SupportedLocale = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

export interface LocaleMeta {
  code: SupportedLocale;
  name: string;
  flag: string;
}

export const SUPPORTED_LOCALES: LocaleMeta[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'fr', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese (中文)', flag: '🇨🇳' },
];

export type TranslationMap = Record<SupportedLocale, string>;

export interface I18nDictionary {
  [key: string]: TranslationMap;
}
