import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Button from '@/components/Button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-[#f5f5f7] dark:bg-[#0b0f17] text-[#0f172a] dark:text-white">
          <div className="max-w-md w-full bg-white dark:bg-[#161f30] rounded-3xl p-8 border border-black/[0.08] dark:border-white/[0.08] shadow-apple-card text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-black tracking-tight">Something went wrong</h2>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-1.5 leading-relaxed">
                An unexpected rendering error occurred. The application prevented a crash.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] text-[11px] font-mono text-left text-red-500 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                icon={RotateCcw}
                onClick={this.handleReset}
              >
                Reload View
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={Home}
                onClick={() => {
                  window.location.href = '/';
                }}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
