import fs from 'node:fs/promises';
import path from 'node:path';

export async function collectFiles(inputPaths: string[]): Promise<string[]> {
  const files: string[] = [];

  for (const inputPath of inputPaths) {
    const stat = await fs.stat(inputPath);
    if (stat.isDirectory()) {
      const entries = await fs.readdir(inputPath);
      const nested = entries.map((entry) => path.join(inputPath, entry));
      files.push(...(await collectFiles(nested)));
    } else {
      files.push(inputPath);
    }
  }

  return files;
}
