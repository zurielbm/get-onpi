import type { DragEvent } from 'react';
import type { ClassifiedFile, OnpiManifest, ValidationIssue } from '@shared/types';

type ManifestDraft = Omit<OnpiManifest, 'assets'>;

type MakePackagePageProps = {
  manifestDraft: ManifestDraft;
  files: ClassifiedFile[];
  validationIssues: ValidationIssue[];
  onManifestChange: (value: ManifestDraft) => void;
  onPickFiles: () => Promise<void>;
  onDropFiles: (filePaths: string[]) => void;
  onFileChange: (index: number, patch: Partial<ClassifiedFile>) => void;
  onExport: () => Promise<void>;
};

export function MakePackagePage({
  manifestDraft,
  files,
  validationIssues,
  onManifestChange,
  onPickFiles,
  onDropFiles,
  onFileChange,
  onExport
}: MakePackagePageProps) {
  const canExport = files.length > 0;
  const fields: Array<{ field: keyof ManifestDraft; label: string }> = [
    { field: 'name', label: 'Package name' },
    { field: 'id', label: 'Package id' },
    { field: 'version', label: 'Version' },
    { field: 'author', label: 'Author' },
    { field: 'description', label: 'Description' },
    { field: 'category', label: 'Category' },
    { field: 'minResolveVersion', label: 'Min Resolve version' }
  ];

  function collectDroppedPaths(event: DragEvent<HTMLDivElement>): string[] {
    return Array.from(event.dataTransfer.files)
      .map((file) => (file as File & { path?: string }).path)
      .filter((value): value is string => Boolean(value));
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
              <div className="panel-subtitle">Basic package details.</div>
            </div>
            <span className="mini-pill">Step 1</span>
          </div>
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
          </div>
        </div>
        <div
          className="panel dropzone is-hero"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const paths = collectDroppedPaths(event);
            if (paths.length > 0) {
              onDropFiles(paths);
            }
          }}
        >
          <div className="dropzone-copy">
            <span className="eyebrow">Step 2</span>
            <h3>Add Files</h3>
            <p>Drop files or folders to begin.</p>
            <button className="secondary-action" onClick={() => void onPickFiles()}>
              Add Files or Folders
            </button>
          </div>
          <div className="dropzone-graphic">
            <div className="dropzone-tile" />
            <div className="dropzone-tile is-accent" />
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Asset Mapping</h3>
            <div className="panel-subtitle">Edit type and target.</div>
          </div>
          <span className="mini-pill">Step 3</span>
        </div>
        {files.length === 0 ? (
          <div className="empty-state compact-empty">
            <h2>No files added.</h2>
            <p>Add files first, then map targets here.</p>
          </div>
        ) : (
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Type</th>
                  <th>Target path</th>
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
                      <input value={file.targetPath} onChange={(event) => onFileChange(index, { targetPath: event.target.value })} />
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
