import type { InstalledPackageRecord } from '@shared/types';
import { FolderIcon, TrashIcon } from '@renderer/components/Icons';

type InstalledPackagesPageProps = {
  packages: InstalledPackageRecord[];
  onUninstall: (installId: string) => Promise<void>;
  onRevealPath: (targetPath: string) => Promise<void>;
};

export function InstalledPackagesPage({ packages, onUninstall, onRevealPath }: InstalledPackagesPageProps) {
  return (
    <section className="stack">
      <header className="page-header">
        <div className="page-title">
          <span className="eyebrow">Installed Packages</span>
          <h2>Installed packages.</h2>
          <p>Tracked and removable.</p>
        </div>
      </header>

      <div className="section-grid">
        {packages.length === 0 ? (
          <div className="empty-state">
            <span className="eyebrow">Empty</span>
            <h2>No packages installed yet.</h2>
            <p>Installed packages will appear here.</p>
          </div>
        ) : null}
        {packages.length > 0 ? (
          <div className="kpi-row">
            <div className="kpi">
              <span className="kpi-label">Packages</span>
              <strong>{packages.length}</strong>
            </div>
            <div className="kpi">
              <span className="kpi-label">Files</span>
              <strong>{packages.reduce((count, item) => count + item.installedFiles.length, 0)}</strong>
            </div>
          </div>
        ) : null}
        {packages.map((item) => (
          <article key={item.installId} className="panel installed-card">
            <div className="installed-meta">
              <div className={`cover-thumb ${item.installedFiles.length % 3 === 1 ? 'is-blue' : item.installedFiles.length % 3 === 2 ? 'is-purple' : ''}`} />
              <div>
                <span className="eyebrow">{item.packageId}</span>
                <h3>
                  {item.name} <small>{item.version}</small>
                </h3>
                <p>
                  Installed {new Date(item.installedAt).toLocaleString()} by {item.author}.
                </p>
                <div className="status-row">
                  <span className="mini-pill">{item.installedFiles.length} tracked files</span>
                  <span className="mini-pill">{item.installScope}</span>
                </div>
              </div>
            </div>
            <div className="inline-actions">
              <button className="secondary-action" onClick={() => void onRevealPath(item.installedFiles[0]?.targetPath ?? '')}>
                <FolderIcon size={16} />
                View Files
              </button>
              <button className="danger-action" onClick={() => void onUninstall(item.installId)}>
                <TrashIcon size={16} />
                Uninstall
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
