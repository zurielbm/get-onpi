import type { PackageUpdateService, UpdateCheckResult } from '@shared/types';

export class NullPackageUpdateService implements PackageUpdateService {
  async checkLatestVersion(_packageId: string, _currentVersion: string): Promise<UpdateCheckResult> {
    return null;
  }
}
