import fs from 'node:fs/promises';
import { logUninstall } from '@core/logging/logger';
import { readInstalledRegistry, writeInstalledRegistry } from '@core/registry/installedRegistry';

export async function uninstallPackageById(registryFile: string, logsDir: string, installId: string): Promise<void> {
  const registry = await readInstalledRegistry(registryFile);
  const record = registry.packages.find((item) => item.installId === installId);
  if (!record) {
    throw new Error(`Install record not found: ${installId}`);
  }

  for (const file of record.installedFiles) {
    await fs.rm(file.targetPath, { force: true });
    if (file.backupPath) {
      await fs.copyFile(file.backupPath, file.targetPath);
      await fs.rm(file.backupPath, { force: true });
    }
    await logUninstall(logsDir, `removed ${file.targetPath}`);
  }

  await writeInstalledRegistry(registryFile, {
    packages: registry.packages.filter((item) => item.installId !== installId)
  });
}
