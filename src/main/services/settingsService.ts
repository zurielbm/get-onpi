import fs from 'node:fs/promises';
import type { AppSettings } from '@shared/types';
import { DEFAULT_SETTINGS } from '@shared/constants';

export async function readSettings(settingsFile: string): Promise<AppSettings> {
  try {
    const content = await fs.readFile(settingsFile, 'utf8');
    const parsed = JSON.parse(content) as AppSettings;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      emojiDetectionContains: [...(parsed.emojiDetectionContains ?? DEFAULT_SETTINGS.emojiDetectionContains)],
      emojiDetectionSuffixes: [...(parsed.emojiDetectionSuffixes ?? DEFAULT_SETTINGS.emojiDetectionSuffixes)]
    };
  } catch {
    return {
      ...DEFAULT_SETTINGS,
      emojiDetectionContains: [...DEFAULT_SETTINGS.emojiDetectionContains],
      emojiDetectionSuffixes: [...DEFAULT_SETTINGS.emojiDetectionSuffixes]
    };
  }
}

export async function writeSettings(settingsFile: string, settings: AppSettings): Promise<AppSettings> {
  await fs.writeFile(settingsFile, JSON.stringify(settings, null, 2));
  return settings;
}
