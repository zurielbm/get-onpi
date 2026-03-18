import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import AdmZip from 'adm-zip';
import type { AppDirectories, InstallScope, InstalledFileRecord, InstalledPackageRecord } from '@shared/types';
import { createInstallPreview } from './installPreview';
import { upsertInstalledPackage } from '@core/registry/installedRegistry';
import { logError, logInstall } from '@core/logging/logger';

export async function installPackageFromArchive(
  archivePath: string,
  scope: InstallScope,
  appDirectories: AppDirectories
): Promise<InstalledPackageRecord> {
  const preview = await createInstallPreview(archivePath, scope);
  const zip = new AdmZip(archivePath);
  const installId = crypto.randomUUID();
  const installedFiles: InstalledFileRecord[] = [];
  const createdBackups: string[] = [];

  try {
    for (const item of preview.items) {
      const asset = preview.manifest.assets.find((entry) => entry.id === item.assetId);
      if (!asset) {
        throw new Error(`Missing asset metadata for ${item.assetId}`);
      }

      const entry = zip.getEntry(asset.source);
      if (!entry) {
        throw new Error(`Missing archive entry for ${asset.source}`);
      }

      await fs.mkdir(path.dirname(item.absoluteTarget), { recursive: true });
      let backupPath: string | undefined;
      try {
        await fs.access(item.absoluteTarget);
        backupPath = path.join(appDirectories.backups, `${installId}-${path.basename(item.absoluteTarget)}.bak`);
        await fs.mkdir(path.dirname(backupPath), { recursive: true });
        await fs.copyFile(item.absoluteTarget, backupPath);
        createdBackups.push(backupPath);
      } catch {
        backupPath = undefined;
      }

      await fs.writeFile(item.absoluteTarget, entry.getData());
      installedFiles.push({
        assetId: item.assetId,
        targetPath: item.absoluteTarget,
        backupPath
      });
      await logInstall(appDirectories.logs, `installed ${item.assetId} -> ${item.absoluteTarget}`);
    }

    const manifestHash = crypto.createHash('sha256').update(JSON.stringify(preview.manifest)).digest('hex');
    const record: InstalledPackageRecord = {
      installId,
      packageId: preview.manifest.id,
      name: preview.manifest.name,
      version: preview.manifest.version,
      author: preview.manifest.author,
      installedAt: new Date().toISOString(),
      installScope: scope,
      manifestHash,
      sourcePackagePath: archivePath,
      installedFiles
    };

    await upsertInstalledPackage(appDirectories.registryFile, record);
    return record;
  } catch (error) {
    for (const file of installedFiles.reverse()) {
      await fs.rm(file.targetPath, { force: true });
      if (file.backupPath) {
        await fs.copyFile(file.backupPath, file.targetPath);
      }
    }
    for (const backupPath of createdBackups) {
      await fs.rm(backupPath, { force: true });
    }
    await logError(appDirectories.logs, `install failed for ${archivePath}: ${(error as Error).message}`);
    throw error;
  }
}
