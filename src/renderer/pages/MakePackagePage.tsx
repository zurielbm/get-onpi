import type { DragEvent } from 'react';
import type { ClassifiedFile, OnpiManifest, ValidationIssue } from '@shared/types';
import { FolderIcon, ImageIcon, PackageIcon, TrashIcon } from '@renderer/components/Icons';

type ManifestDraft = Omit<OnpiManifest, 'assets'>;

type MakePackagePageProps = {
  manifestDraft: ManifestDraft;
  iconPreviewPath?: string;
  iconPreviewUrl?: string;
  files: ClassifiedFile[];
  validationIssues: ValidationIssue[];
  onManifestChange: (value: ManifestDraft) => void;
  onPickIcon: () => Promise<void>;
  onClearIcon: () => void;
  onPickFiles: () => Promise<void>;
  onDropFiles: (filePaths: string[]) => void;
  onFileChange: (index: number, patch: Partial<ClassifiedFile>) => void;
  onExport: () => Promise<void>;
};

export function MakePackagePage({
  manifestDraft,
  iconPreviewPath,
  iconPreviewUrl,
  files,
  validationIssues,
  onManifestChange,
  onPickIcon,
  onClearIcon,
  onPickFiles,
  onDropFiles,
  onFileChange,
  onExport
}: MakePackagePageProps) {
  const canExport = files.length > 0;
  const installNamespace = manifestDraft.installNamespace ?? { brand: '', product: '' };
  const fields: Array<{ field: keyof ManifestDraft; label: string }> = [
    { field: 'name', label: 'Package name' },
    { field: 'id', label: 'Package id' },
    { field: 'version', label: 'Version' },
    { field: 'author', label: 'Author' },
    { field: 'description', label: 'Description' },
    { field: 'category', label: 'Category' },
    { field: 'minResolveVersion', label: 'Min Resolve version' }
  ];
  const previewTitle = manifestDraft.name || 'Untitled package';
  const previewId = manifestDraft.id || 'package.id';
  const previewDescription = manifestDraft.description || 'Add a short description so users know what this package installs.';
  const previewCategory = manifestDraft.category || 'Uncategorized';
  const previewAuthor = manifestDraft.author || 'Unknown author';
  const previewNamespace = [installNamespace.brand || 'brand', installNamespace.product || 'product'].join(' / ');
  const previewIconLabel = iconPreviewPath?.split(/[/\\]/).pop() ?? 'No icon selected';

  function collectDroppedPaths(event: DragEvent<HTMLDivElement>): string[] {
    return Array.from(event.dataTransfer.files)
      .map((file) => (file as File & { path?: string }).path)
      .filter((value): value is string => Boolean(value));
  }

  function getPreviewInitial(): string {
    return (manifestDraft.name || manifestDraft.id || 'P').trim().charAt(0).toUpperCase() || 'P';
  }

  function describeInstallRoot(file: ClassifiedFile): string {
    if (file.detectedType === 'fusion-template') {
      return 'Fusion Templates / Edit / Titles';
    }
    if (file.detectedType === 'fusion-macro') {
      return 'Fusion Templates / Edit / Effects';
    }
    if (file.detectedType === 'fuse') {
      return 'Fusion / Fuses';
    }
    if (file.detectedType === 'script') {
      return 'Fusion / Scripts / Utility';
    }
    if (file.detectedType === 'lut' || file.detectedType === 'dctl') {
      return 'LUT';
    }
    return 'Unmapped';
  }

  function updateInstallNamespace(patch: Partial<typeof installNamespace>): void {
    onManifestChange({
      ...manifestDraft,
      installNamespace: {
        ...installNamespace,
        ...patch
      }
    });
  }

  return (
    <section className="stack">
      <header className="page-header">
        <div className="page-title">
          <span className="eyebrow">Make Package</span>
          <h2>Create a package.</h2>
          <p>Add info, map files, export.</p>
        </div>
        <div className="page-actions">
          <span className="chip-label">{files.length} assets loaded</span>
          <button className="primary-action" onClick={() => void onExport()} disabled={!canExport}>
            Export Package
          </button>
        </div>
      </header>

      <div className="page-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Package Info</h3>
              <div className="panel-subtitle">Basic package details and icon.</div>
            </div>
            <span className="mini-pill">Step 1</span>
          </div>
          <div className="package-info-layout">
            <div className="form-grid">
              {fields.map(({ field, label }) => (
                <label key={field}>
                  <span>{label}</span>
                  <input
                    value={(manifestDraft[field] as string | undefined) ?? ''}
                    onChange={(event) => onManifestChange({ ...manifestDraft, [field]: event.target.value })}
                  />
                </label>
              ))}
              <label>
                <span>Brand folder</span>
                <input value={installNamespace.brand} onChange={(event) => updateInstallNamespace({ brand: event.target.value })} />
              </label>
              <label>
                <span>Product folder</span>
                <input value={installNamespace.product} onChange={(event) => updateInstallNamespace({ product: event.target.value })} />
              </label>
            </div>
            <aside className="icon-picker">
              <div className="icon-picker-header">
                <span>Package icon</span>
                <span className="table-note">Optional but recommended.</span>
              </div>
              <div className="icon-preview">
                {iconPreviewUrl ? (
                  <img src={iconPreviewUrl} alt="" />
                ) : (
                  <div className="icon-preview-fallback">
                    <PackageIcon size={28} />
                    <strong>{getPreviewInitial()}</strong>
                  </div>
                )}
              </div>
              <div className="icon-picker-meta">
                <strong>{previewIconLabel}</strong>
                <span className="table-note">This image is previewed here and bundled into the exported package.</span>
              </div>
              <div className="inline-actions">
                <button className="secondary-action" onClick={() => void onPickIcon()}>
                  <ImageIcon size={16} />
                  {iconPreviewPath ? 'Replace Icon' : 'Add Icon'}
                </button>
                {iconPreviewPath ? (
                  <button className="danger-action" onClick={onClearIcon}>
                    <TrashIcon size={16} />
                    Clear
                  </button>
                ) : null}
              </div>
            </aside>
          </div>
        </div>
        <div className="panel preview-panel">
          <div className="panel-header">
            <div>
              <h3>Install Preview</h3>
              <div className="panel-subtitle">What users will see after install.</div>
            </div>
            <span className="mini-pill">Step 2</span>
          </div>
          <div className="install-preview-card">
            <div className="install-preview-media">
              <div className="install-preview-art">
                {iconPreviewUrl ? <img src={iconPreviewUrl} alt="" /> : <span>{getPreviewInitial()}</span>}
              </div>
            </div>
            <div className="install-preview-copy">
              <span className="eyebrow">{previewId}</span>
              <h3>
                {previewTitle} <small>{manifestDraft.version || '0.0.0'}</small>
              </h3>
              <p>{previewDescription}</p>
              <div className="status-row">
                <span className="mini-pill">{previewCategory}</span>
                <span className="mini-pill">{previewAuthor}</span>
                <span className="mini-pill">{files.length} assets</span>
              </div>
              <div className="preview-stats">
                <div className="preview-stat">
                  <span>Min Resolve</span>
                  <strong>{manifestDraft.minResolveVersion || '18.0'}</strong>
                </div>
                <div className="preview-stat">
                  <span>Package id</span>
                  <strong>{previewId}</strong>
                </div>
                <div className="preview-stat">
                  <span>Install folders</span>
                  <strong>{previewNamespace}</strong>
                </div>
              </div>
              <div className="preview-file-stack">
                {files.length === 0 ? (
                  <div className="preview-empty">
                    <PackageIcon size={16} />
                    <span>No files added yet. Use the button above to load package contents.</span>
                  </div>
                ) : (
                  files.slice(0, 3).map((file) => (
                    <div key={file.assetId} className="preview-file-pill">
                      <strong>{file.fileName}</strong>
                      <span>{describeInstallRoot(file)}</span>
                    </div>
                  ))
                )}
                {files.length > 3 ? <span className="table-note">+{files.length - 3} more assets ready to install.</span> : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Asset Mapping</h3>
            <div className="panel-subtitle">Add files, assign type, and tag emoji variants when needed.</div>
          </div>
          <div className="inline-actions">
            <button className="secondary-action" onClick={() => void onPickFiles()}>
              <FolderIcon size={16} />
              Add Files or Folders
            </button>
            <span className="mini-pill">Step 3</span>
          </div>
        </div>
        {files.length === 0 ? (
          <div
            className="empty-state compact-empty asset-dropzone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const paths = collectDroppedPaths(event);
              if (paths.length > 0) {
                onDropFiles(paths);
              }
            }}
          >
            <h2>No files added.</h2>
            <p>Add files or folders here, then review how each asset will be categorized automatically.</p>
          </div>
        ) : (
          <div
            className="table-shell asset-map-shell"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const paths = collectDroppedPaths(event);
              if (paths.length > 0) {
                onDropFiles(paths);
              }
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Type</th>
                  <th>Variant</th>
                  <th>Install root</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr key={`${file.absolutePath}-${index}`}>
                    <td>
                      <strong>{file.fileName}</strong>
                      <span className="table-note">{file.absolutePath}</span>
                    </td>
                    <td>
                      <select
                        value={file.detectedType ?? ''}
                        onChange={(event) =>
                          onFileChange(index, {
                            detectedType: event.target.value ? (event.target.value as ClassifiedFile['detectedType']) : null
                          })
                        }
                      >
                        <option value="">Unsupported</option>
                        <option value="fusion-template">fusion-template</option>
                        <option value="fusion-macro">fusion-macro</option>
                        <option value="fuse">fuse</option>
                        <option value="script">script</option>
                        <option value="lut">lut</option>
                        <option value="dctl">dctl</option>
                      </select>
                    </td>
                    <td>
                      <select value={file.variant} onChange={(event) => onFileChange(index, { variant: event.target.value as ClassifiedFile['variant'] })}>
                        <option value="standard">standard</option>
                        <option value="emoji">emoji</option>
                      </select>
                    </td>
                    <td>
                      <strong>{describeInstallRoot(file)}</strong>
                      <span className="table-note">Final folder adds `{previewNamespace}` automatically during install.</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Validation</h3>
            <div className="panel-subtitle">Errors block export.</div>
          </div>
          <span className="mini-pill">Step 4</span>
        </div>
        {validationIssues.length === 0 ? <p>No issues yet.</p> : null}
        <div className="issue-list">
          {validationIssues.map((issue, index) => (
            <div key={`${issue.message}-${index}`} className={`issue issue-${issue.severity}`}>
              <strong>{issue.severity.toUpperCase()}</strong>
              <span>{issue.message}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
