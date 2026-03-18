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
export type PackageVariant = 'standard' | 'emoji';

export type PackageAsset = {
  id: string;
  type: AssetType;
  source: string;
  target: string;
  variant: PackageVariant;
};

export type InstallNamespace = {
  brand: string;
  product: string;
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
  installNamespace?: InstallNamespace;
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
  variant: PackageVariant;
  warnings: string[];
};

export type PackageBuilderInput = {
  manifest: Omit<OnpiManifest, 'assets'>;
  assets: ClassifiedFile[];
  iconSourcePath?: string;
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
  variant: PackageVariant;
  logicalTarget: string;
  absoluteTarget: string;
  exists: boolean;
  requiresElevation: boolean;
};

export type InstallPreview = {
  manifest: OnpiManifest;
  variant: PackageVariant;
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
  variant: PackageVariant;
  manifestHash: string;
  sourcePackagePath: string;
  installedFiles: InstalledFileRecord[];
  ownedDirectories?: string[];
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
  emojiDetectionContains: string[];
  emojiDetectionSuffixes: string[];
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
  pickIconFile: () => Promise<string | null>;
  readImageDataUrl: (filePath: string) => Promise<string>;
  pickPackageFile: () => Promise<string | null>;
  exportPackage: (input: PackageBuilderInput) => Promise<{ outputPath: string; issues: ValidationIssue[] }>;
  parsePackage: (archivePath: string) => Promise<PackageReadResult>;
  previewInstall: (archivePath: string, scope: InstallScope, variant: PackageVariant) => Promise<InstallPreview>;
  installPackage: (archivePath: string, scope: InstallScope, variant: PackageVariant) => Promise<InstalledPackageRecord>;
  getInstalledPackages: () => Promise<InstalledPackageRecord[]>;
  uninstallPackage: (installId: string) => Promise<void>;
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: AppSettings) => Promise<AppSettings>;
  revealPath: (targetPath: string) => Promise<void>;
  openLogsFolder: () => Promise<void>;
  clearTempFiles: () => Promise<void>;
};
