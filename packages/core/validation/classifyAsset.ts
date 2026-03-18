import type { AssetType, ClassifiedFile } from '@shared/types';

function normalizeSlashes(value: string): string {
  return value.replace(/\\/g, '/');
}

function fileNameOf(filePath: string): string {
  const normalized = normalizeSlashes(filePath);
  return normalized.split('/').filter(Boolean).pop() ?? filePath;
}

function extNameOf(filePath: string): string {
  const fileName = fileNameOf(filePath);
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : '';
}

function normalizeRelativePath(value: string): string {
  return normalizeSlashes(value).replace(/^\/+/, '');
}

function detectType(filePath: string): AssetType | null {
  const ext = extNameOf(filePath);
  if (ext === '.setting') {
    return /macro/i.test(filePath) ? 'fusion-macro' : 'fusion-template';
  }
  if (ext === '.fuse') {
    return 'fuse';
  }
  if (ext === '.py' || ext === '.lua') {
    return 'script';
  }
  if (ext === '.cube') {
    return 'lut';
  }
  if (ext === '.dctl') {
    return 'dctl';
  }
  return null;
}

function defaultTargetFor(filePath: string, type: AssetType | null): string {
  const fileName = fileNameOf(filePath);
  if (type === 'fusion-template') {
    return `Fusion/Templates/Edit/Titles/${fileName}`;
  }
  if (type === 'fusion-macro') {
    return `Fusion/Templates/Edit/Effects/${fileName}`;
  }
  if (type === 'fuse') {
    return `Fusion/Fuses/${fileName}`;
  }
  if (type === 'script') {
    return `Fusion/Scripts/Utility/${fileName}`;
  }
  if (type === 'lut') {
    return `LUT/${fileName}`;
  }
  if (type === 'dctl') {
    return `LUT/${fileName}`;
  }
  return `Unmapped/${fileName}`;
}

function slugifyAssetId(fileName: string, index: number): string {
  const normalized = fileNameOf(fileName);
  const baseName = normalized.includes('.') ? normalized.slice(0, normalized.lastIndexOf('.')) : normalized;
  return baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `asset-${index + 1}`;
}

export function classifyFiles(inputPaths: string[]): ClassifiedFile[] {
  return inputPaths.map((absolutePath, index) => {
    const fileName = fileNameOf(absolutePath);
    const detectedType = detectType(absolutePath);
    const warnings: string[] = [];
    if (!detectedType) {
      warnings.push('Unsupported file type. Assign manually before export.');
    }

    return {
      assetId: slugifyAssetId(fileName, index),
      absolutePath,
      relativeSourcePath: normalizeRelativePath(fileName),
      fileName,
      detectedType,
      targetPath: defaultTargetFor(absolutePath, detectedType),
      warnings
    };
  });
}
