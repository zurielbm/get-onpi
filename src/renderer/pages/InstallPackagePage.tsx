import type { InstallPreview, OnpiManifest } from '@shared/types';

type InstallPackagePageProps = {
  archivePath: string | null;
  manifest: OnpiManifest | null;
  preview: InstallPreview | null;
  installError: string | null;
  isLoading: boolean;
  onPickPackage: () => Promise<void>;
  onDropPackage: (filePath: string) => Promise<void>;
  onInstall: () => Promise<void>;
};

export function InstallPackagePage({
  archivePath,
  manifest,
  preview,
  installError,
  isLoading,
  onPickPackage,
  onDropPackage,
  onInstall
}: InstallPackagePageProps) {
  const assetCount = preview?.items.length ?? 0;
  const overwriteCount = preview?.items.filter((item) => item.exists).length ?? 0;

  return (
    <section className="stack">
      <header className="page-header">
        <div className="page-title">
          <span className="eyebrow">Install Package</span>
          <h2>Install a package.</h2>
          <p>Open, preview, install.</p>
        </div>
        <div className="page-actions">
          <span className="chip-label">Current user only</span>
          <button className="primary-action" onClick={() => void onInstall()} disabled={!archivePath}>
            Install for Current User
          </button>
        </div>
      </header>

      <div
        className="panel dropzone is-hero"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0] as (File & { path?: string }) | undefined;
          const droppedPath = file?.path;
          if (droppedPath?.toLowerCase().endsWith('.onpi')) {
            void onDropPackage(droppedPath);
          }
        }}
      >
        <div className="dropzone-copy">
          <span className="eyebrow">Open Package</span>
          <h3>Select `.onpi` package</h3>
          <p>User install only.</p>
          <button className="secondary-action" onClick={() => void onPickPackage()}>
            Browse for Package
          </button>
          {archivePath ? <span className="table-note">{archivePath}</span> : null}
        </div>
        <div className="dropzone-graphic">
          <div className="dropzone-tile" />
          <div className="dropzone-tile is-accent" />
        </div>
      </div>

      {isLoading ? (
        <div className="panel">
          <span className="eyebrow">Working</span>
          <h3>Preparing install preview</h3>
          <p>Reading package and paths.</p>
        </div>
      ) : null}

      {installError ? (
        <div className="issue issue-error">
          <strong>ERROR</strong>
          <span>{installError}</span>
        </div>
      ) : null}

      {!manifest && !isLoading && !installError ? (
        <div className="page-grid">
          <div className="mini-card">
            <h3>Install Workflow</h3>
            <p>Preview before install.</p>
          </div>
          <div className="mini-card">
            <h3>MVP Rules</h3>
            <p>Backups on overwrite. No scripts.</p>
          </div>
        </div>
      ) : null}

      {manifest ? (
        <>
          <div className="kpi-row">
            <div className="kpi">
              <span className="kpi-label">Assets</span>
              <strong>{assetCount}</strong>
            </div>
            <div className="kpi">
              <span className="kpi-label">Overwrites</span>
              <strong>{overwriteCount}</strong>
            </div>
            <div className="kpi">
              <span className="kpi-label">Scope</span>
              <strong>User</strong>
            </div>
          </div>
          <div className="page-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Package Summary</h3>
                <div className="panel-subtitle">Package details.</div>
              </div>
              <span className="mini-pill">{manifest.assets.length} assets</span>
            </div>
            <dl className="summary-grid">
              <div>
                <dt>Name</dt>
                <dd>{manifest.name}</dd>
              </div>
              <div>
                <dt>Version</dt>
                <dd>{manifest.version}</dd>
              </div>
              <div>
                <dt>Author</dt>
                <dd>{manifest.author}</dd>
              </div>
              <div>
                <dt>Assets</dt>
                <dd>{manifest.assets.length}</dd>
              </div>
            </dl>
            <p>{manifest.description}</p>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Warnings</h3>
                <div className="panel-subtitle">Issues before install.</div>
              </div>
            </div>
            {preview?.warnings.length ? (
              <div className="issue-list">
                {preview.warnings.map((warning) => (
                  <div key={warning} className="issue issue-warning">
                    <strong>WARNING</strong>
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No overwrite warnings detected.</p>
            )}
          </div>
          </div>
        </>
      ) : null}

      {preview ? (
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Install Preview</h3>
                <div className="panel-subtitle">Resolved paths.</div>
            </div>
          </div>
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Logical target</th>
                  <th>Resolved destination</th>
                </tr>
              </thead>
              <tbody>
                {preview.items.map((item) => (
                  <tr key={item.assetId}>
                    <td>{item.type}</td>
                    <td>{item.logicalTarget}</td>
                    <td>
                      <strong>{item.absoluteTarget}</strong>
                      <span className="table-note">{item.exists ? 'Existing file will be backed up.' : 'New file path.'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
