import { useEffect, useMemo, useState } from 'react';
import { APP_DISPLAY_VERSION, APP_NAME, APP_PACKAGE_VERSION, FORMAT_VERSION } from '@shared/constants';
import type {
  AppSettings,
  ClassifiedFile,
  InstallPreview,
  InstalledPackageRecord,
  OnpiManifest,
  PackageBuilderInput,
  ValidationIssue
} from '@shared/types';
import { classifyFiles } from '@core/validation/classifyAsset';
import { DownloadIcon, GridIcon, HomeIcon, PackageIcon, SettingsIcon } from '@renderer/components/Icons';
import { HomePage } from '@renderer/pages/HomePage';
import { MakePackagePage } from '@renderer/pages/MakePackagePage';
import { InstallPackagePage } from '@renderer/pages/InstallPackagePage';
import { InstalledPackagesPage } from '@renderer/pages/InstalledPackagesPage';
import { SettingsPage } from '@renderer/pages/SettingsPage';

type NavKey = 'home' | 'make' | 'install' | 'installed' | 'settings';
type ManifestDraft = Omit<OnpiManifest, 'assets'>;

const initialManifest = (appVersion: string): ManifestDraft => ({
  formatVersion: FORMAT_VERSION,
  id: '',
  name: '',
  version: '1.0.0',
  author: '',
  description: '',
  createdWith: APP_NAME,
  createdWithVersion: appVersion,
  minAppVersion: appVersion,
  minResolveVersion: '18.0',
  platforms: ['macos', 'windows'],
  category: '',
  tags: []
});

