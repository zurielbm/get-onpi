import { z } from 'zod';

const semverLike = /^\d+\.\d+\.\d+([-.][0-9A-Za-z-.]+)?$/;
const resolveVersionLike = /^\d+(\.\d+)?(\.x)?$/;

export const assetSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['fusion-template', 'fusion-macro', 'fuse', 'script', 'lut', 'dctl']),
  source: z.string().min(1),
  target: z.string().min(1)
});

export const manifestSchema = z.object({
  formatVersion: z.string().regex(semverLike),
  id: z.string().min(3),
  name: z.string().min(1),
  version: z.string().regex(semverLike),
  author: z.string().min(1),
  description: z.string().min(1),
  createdWith: z.string().min(1),
  createdWithVersion: z.string().regex(semverLike),
  minAppVersion: z.string().regex(semverLike),
  minResolveVersion: z.string().regex(resolveVersionLike),
  maxResolveVersion: z.string().regex(resolveVersionLike).optional(),
  homepage: z.url().optional(),
  supportUrl: z.url().optional(),
  tags: z.array(z.string().min(1)).optional(),
  category: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  readme: z.string().min(1).optional(),
  registryPackageId: z.string().min(1).optional(),
  channel: z.string().min(1).optional(),
  publishedVersionId: z.string().min(1).optional(),
  platforms: z.array(z.enum(['macos', 'windows'])).min(1),
  assets: z.array(assetSchema).min(1)
});
