import fs from 'node:fs/promises';
import path from 'node:path';
import { buildArchive } from '../packages/core/packaging/archiveBuilder';
import { FORMAT_VERSION } from '../src/shared/constants';

async function main(): Promise<void> {
  const fixtureRoot = path.resolve('fixtures/sample-package');
  const payloadRoot = path.join(fixtureRoot, 'payload-source');
  await fs.mkdir(payloadRoot, { recursive: true });

  const settingPath = path.join(payloadRoot, 'CinematicTitle.setting');
  await fs.writeFile(settingPath, '<Tools></Tools>');

  const outputPath = path.join(fixtureRoot, 'cinematic-titles-1.0.0.onpi');
  const result = await buildArchive({
    outputPath,
    manifest: {
      formatVersion: FORMAT_VERSION,
      id: 'com.creator.cinematictitles',
      name: 'Cinematic Titles',
      version: '1.0.0',
      author: 'Creator Name',
      description: 'A set of cinematic title templates for DaVinci Resolve.',
      createdWith: 'ONPI Desktop',
      createdWithVersion: '0.1.0',
      minAppVersion: '0.1.0',
      minResolveVersion: '18.0',
      platforms: ['macos', 'windows'],
      category: 'Titles',
      tags: ['titles', 'cinematic']
    },
    assets: [
      {
        assetId: 'asset-001',
        absolutePath: settingPath,
        relativeSourcePath: 'Templates/Edit/Titles/CinematicTitle.setting',
        fileName: 'CinematicTitle.setting',
        detectedType: 'fusion-template',
        targetPath: 'Fusion/Templates/Edit/Titles/CinematicTitle.setting',
        warnings: []
      }
    ]
  });

  if (result.issues.some((issue) => issue.severity === 'error')) {
    throw new Error(`Fixture build failed: ${JSON.stringify(result.issues)}`);
  }
}

void main();
