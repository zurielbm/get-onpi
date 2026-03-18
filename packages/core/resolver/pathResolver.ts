import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { InstallNamespace, InstallScope, SupportedPlatform } from '@shared/types';

export type ResolveTargetInput = {
  logicalTarget: string;
  packageId: string;
  packageName: string;
  packageAuthor: string;
  installNamespace?: InstallNamespace;
  installScope: InstallScope;
  platform: SupportedPlatform;
};

export type ResolveTargetResult = {
  absolutePath: string;
  requiresElevation: boolean;
  exists: boolean;
};

function getResolveSupportRoot(platform: SupportedPlatform, scope: InstallScope): string {
  if (scope !== 'user') {
    throw new Error('Only user-level install scope is supported in MVP.');
  }

  if (platform === 'macos') {
    return path.join(os.homedir(), 'Library', 'Application Support', 'Blackmagic Design', 'DaVinci Resolve', 'Support');
  }

  return path.join(process.env.APPDATA ?? path.join(os.homedir(), 'AppData', 'Roaming'), 'Blackmagic Design', 'DaVinci Resolve', 'Support');
}

function assertLogicalTarget(logicalTarget: string): string {
  const normalized = path.posix.normalize(logicalTarget).replace(/^\/+/, '');
  if (normalized.startsWith('../') || normalized.includes('/../') || path.posix.isAbsolute(logicalTarget)) {
    throw new Error(`Invalid logical target: ${logicalTarget}`);
  }
  return normalized;
}

function normalizePackageDirectoryName(packageId: string): string {
  const normalized = packageId.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  if (!normalized) {
    throw new Error(`Invalid package id for install path: ${packageId}`);
  }
  return normalized;
}

function resolveInstallNamespace(input: ResolveTargetInput): string[] {
  const brand = normalizePackageDirectoryName(input.installNamespace?.brand || input.packageAuthor || 'creator');
  const product = normalizePackageDirectoryName(input.installNamespace?.product || input.packageName || input.packageId);
  return [brand, product];
}

export function detectPlatform(): SupportedPlatform {
  return process.platform === 'win32' ? 'windows' : 'macos';
}

export function resolveTargetPath(input: ResolveTargetInput): ResolveTargetResult {
  const normalizedLogicalTarget = assertLogicalTarget(input.logicalTarget);
  const installNamespaceSegments = resolveInstallNamespace(input);
  const root = getResolveSupportRoot(input.platform, input.installScope);
  const segments = normalizedLogicalTarget.split('/').filter(Boolean);
  const fileName = segments.pop();
  if (!fileName) {
    throw new Error(`Invalid logical target: ${input.logicalTarget}`);
  }

  const absolutePath = path.join(root, ...segments, ...installNamespaceSegments, fileName);
  return {
    absolutePath,
    requiresElevation: false,
    exists: fs.existsSync(absolutePath)
  };
}
