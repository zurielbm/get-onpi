import fs from 'node:fs/promises';
import type { AppSettings } from '@shared/types';
import { DEFAULT_SETTINGS } from '@shared/constants';

export async function readSettings(settingsFile: string): Promise<AppSettings> {
  try {
    const content = await fs.readFile(settingsFile, 'utf8');
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(content) as AppSettings) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function writeSettings(settingsFile: string, settings: AppSettings): Promise<AppSettings> {
  await fs.writeFile(settingsFile, JSON.stringify(settings, null, 2));
  return settings;
}
