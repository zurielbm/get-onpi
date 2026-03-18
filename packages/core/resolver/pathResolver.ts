import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { InstallScope, SupportedPlatform } from '@shared/types';

export type ResolveTargetInput = {
  logicalTarget: string;
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

export function detectPlatform(): SupportedPlatform {
  return process.platform === 'win32' ? 'windows' : 'macos';
}

export function resolveTargetPath(input: ResolveTargetInput): ResolveTargetResult {
  const normalizedLogicalTarget = assertLogicalTarget(input.logicalTarget);
  const root = getResolveSupportRoot(input.platform, input.installScope);
  const absolutePath = path.join(root, ...normalizedLogicalTarget.split('/'));
  return {
    absolutePath,
    requiresElevation: false,
    exists: fs.existsSync(absolutePath)
  };
}
