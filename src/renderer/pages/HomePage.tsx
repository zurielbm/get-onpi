type HomePageProps = {
  assetCount: number;
  installCount: number;
  onNavigate: (target: 'home' | 'make' | 'install' | 'installed' | 'settings') => void;
};

export function HomePage({ assetCount, installCount, onNavigate }: HomePageProps) {
  return (
    <section className="hero">
      <div className="dashboard-grid">
        <article className="product-card">
          <div className="product-visual" />
          <div className="product-body">
            <div className="product-topline">
              <span>Pipeline</span>
            </div>
            <div className="product-title">Make Package</div>
            <p className="helper-copy">Create `.onpi` packages from local files.</p>
            <div className="product-actions">
              <button className="pill is-primary" onClick={() => onNavigate('make')}>
                Launch Builder
              </button>
              <span className="mini-pill">{assetCount} Assets</span>
            </div>
          </div>
        </article>

        <article className="product-card">
          <div className="product-visual is-blue" />
          <div className="product-body">
            <div className="product-topline">
              <span>Deploy</span>
            </div>
            <div className="product-title">Install Package</div>
            <p className="helper-copy">Preview paths before install.</p>
            <div className="product-actions">
              <button className="pill is-primary" onClick={() => onNavigate('install')}>
                Preview Install
              </button>
              <span className="mini-pill">Run Checks</span>
            </div>
          </div>
        </article>

        <article className="product-card">
          <div className="product-visual is-purple" />
          <div className="product-body">
            <div className="product-topline">
              <span>Registry</span>
            </div>
            <div className="product-title">Installed</div>
            <p className="helper-copy">View and remove tracked installs.</p>
            <div className="product-actions">
              <button className="pill is-secondary" onClick={() => onNavigate('installed')}>
                Open Registry
              </button>
              <span className="mini-pill">{installCount} records</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
