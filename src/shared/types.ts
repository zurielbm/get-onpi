export type SupportedPlatform = 'macos' | 'windows';

export type AssetType =
  | 'fusion-template'
  | 'fusion-macro'
  | 'fuse'
  | 'script'
  | 'lut'
  | 'dctl';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export type InstallScope = 'user';

export type PackageAsset = {
  id: string;
  type: AssetType;
  source: string;
  target: string;
};

export type OnpiManifest = {
  formatVersion: string;
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  createdWith: string;
  createdWithVersion: string;
  minAppVersion: string;
  minResolveVersion: string;
  maxResolveVersion?: string;
  homepage?: string;
  supportUrl?: string;
  tags?: string[];
  category?: string;
  icon?: string;
  readme?: string;
  registryPackageId?: string;
  channel?: string;
  publishedVersionId?: string;
  platforms: SupportedPlatform[];
  assets: PackageAsset[];
};

export type ValidationIssue = {
  severity: ValidationSeverity;
  message: string;
  field?: string;
};

export type ClassifiedFile = {
  assetId: string;
  absolutePath: string;
  relativeSourcePath: string;
  fileName: string;
  detectedType: AssetType | null;
  targetPath: string;
  warnings: string[];
};

export type PackageBuilderInput = {
  manifest: Omit<OnpiManifest, 'assets'>;
  assets: ClassifiedFile[];
  outputPath: string;
};

export type PackageReadResult = {
  manifest: OnpiManifest;
  archivePath: string;
  entries: string[];
};

export type InstallPreviewItem = {
  assetId: string;
  type: AssetType;
  logicalTarget: string;
  absoluteTarget: string;
  exists: boolean;
  requiresElevation: boolean;
};

export type InstallPreview = {
  manifest: OnpiManifest;
  items: InstallPreviewItem[];
  warnings: string[];
};

export type InstalledFileRecord = {
  assetId: string;
  targetPath: string;
  backupPath?: string;
};

export type InstalledPackageRecord = {
  installId: string;
  packageId: string;
  name: string;
  version: string;
  author: string;
  installedAt: string;
  installScope: InstallScope;
  manifestHash: string;
  sourcePackagePath: string;
  installedFiles: InstalledFileRecord[];
  remotePackageId?: string;
  remoteVersionId?: string;
  updateChannel?: string;
  lastUpdateCheckAt?: string;
};

export type InstalledRegistry = {
  packages: InstalledPackageRecord[];
};

export type AppSettings = {
  defaultInstallScope: InstallScope;
  defaultExportDirectory: string | null;
};

export type AppDirectories = {
  root: string;
  logs: string;
  temp: string;
  backups: string;
  registryFile: string;
  settingsFile: string;
};

export type UpdateCheckResult = null;

export interface PackageUpdateService {
  checkLatestVersion(packageId: string, currentVersion: string): Promise<UpdateCheckResult>;
}

export type RendererApi = {
  getAppVersion: () => Promise<string>;
  pickSourceFiles: () => Promise<string[]>;
  pickPackageFile: () => Promise<string | null>;
  exportPackage: (input: PackageBuilderInput) => Promise<{ outputPath: string; issues: ValidationIssue[] }>;
  parsePackage: (archivePath: string) => Promise<PackageReadResult>;
  previewInstall: (archivePath: string, scope: InstallScope) => Promise<InstallPreview>;
  installPackage: (archivePath: string, scope: InstallScope) => Promise<InstalledPackageRecord>;
  getInstalledPackages: () => Promise<InstalledPackageRecord[]>;
  uninstallPackage: (installId: string) => Promise<void>;
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: AppSettings) => Promise<AppSettings>;
  revealPath: (targetPath: string) => Promise<void>;
  openLogsFolder: () => Promise<void>;
  clearTempFiles: () => Promise<void>;
};
