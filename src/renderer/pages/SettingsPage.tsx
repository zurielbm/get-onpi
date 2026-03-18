import { useEffect, useState } from 'react';
import { FolderIcon, TrashIcon } from '@renderer/components/Icons';
import type { AppSettings } from '@shared/types';

type SettingsPageProps = {
  settings: AppSettings;
  onSave: (settings: AppSettings) => Promise<void>;
  onOpenLogs: () => Promise<void>;
  onClearTemp: () => Promise<void>;
};

export function SettingsPage({ settings, onSave, onOpenLogs, onClearTemp }: SettingsPageProps) {
  const [draftDirectory, setDraftDirectory] = useState(settings.defaultExportDirectory ?? '');
  const [emojiContains, setEmojiContains] = useState(settings.emojiDetectionContains.join(', '));
  const [emojiSuffixes, setEmojiSuffixes] = useState(settings.emojiDetectionSuffixes.join(', '));

  useEffect(() => {
    setDraftDirectory(settings.defaultExportDirectory ?? '');
    setEmojiContains(settings.emojiDetectionContains.join(', '));
    setEmojiSuffixes(settings.emojiDetectionSuffixes.join(', '));
  }, [settings.defaultExportDirectory, settings.emojiDetectionContains, settings.emojiDetectionSuffixes]);

  function parseList(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return (
    <section className="stack">
      <header className="page-header">
        <div className="page-title">
          <span className="eyebrow">Settings</span>
          <h2>Settings.</h2>
          <p>Local preferences only.</p>
        </div>
      </header>

      <div className="page-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Defaults</h3>
              <div className="panel-subtitle">Export and install defaults.</div>
            </div>
            <button
              className="primary-action"
              onClick={() =>
                void onSave({
                  ...settings,
                  defaultExportDirectory: draftDirectory || null,
                  emojiDetectionContains: parseList(emojiContains),
                  emojiDetectionSuffixes: parseList(emojiSuffixes)
                })
              }
            >
              Save
            </button>
          </div>
          <label>
            <span>Default install scope</span>
            <input value={settings.defaultInstallScope} disabled />
          </label>
          <label>
            <span>Default export directory</span>
            <input
              value={draftDirectory}
              placeholder="Choose via export dialog"
              onChange={(event) => setDraftDirectory(event.target.value)}
            />
          </label>
          <label>
            <span>Emoji match: contains</span>
            <input value={emojiContains} placeholder="emoji, emj" onChange={(event) => setEmojiContains(event.target.value)} />
          </label>
          <label>
            <span>Emoji match: ends with</span>
            <input value={emojiSuffixes} placeholder="-emoji, _emoji" onChange={(event) => setEmojiSuffixes(event.target.value)} />
          </label>
        </div>
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Maintenance</h3>
              <div className="panel-subtitle">Logs and temp files.</div>
            </div>
          </div>
          <div className="inline-actions">
            <button className="secondary-action" onClick={() => void onOpenLogs()}>
              <FolderIcon size={16} />
              Open Logs Folder
            </button>
            <button className="secondary-action" onClick={() => void onClearTemp()}>
              <TrashIcon size={16} />
              Clear Temp Files
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
