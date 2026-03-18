import AdmZip from 'adm-zip';
import type { PackageReadResult } from '@shared/types';
import { parseManifest } from '@core/manifest/manifest.parse';

function isUnsafeArchiveEntry(name: string): boolean {
  return name.startsWith('/') || name.includes('..');
}

export async function readArchive(archivePath: string): Promise<PackageReadResult> {
  const zip = new AdmZip(archivePath);
  const entries = zip.getEntries().map((entry) => entry.entryName);
  for (const entry of entries) {
    if (isUnsafeArchiveEntry(entry)) {
      throw new Error(`Unsafe archive entry detected: ${entry}`);
    }
  }

  const manifestEntry = zip.getEntry('package.json');
  if (!manifestEntry) {
    throw new Error('Archive missing package.json');
  }

  const manifestText = manifestEntry.getData().toString('utf8');
  const parsed = parseManifest(JSON.parse(manifestText));
  for (const asset of parsed.manifest.assets) {
    if (!zip.getEntry(asset.source)) {
      throw new Error(`Archive missing payload file: ${asset.source}`);
    }
  }

  return {
    manifest: parsed.manifest,
    archivePath,
    entries
  };
}