export function App() {
  const desktopApi = typeof window !== 'undefined' ? window.onpi : undefined;
  const [activeNav, setActiveNav] = useState<NavKey>('home');
  const [appVersion, setAppVersion] = useState(APP_DISPLAY_VERSION);
  const [manifestDraft, setManifestDraft] = useState<ManifestDraft>(initialManifest(APP_PACKAGE_VERSION));
  const [classifiedFiles, setClassifiedFiles] = useState<ClassifiedFile[]>([]);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [selectedArchivePath, setSelectedArchivePath] = useState<string | null>(null);
  const [parsedManifest, setParsedManifest] = useState<OnpiManifest | null>(null);
  const [installPreview, setInstallPreview] = useState<InstallPreview | null>(null);
  const [installedPackages, setInstalledPackages] = useState<InstalledPackageRecord[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [status, setStatus] = useState<string>('Local package tools.');
  const [installError, setInstallError] = useState<string | null>(null);
  const [isInstallLoading, setIsInstallLoading] = useState(false);

  useEffect(() => {
    if (!desktopApi) {
      setStatus('Desktop bridge unavailable.');
      return;
    }

    void (async () => {
      try {
        const [version, installed, currentSettings] = await Promise.all([
          desktopApi.getAppVersion(),
          desktopApi.getInstalledPackages(),
          desktopApi.getSettings()
        ]);
        setAppVersion(version === APP_PACKAGE_VERSION ? APP_DISPLAY_VERSION : version);
        setManifestDraft(initialManifest(version));
        setInstalledPackages(installed);
        setSettings(currentSettings);
      } catch (error) {
        setStatus(`Initialization failed: ${(error as Error).message}`);
      }
    })();
  }, [desktopApi]);

  const navGroups = [
    {
      title: 'My Products',
      items: [
        ['home', 'Home', <HomeIcon key="home" />],
        ['make', 'Make Package', <PackageIcon key="make" />],
        ['install', 'Install Package', <DownloadIcon key="install" />],
        ['installed', 'Installed', <GridIcon key="installed" />]
      ]
    },
    {
      title: 'Workspace',
      items: [['settings', 'Settings', <SettingsIcon key="settings" />]]
    }
  ] as const;

  if (!desktopApi) {
    return (
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-head">
              <span className="brand-mark">◫</span>
              <span className="brand-name">ONPI</span>
            </div>
          </div>
        </aside>
        <main className="content">
          <section className="stack">
            <div className="fallback-panel">
              <span className="eyebrow">Fallback UI</span>
              <h2>The renderer is up, but Electron APIs did not load.</h2>
              <p>The preload bridge did not load.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const api = desktopApi;

  const summaryStats = useMemo(
    () => ({
      assetCount: classifiedFiles.length,
      installCount: installedPackages.length
    }),
    [classifiedFiles.length, installedPackages.length]
  );

  async function handlePickFiles(): Promise<void> {
    const filePaths = await api.pickSourceFiles();
    const next = classifyFiles(filePaths);
    setClassifiedFiles(next);
    setStatus(`${next.length} files loaded.`);
  }

  function updateClassifiedFile(index: number, patch: Partial<ClassifiedFile>): void {
    setClassifiedFiles((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  async function handleExportPackage(): Promise<void> {
    const outputName = `${(manifestDraft.name || 'package').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${manifestDraft.version}.onpi`;
    const input: PackageBuilderInput = {
      manifest: manifestDraft,
      assets: classifiedFiles,
      outputPath: `${settings?.defaultExportDirectory ?? '.'}/${outputName}`
    };
    const result = await api.exportPackage(input);
    setValidationIssues(result.issues);
    if (result.issues.some((issue) => issue.severity === 'error')) {
      setStatus('Export blocked.');
      return;
    }
    setStatus(`Exported package to ${result.outputPath}`);
  }

  function handleDroppedSourceFiles(filePaths: string[]): void {
    const next = classifyFiles(filePaths);
    setClassifiedFiles(next);
    setStatus(`${next.length} files loaded.`);
  }

  async function handleDroppedArchive(filePath: string): Promise<void> {
    setIsInstallLoading(true);
    setInstallError(null);
    try {
      const [parsed, preview] = await Promise.all([api.parsePackage(filePath), api.previewInstall(filePath, 'user')]);
      setSelectedArchivePath(filePath);
      setParsedManifest(parsed.manifest);
      setInstallPreview(preview);
      setStatus(`Loaded ${parsed.manifest.name}.`);
    } catch (error) {
      setSelectedArchivePath(filePath);
      setParsedManifest(null);
      setInstallPreview(null);
      setInstallError((error as Error).message);
      setStatus('Package load failed.');
    } finally {
      setIsInstallLoading(false);
    }
  }

  async function handlePickPackage(): Promise<void> {
    const filePath = await api.pickPackageFile();
    if (filePath) {
      await handleDroppedArchive(filePath);
    }
  }

  async function handleInstallPackage(): Promise<void> {
    if (!selectedArchivePath) {
      return;
    }
    setIsInstallLoading(true);
    setInstallError(null);
    try {
      const record = await api.installPackage(selectedArchivePath, 'user');
      const installed = await api.getInstalledPackages();
      setInstalledPackages(installed);
      setStatus(`Installed ${record.name} ${record.version}.`);
      setActiveNav('installed');
    } catch (error) {
      setInstallError((error as Error).message);
      setStatus('Install failed.');
    } finally {
      setIsInstallLoading(false);
    }
  }

  async function handleUninstallPackage(installId: string): Promise<void> {
    await api.uninstallPackage(installId);
    const installed = await api.getInstalledPackages();
    setInstalledPackages(installed);
    setStatus('Package removed.');
  }

  async function handleSaveSettings(next: AppSettings): Promise<void> {
    const saved = await api.saveSettings(next);
    setSettings(saved);
    setStatus('Settings saved.');
  }

  const page = (() => {
    if (activeNav === 'make') {
      return (
        <MakePackagePage
          manifestDraft={manifestDraft}
          files={classifiedFiles}
          validationIssues={validationIssues}
          onManifestChange={setManifestDraft}
          onPickFiles={handlePickFiles}
          onDropFiles={handleDroppedSourceFiles}
          onFileChange={updateClassifiedFile}
          onExport={handleExportPackage}
        />
      );
    }

    if (activeNav === 'install') {
      return (
        <InstallPackagePage
          archivePath={selectedArchivePath}
          manifest={parsedManifest}
          preview={installPreview}
          installError={installError}
          isLoading={isInstallLoading}
          onPickPackage={handlePickPackage}
          onDropPackage={handleDroppedArchive}
          onInstall={handleInstallPackage}
        />
      );
    }

    if (activeNav === 'installed') {
      return <InstalledPackagesPage packages={installedPackages} onUninstall={handleUninstallPackage} onRevealPath={api.revealPath} />;
    }

    if (activeNav === 'settings') {
      return settings ? (
        <SettingsPage settings={settings} onSave={handleSaveSettings} onOpenLogs={api.openLogsFolder} onClearTemp={api.clearTempFiles} />
      ) : (
        <div className="panel">Loading settings…</div>
      );
    }

    return <HomePage assetCount={summaryStats.assetCount} installCount={summaryStats.installCount} onNavigate={setActiveNav} />;
  })();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-head">
            <span className="brand-mark">◫</span>
            <span className="brand-name">ONPI</span>
          </div>
        </div>
        {navGroups.map((group) => (
          <section key={group.title} className="nav-section">
            <div className="nav-title">{group.title}</div>
            <nav className="nav">
              {group.items.map(([key, label, icon]) => (
                <button key={key} className={activeNav === key ? 'nav-button is-active' : 'nav-button'} onClick={() => setActiveNav(key as NavKey)}>
                  <span className="nav-icon">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </section>
        ))}
        <div className="sidebar-footer">
          <div className="status-card">
            <span className="version-pill">v{appVersion}</span>
            <p>{status}</p>
          </div>
        </div>
      </aside>
      <section className="app-shell">
        <header className="topbar simple-topbar">
          <div className="page-title">
            <h2>Package Manager</h2>
            <p>Connected to local resolve environment.</p>
          </div>
          <div className="sort-shell core-status">
            <strong>Core Status: OK</strong>
          </div>
        </header>
        <main className="content">{page}</main>
      </section>
    </div>
  );
}
