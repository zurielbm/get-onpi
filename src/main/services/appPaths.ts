import fs from 'node:fs/promises';
import path from 'node:path';
import { app } from 'electron';
import type { AppDirectories } from '@shared/types';
import { APP_SLUG, DEFAULT_SETTINGS } from '@shared/constants';

export async function ensureAppDirectories(): Promise<AppDirectories> {
  const root = path.join(app.getPath('userData'), APP_SLUG);
  const logs = path.join(root, 'logs');
  const temp = path.join(root, 'temp');
  const backups = path.join(root, 'backups');
  const registryFile = path.join(root, 'installed-packages.json');
  const settingsFile = path.join(root, 'settings.json');

  await Promise.all([
    fs.mkdir(logs, { recursive: true }),
    fs.mkdir(temp, { recursive: true }),
    fs.mkdir(backups, { recursive: true })
  ]);

  try {
    await fs.access(registryFile);
  } catch {
    await fs.writeFile(registryFile, JSON.stringify({ packages: [] }, null, 2));
  }

  try {
    await fs.access(settingsFile);
  } catch {
    await fs.writeFile(settingsFile, JSON.stringify(DEFAULT_SETTINGS, null, 2));
  }

  return { root, logs, temp, backups, registryFile, settingsFile };
}
