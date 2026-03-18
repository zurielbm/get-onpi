import fs from 'node:fs/promises';
import path from 'node:path';
import { app, dialog, ipcMain, shell } from 'electron';
import type { AppSettings, PackageBuilderInput } from '@shared/types';
import { buildArchive } from '@core/packaging/archiveBuilder';
import { readArchive } from '@core/packaging/archiveReader';
import { createInstallPreview } from '@core/installer/installPreview';
import { installPackageFromArchive } from '@core/installer/installPackage';
import { uninstallPackageById } from '@core/installer/uninstallPackage';
import { readInstalledRegistry } from '@core/registry/installedRegistry';
import { logValidation } from '@core/logging/logger';
import { ensureAppDirectories } from '@main/services/appPaths';
import { readSettings, writeSettings } from '@main/services/settingsService';
import { collectFiles } from '@main/services/fileSystem';

export function registerOnpiIpc(): void {
  ipcMain.handle('app:version', async () => app.getVersion());

  ipcMain.handle('files:pick-sources', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory', 'multiSelections']
    });
    if (result.canceled) {
      return [];
    }
    return collectFiles(result.filePaths);
  });

  ipcMain.handle('files:pick-package', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'ONPI Packages', extensions: ['onpi'] }]
    });
    if (result.canceled) {
      return null;
    }
    return result.filePaths[0] ?? null;
  });

  ipcMain.handle('package:export', async (_event, input: PackageBuilderInput) => {
    const appDirs = await ensureAppDirectories();
    const settings = await readSettings(appDirs.settingsFile);
    const defaultDir = settings.defaultExportDirectory ?? path.dirname(input.outputPath);
    const saveResult = await dialog.showSaveDialog({
      defaultPath: path.join(defaultDir, path.basename(input.outputPath)),
      filters: [{ name: 'ONPI Packages', extensions: ['onpi'] }]
    });

    if (saveResult.canceled || !saveResult.filePath) {
      throw new Error('Export canceled');
    }

    const result = await buildArchive({
      ...input,
      outputPath: saveResult.filePath
    });
    for (const issue of result.issues) {
      await logValidation(appDirs.logs, `${issue.severity}: ${issue.message}`);
    }
    return result;
  });

  ipcMain.handle('package:parse', async (_event, archivePath: string) => readArchive(archivePath));
  ipcMain.handle('package:preview-install', async (_event, archivePath: string, scope) => createInstallPreview(archivePath, scope));

  ipcMain.handle('package:install', async (_event, archivePath: string, scope) => {
    const appDirs = await ensureAppDirectories();
    return installPackageFromArchive(archivePath, scope, appDirs);
  });

  ipcMain.handle('package:list-installed', async () => {
    const appDirs = await ensureAppDirectories();
    const registry = await readInstalledRegistry(appDirs.registryFile);
    return registry.packages.sort((a, b) => b.installedAt.localeCompare(a.installedAt));
  });

  ipcMain.handle('package:uninstall', async (_event, installId: string) => {
    const appDirs = await ensureAppDirectories();
    await uninstallPackageById(appDirs.registryFile, appDirs.logs, installId);
  });

  ipcMain.handle('settings:get', async () => {
    const appDirs = await ensureAppDirectories();
    return readSettings(appDirs.settingsFile);
  });

  ipcMain.handle('settings:save', async (_event, settings: AppSettings) => {
    const appDirs = await ensureAppDirectories();
    return writeSettings(appDirs.settingsFile, settings);
  });

  ipcMain.handle('shell:reveal-path', async (_event, targetPath: string) => {
    if (targetPath) {
      shell.showItemInFolder(targetPath);
    }
  });

  ipcMain.handle('shell:open-logs', async () => {
    const appDirs = await ensureAppDirectories();
    shell.openPath(appDirs.logs);
  });

  ipcMain.handle('files:clear-temp', async () => {
    const appDirs = await ensureAppDirectories();
    const entries = await fs.readdir(appDirs.temp);
    await Promise.all(entries.map((entry) => fs.rm(path.join(appDirs.temp, entry), { recursive: true, force: true })));
  });
}
