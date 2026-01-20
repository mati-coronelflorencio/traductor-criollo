
export enum TranslationMode {
  MARKETING_TO_ARGENTINO = 'MARKETING_TO_ARGENTINO',
  ARGENTINO_TO_MARKETING = 'ARGENTINO_TO_MARKETING'
}

export interface TranslationResult {
  original: string;
  translated: string;
  mode: TranslationMode;
  timestamp: number;
}
