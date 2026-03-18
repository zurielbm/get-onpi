import type { InstallPreview, OnpiManifest, PackageVariant, ValidationIssue } from '@shared/types';

type InstallPackagePageProps = {
  archivePath: string | null;
  manifest: OnpiManifest | null;
  preview: InstallPreview | null;
  selectedVariant: PackageVariant;
  installError: string | null;
  installIssues: ValidationIssue[];
  isLoading: boolean;
  onPickPackage: () => Promise<void>;
  onDropPackage: (filePath: string) => Promise<void>;
  onVariantChange: (variant: PackageVariant) => Promise<void>;
  onInstall: () => Promise<void>;
};

function fileNameOf(filePath: string): string {
  return filePath.split(/[\\/]/).pop() ?? filePath;
}

export function InstallPackagePage({
  archivePath,
  manifest,
  preview,
  selectedVariant,
  installError,
  installIssues,
  isLoading,
  onPickPackage,
  onDropPackage,
  onVariantChange,
  onInstall
}: InstallPackagePageProps) {
  const assetCount = preview?.items.length ?? manifest?.assets.length ?? 0;
  const overwriteCount = preview?.items.filter((item) => item.exists).length ?? 0;
  const hasReadyPackage = Boolean(manifest && preview);
  const availableVariants = Array.from(new Set(manifest?.assets.map((asset) => asset.variant) ?? []));
  const packageLabel = manifest ? `${manifest.name} ${manifest.version}` : archivePath ? fileNameOf(archivePath) : 'No package selected';
  const manifestDescription =
    manifest?.description ?? 'Drag in a local `.onpi` archive to inspect metadata, package-owned install paths, and overwrite risk before installing.';

  return (
    <section className="stack install-page">
      <header className="panel install-header">
        <div className="install-header-copy">
          <span className="eyebrow">Install Package</span>
          <div className="install-title-row">
            <h2>{manifest ? manifest.name : 'Load a package for review.'}</h2>
            {manifest ? <span className="mini-pill">{manifest.version}</span> : null}
          </div>
          <p>{manifestDescription}</p>
          <div className="status-row">
            <span className="chip-label">{archivePath ? 'Archive loaded' : 'Awaiting archive'}</span>
            <span className="chip-label">{hasReadyPackage ? `${assetCount} assets scoped` : 'User install scope only'}</span>
            {availableVariants.length > 1 ? <span className="chip-label">Variant: {selectedVariant}</span> : null}
          </div>
        </div>
        <div className="install-header-actions">
          <div className="install-action-meta">
            <span className="chip-label">Current user only</span>
            <span className="table-note">Install remains disabled until the archive validates and the preview resolves.</span>
          </div>
          <button className="primary-action" onClick={() => void onInstall()} disabled={!hasReadyPackage || isLoading || Boolean(installError)}>
            {isLoading ? 'Preparing…' : 'Install Package'}
          </button>
        </div>
      </header>

      <div className="install-overview">
        <div
          className="panel dropzone is-hero install-dropzone"
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
          <div className="install-dropzone-copy">
            <div className="dropzone-copy">
              <span className="eyebrow">Archive Intake</span>
              <h3>Drop or browse for a package archive.</h3>
              <p>Only `.onpi` files are accepted. The app reads the manifest first, then previews every resolved target path.</p>
            </div>
            <div className="install-dropzone-actions">
              <button className="secondary-action" onClick={() => void onPickPackage()}>
                Browse for Package
              </button>
              <span className="mini-pill">{archivePath ? 'Ready to inspect' : 'Drag and drop enabled'}</span>
              {availableVariants.length > 1 ? (
                <label className="variant-picker">
                  <span>Install variant</span>
                  <select value={selectedVariant} onChange={(event) => void onVariantChange(event.target.value as PackageVariant)}>
                    {availableVariants.map((variant) => (
                      <option key={variant} value={variant}>
                        {variant}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
            </div>
            {archivePath ? (
              <div className="path-card">
                <strong>{fileNameOf(archivePath)}</strong>
                <span className="table-note">{archivePath}</span>
              </div>
            ) : (
              <div className="path-card is-placeholder">
                <strong>No archive selected yet</strong>
                <span className="table-note">Choose a local export or drop a package anywhere in this panel.</span>
              </div>
            )}
          </div>
          <div className="install-signal-grid" aria-hidden="true">
            <div className="signal-card">
              <span>Package</span>
              <strong>{manifest?.name ?? 'Waiting'}</strong>
            </div>
            <div className="signal-card">
              <span>Assets</span>
              <strong>{assetCount}</strong>
            </div>
            <div className="signal-card is-accent">
              <span>Overwrites</span>
              <strong>{overwriteCount}</strong>
            </div>
          </div>
        </div>

        <div className="panel install-sidecard">
          <div className="install-sidecard-head">
            <div>
              <h3>Package Pulse</h3>
              <div className="panel-subtitle">A compact read on what is about to be installed.</div>
            </div>
            <span className="mini-pill">{hasReadyPackage ? 'Ready' : 'Idle'}</span>
          </div>

          {manifest ? (
            <>
              <div className="manifest-identity">
                <strong>{packageLabel}</strong>
                <span>{manifest.author}</span>
              </div>
              <dl className="summary-grid install-summary-grid">
                <div>
                  <dt>Package ID</dt>
                  <dd>{manifest.id}</dd>
                </div>
                <div>
                  <dt>Platforms</dt>
                  <dd>{manifest.platforms.join(' / ')}</dd>
                </div>
                <div>
                  <dt>Resolve</dt>
                  <dd>{manifest.minResolveVersion}+</dd>
                </div>
              <div>
                <dt>Contents</dt>
                <dd>{manifest.assets.filter((asset) => asset.variant === selectedVariant).length} assets</dd>
              </div>
              {availableVariants.length > 1 ? (
                <div>
                  <dt>Variant</dt>
                  <dd>{selectedVariant}</dd>
                </div>
              ) : null}
            </dl>
          </>
          ) : (
            <div className="empty-state compact-empty install-empty">
              <span className="eyebrow">Preview First</span>
              <h2>Nothing is staged for install.</h2>
              <p>Load an archive to reveal the manifest, overwrite warnings, and final destination paths.</p>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="panel loading-panel">
          <span className="eyebrow">Working</span>
          <h3>Preparing install preview</h3>
          <p>Reading the archive, validating metadata, and resolving file targets.</p>
          <div className="loading-bar" aria-hidden="true">
            <span />
          </div>
        </div>
      ) : null}

      {installError ? (
        <div className="panel issue-panel">
          <div className="panel-header">
            <div>
              <h3>Package could not be loaded</h3>
              <div className="panel-subtitle">{installError}</div>
            </div>
            <span className="mini-pill">Blocked</span>
          </div>
          {installIssues.length > 0 ? (
            <div className="issue-list">
              {installIssues.map((issue, index) => (
                <div key={`${issue.field ?? issue.message}-${index}`} className={`issue issue-${issue.severity}`}>
                  <strong>{issue.field ? issue.field.toUpperCase() : issue.severity.toUpperCase()}</strong>
                  <span>{issue.message}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="issue issue-error">
              <strong>ERROR</strong>
              <span>{installError}</span>
            </div>
          )}
        </div>
      ) : null}

      {manifest ? (
        <div className="page-grid install-detail-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Manifest Summary</h3>
                <div className="panel-subtitle">Authoring metadata included in the archive.</div>
              </div>
              <span className="mini-pill">{manifest.assets.length} assets</span>
            </div>
            <dl className="summary-grid install-summary-grid">
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
                <dt>Created With</dt>
                <dd>{manifest.createdWith}</dd>
              </div>
            </dl>
            <p>{manifest.description}</p>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Install Readiness</h3>
                <div className="panel-subtitle">Warnings, overwrite risk, and install scope.</div>
              </div>
              <span className="mini-pill">{overwriteCount > 0 ? 'Review' : 'Clear'}</span>
            </div>

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
              <div className="issue issue-info">
                <strong>READY</strong>
                <span>No overwrite warnings detected for this package.</span>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {preview ? (
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Resolved Install Preview</h3>
              <div className="panel-subtitle">Final destinations on disk for every package asset, grouped under its package directory.</div>
            </div>
            <span className="mini-pill">{preview.items.length} file targets</span>
          </div>
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Logical target</th>
                  <th>Resolved destination</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {preview.items.map((item) => (
                  <tr key={item.assetId}>
                    <td>{item.type}</td>
                    <td>{item.logicalTarget}</td>
                    <td>
                      <strong>{item.absoluteTarget}</strong>
                    </td>
                    <td>
                      <span className={item.exists ? 'table-status is-warning' : 'table-status is-clear'}>
                        {item.exists ? 'Backup before replace' : 'New file'}
                      </span>
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
