import fs from 'node:fs/promises';
import path from 'node:path';

async function appendLine(logsDir: string, fileName: string, message: string): Promise<void> {
  const logFile = path.join(logsDir, fileName);
  await fs.mkdir(path.dirname(logFile), { recursive: true });
  await fs.appendFile(logFile, `${new Date().toISOString()} ${message}\n`);
}

export async function logInstall(logsDir: string, message: string): Promise<void> {
  await appendLine(logsDir, 'install.log', message);
}

export async function logUninstall(logsDir: string, message: string): Promise<void> {
  await appendLine(logsDir, 'uninstall.log', message);
}

export async function logValidation(logsDir: string, message: string): Promise<void> {
  await appendLine(logsDir, 'validation.log', message);
}

export async function logError(logsDir: string, message: string): Promise<void> {
  await appendLine(logsDir, 'error.log', message);
}
