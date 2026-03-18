export const APP_NAME = 'ONPI Desktop';
export const APP_SLUG = 'onpi';
export const APP_DISPLAY_VERSION = '0.0-alpha 1';
export const APP_PACKAGE_VERSION = '0.0.0-alpha.1';
export const FORMAT_VERSION = '1.0.0';
export const SUPPORTED_ASSET_TYPES = [
  'fusion-template',
  'fusion-macro',
  'fuse',
  'script',
  'lut',
  'dctl'
] as const;
export const DEFAULT_SETTINGS = {
  defaultInstallScope: 'user',
  defaultExportDirectory: null,
  emojiDetectionContains: ['emoji'],
  emojiDetectionSuffixes: ['-emoji', '_emoji', ' emoji']
} as const;
