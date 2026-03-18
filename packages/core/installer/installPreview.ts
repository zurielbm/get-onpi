import type { InstallPreview, InstallScope, PackageVariant } from '@shared/types';
import { readArchive } from '@core/packaging/archiveReader';
import { detectPlatform, resolveTargetPath } from '@core/resolver/pathResolver';

export async function createInstallPreview(archivePath: string, scope: InstallScope, variant: PackageVariant): Promise<InstallPreview> {
  const parsed = await readArchive(archivePath);
  const platform = detectPlatform();
  const items = parsed.manifest.assets.filter((asset) => asset.variant === variant).map((asset) => {
    const resolved = resolveTargetPath({
      logicalTarget: asset.target,
      packageId: parsed.manifest.id,
      packageName: parsed.manifest.name,
      packageAuthor: parsed.manifest.author,
      installNamespace: parsed.manifest.installNamespace,
      installScope: scope,
      platform
    });
    return {
      assetId: asset.id,
      type: asset.type,
      variant: asset.variant,
      logicalTarget: asset.target,
      absoluteTarget: resolved.absolutePath,
      exists: resolved.exists,
      requiresElevation: resolved.requiresElevation
    };
  });

  const warnings = items.filter((item) => item.exists).map((item) => `Overwrite warning: ${item.absoluteTarget}`);

  return {
    manifest: parsed.manifest,
    variant,
    items,
    warnings
  };
}
