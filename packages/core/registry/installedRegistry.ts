import fs from 'node:fs/promises';
import type { InstalledPackageRecord, InstalledRegistry } from '@shared/types';

const EMPTY_REGISTRY: InstalledRegistry = { packages: [] };

export async function readInstalledRegistry(registryFile: string): Promise<InstalledRegistry> {
  try {
    const content = await fs.readFile(registryFile, 'utf8');
    return JSON.parse(content) as InstalledRegistry;
  } catch {
    return EMPTY_REGISTRY;
  }
}

export async function writeInstalledRegistry(registryFile: string, registry: InstalledRegistry): Promise<void> {
  await fs.writeFile(registryFile, JSON.stringify(registry, null, 2));
}

export async function upsertInstalledPackage(registryFile: string, record: InstalledPackageRecord): Promise<void> {
  const registry = await readInstalledRegistry(registryFile);
  const nextPackages = registry.packages.filter((item) => item.installId !== record.installId);
  nextPackages.push(record);
  await writeInstalledRegistry(registryFile, { packages: nextPackages });
}

export async function removeInstalledPackage(registryFile: string, installId: string): Promise<InstalledPackageRecord | null> {
  const registry = await readInstalledRegistry(registryFile);
  const existing = registry.packages.find((item) => item.installId === installId) ?? null;
  await writeInstalledRegistry(registryFile, {
    packages: registry.packages.filter((item) => item.installId !== installId)
  });
  return existing;
}
