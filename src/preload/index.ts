import { contextBridge, ipcRenderer } from 'electron';
import type { AppSettings, InstallScope, PackageBuilderInput, PackageVariant, RendererApi } from '@shared/types';

const api: RendererApi = {
  getAppVersion: () => ipcRenderer.invoke('app:version'),
  pickSourceFiles: () => ipcRenderer.invoke('files:pick-sources'),
  pickIconFile: () => ipcRenderer.invoke('files:pick-icon'),
  readImageDataUrl: (filePath: string) => ipcRenderer.invoke('files:read-image-data-url', filePath),
  pickPackageFile: () => ipcRenderer.invoke('files:pick-package'),
  exportPackage: (input: PackageBuilderInput) => ipcRenderer.invoke('package:export', input),
  parsePackage: (archivePath: string) => ipcRenderer.invoke('package:parse', archivePath),
  previewInstall: (archivePath: string, scope: InstallScope, variant: PackageVariant) =>
    ipcRenderer.invoke('package:preview-install', archivePath, scope, variant),
  installPackage: (archivePath: string, scope: InstallScope, variant: PackageVariant) =>
    ipcRenderer.invoke('package:install', archivePath, scope, variant),
  getInstalledPackages: () => ipcRenderer.invoke('package:list-installed'),
  uninstallPackage: (installId: string) => ipcRenderer.invoke('package:uninstall', installId),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings: AppSettings) => ipcRenderer.invoke('settings:save', settings),
  revealPath: (targetPath: string) => ipcRenderer.invoke('shell:reveal-path', targetPath),
  openLogsFolder: () => ipcRenderer.invoke('shell:open-logs'),
  clearTempFiles: () => ipcRenderer.invoke('files:clear-temp')
};

contextBridge.exposeInMainWorld('onpi', api);
