import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#171717] border border-white/10 p-8 rounded-none shadow-2xl text-center">
            <div className="w-14 h-14 bg-[#202124] border border-[#F4FF00]/40 text-[#F4FF00] flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-[2px] w-6 bg-[#F4FF00]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F4FF00]">
                APPLICATION NOTIFICATION
              </span>
              <span className="h-[2px] w-6 bg-[#F4FF00]" />
            </div>

            <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
              Page Ready to Refresh
            </h1>

            <p className="text-xs text-[#A8AFB8] leading-relaxed mb-6">
              The application encountered a temporary display issue during initialization. Reloading the page will restore normal operation.
            </p>

            {this.state.error?.message && (
              <div className="bg-[#0B0B0B] border border-white/10 p-3 mb-6 text-left">
                <span className="text-[10px] font-mono text-white/50 uppercase block mb-1">Details:</span>
                <p className="text-[11px] font-mono text-[#F4FF00] break-words line-clamp-3">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-[#F4FF00] hover:bg-white text-[#0B0B0B] font-bold text-xs uppercase tracking-wider py-3.5 px-4 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-[#202124] hover:bg-[#2A2B2F] border border-white/10 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
