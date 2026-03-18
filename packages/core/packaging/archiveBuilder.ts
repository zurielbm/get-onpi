import fs from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';
import type { OnpiManifest, PackageBuilderInput } from '@shared/types';
import { validatePackageInput } from '@core/validation/validatePackage';

function normalizeArchivePath(value: string): string {
  return value.split(path.sep).join('/').replace(/^\/+/, '');
}

export async function buildArchive(input: PackageBuilderInput): Promise<{ outputPath: string; issues: ReturnType<typeof validatePackageInput> }> {
  const issues = validatePackageInput(input);
  if (issues.some((issue) => issue.severity === 'error')) {
    return { outputPath: input.outputPath, issues };
  }

  const zip = new AdmZip();
  const iconArchivePath = input.manifest.icon ? normalizeArchivePath(input.manifest.icon) : undefined;
  const manifest: OnpiManifest = {
    ...input.manifest,
    icon: iconArchivePath,
    assets: input.assets.map((asset) => ({
      id: asset.assetId,
      type: asset.detectedType!,
      source: `payload/${normalizeArchivePath(asset.relativeSourcePath)}`,
      target: normalizeArchivePath(asset.targetPath),
      variant: asset.variant
    }))
  };

  zip.addFile('package.json', Buffer.from(JSON.stringify(manifest, null, 2)));

  if (iconArchivePath && input.iconSourcePath) {
    zip.addLocalFile(input.iconSourcePath, path.posix.dirname(iconArchivePath), path.posix.basename(iconArchivePath));
  }

  for (const asset of input.assets) {
    const archivePath = `payload/${normalizeArchivePath(asset.relativeSourcePath)}`;
    zip.addLocalFile(asset.absolutePath, path.posix.dirname(archivePath), path.posix.basename(archivePath));
  }

  await fs.promises.mkdir(path.dirname(input.outputPath), { recursive: true });
  zip.writeZip(input.outputPath);
  return { outputPath: input.outputPath, issues };
}
