import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';
import type { ClassifiedFile, PackageBuilderInput, ValidationIssue } from '@shared/types';

function hasTraversal(value: string): boolean {
  const normalized = path.posix.normalize(value);
  return normalized.startsWith('../') || normalized.includes('/../') || path.posix.isAbsolute(normalized);
}

function validateAssets(assets: ClassifiedFile[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const assetIds = new Set<string>();
  const targets = new Set<string>();

  for (const asset of assets) {
    if (!asset.detectedType) {
      issues.push({ severity: 'error', message: `Unsupported asset type for ${asset.fileName}`, field: asset.fileName });
    }
    if (assetIds.has(asset.assetId)) {
      issues.push({ severity: 'error', message: `Duplicate asset id: ${asset.assetId}`, field: asset.assetId });
    }
    assetIds.add(asset.assetId);
    if (targets.has(asset.targetPath)) {
      issues.push({ severity: 'error', message: `Duplicate target path: ${asset.targetPath}`, field: asset.targetPath });
    }
    targets.add(asset.targetPath);
    if (!fs.existsSync(asset.absolutePath)) {
      issues.push({ severity: 'error', message: `Missing source file: ${asset.absolutePath}`, field: asset.absolutePath });
    }
    if (hasTraversal(asset.targetPath)) {
      issues.push({ severity: 'error', message: `Invalid target path: ${asset.targetPath}`, field: asset.targetPath });
    }
  }

  return issues;
}

export function validatePackageInput(input: PackageBuilderInput): ValidationIssue[] {
  const issues = validateAssets(input.assets);
  if (!input.manifest.id) {
    issues.push({ severity: 'error', message: 'Package id is required', field: 'id' });
  }
  if (!semver.valid(input.manifest.version)) {
    issues.push({ severity: 'error', message: 'Version must be valid semver', field: 'version' });
  }
  if (!input.manifest.name) {
    issues.push({ severity: 'error', message: 'Package name is required', field: 'name' });
  }
  if (!input.manifest.author) {
    issues.push({ severity: 'error', message: 'Author is required', field: 'author' });
  }
  if (!input.manifest.description) {
    issues.push({ severity: 'error', message: 'Description is required', field: 'description' });
  }
  if (!input.manifest.readme) {
    issues.push({ severity: 'warning', message: 'No readme included', field: 'readme' });
  }
  if (!input.manifest.icon) {
    issues.push({ severity: 'warning', message: 'No icon included', field: 'icon' });
  }
  return issues;
}
