import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-canvas p-6 text-white">
          <div className="bg-panel rounded-lg p-6 shadow-xl border border-red-500/20">
            <h1 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h1>
            <p className="text-sm text-zinc-300 mb-4">
              The side panel crashed. Here is the error:
            </p>
            <pre className="bg-black/50 p-3 rounded text-xs text-red-300 overflow-x-auto max-w-[300px]">
              {this.state.error?.message}
            </pre>
            <button
              className="mt-4 w-full rounded bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
