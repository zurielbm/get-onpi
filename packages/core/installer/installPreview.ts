import type { InstallPreview, InstallScope } from '@shared/types';
import { readArchive } from '@core/packaging/archiveReader';
import { detectPlatform, resolveTargetPath } from '@core/resolver/pathResolver';

export async function createInstallPreview(archivePath: string, scope: InstallScope): Promise<InstallPreview> {
  const parsed = await readArchive(archivePath);
  const platform = detectPlatform();
  const items = parsed.manifest.assets.map((asset) => {
    const resolved = resolveTargetPath({
      logicalTarget: asset.target,
      installScope: scope,
      platform
    });
    return {
      assetId: asset.id,
      type: asset.type,
      logicalTarget: asset.target,
      absoluteTarget: resolved.absolutePath,
      exists: resolved.exists,
      requiresElevation: resolved.requiresElevation
    };
  });

  const warnings = items.filter((item) => item.exists).map((item) => `Overwrite warning: ${item.absoluteTarget}`);

  return {
    manifest: parsed.manifest,
    items,
    warnings
  };
}
