import type { OnpiManifest, ValidationIssue } from '@shared/types';
import { manifestSchema } from './manifest.schema';

export function parseManifest(input: unknown): { manifest: OnpiManifest; issues: ValidationIssue[] } {
  const result = manifestSchema.safeParse(input);
  if (!result.success) {
    const issues: ValidationIssue[] = result.error.issues.map((issue) => ({
      severity: 'error',
      message: issue.message,
      field: issue.path.join('.')
    }));
    throw new Error(JSON.stringify(issues));
  }

  return { manifest: result.data, issues: [] };
}
