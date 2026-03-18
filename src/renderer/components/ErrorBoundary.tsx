import { Component, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: ''
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message
    };
  }

  componentDidCatch(error: Error): void {
    console.error('Renderer crash:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="shell">
          <main className="content">
            <section className="stack">
              <div className="panel">
                <span className="eyebrow">Renderer Error</span>
                <h2>The app hit a renderer error, but the UI fallback is still alive.</h2>
                <p>{this.state.message}</p>
              </div>
            </section>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}
